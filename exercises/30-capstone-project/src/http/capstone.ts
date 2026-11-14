import multipart from "@fastify/multipart";
import { Command } from "@langchain/langgraph";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import { Pool } from "pg";
import { z } from "zod";
import { ask, config, embeddings } from "../config/env.js";
import { knowledge } from "../graph/workflow.js";
import { chunks, cosine, extractPdf } from "../services/documents.js";
import { server, sse } from "./server.js";

const Scope=z.object({owner:z.string().regex(/^[a-z0-9-]{1,60}$/),thread:z.uuid()});
const AskBody=Scope.extend({question:z.string().trim().min(1).max(4000)});
export async function capstone(key:string) {
 const app=server(key);
 app.register(multipart,{limits:{fileSize:4*1024*1024,files:1}});
 const pool=new Pool({connectionString:config.DATABASE_URL});
 app.addHook("onClose",async()=>pool.end());
 try {
   await pool.query("CREATE SCHEMA IF NOT EXISTS lab30");
   await pool.query("CREATE TABLE IF NOT EXISTS lab30.chunks (owner text,id text,body text,embedding jsonb, PRIMARY KEY(owner,id))");
   const saver=new PostgresSaver(pool,undefined,{schema:"lab30"}); await saver.setup();
   const embed=embeddings();
   const graph=knowledge(saver,async (owner,question)=>{
     const {rows}=await pool.query<{id:string;body:string;embedding:number[]}>("SELECT id,body,embedding FROM lab30.chunks WHERE owner=$1 LIMIT 2000",[owner]);
     if(!rows.length) return [];
     const vector=await embed.embedQuery(question);
     return rows.map(r=>({id:r.id,text:r.body,score:cosine(vector,r.embedding)})).sort((a,b)=>b.score-a.score).slice(0,3).map(({id,text})=>({id,text}));
   },ask);
   const options=({owner,thread}:z.infer<typeof Scope>)=>({configurable:{thread_id:`${owner}/${thread}`}});
   const active=new Set<string>();
   async function exclusive<T>(scope:z.infer<typeof Scope>,run:()=>Promise<T>) {
     const id=options(scope).configurable.thread_id;
     if(active.has(id)) throw Object.assign(new Error("Thread busy"),{statusCode:409});
     active.add(id);
     try {return await run();} finally {active.delete(id);}
   }
   app.post("/documents/:owner",async request=>{
     const {owner}=Scope.pick({owner:true}).parse(request.params);
     const file=await request.file();
     if(!file||file.mimetype!=="application/pdf") throw Object.assign(new Error("PDF required"),{statusCode:415});
     const parsed=chunks(await extractPdf(await file.toBuffer()));
     if(!parsed.length || parsed.length>200) throw Object.assign(new Error("Invalid document size"),{statusCode:422});
     const vectors=await embed.embedDocuments(parsed.map(row=>row.text));
     const id=randomUUID();
     const data=parsed.map((entry,index)=>({id:`${id}/${entry.id}`,body:entry.text,embedding:vectors[index]}));
     await pool.query("INSERT INTO lab30.chunks SELECT $1,id,body,embedding FROM jsonb_to_recordset($2::jsonb) AS x(id text,body text,embedding jsonb)",[owner,JSON.stringify(data)]);
     return {id,chunks:parsed.length};
   });
   app.post("/ask",async request=>{
     const input=AskBody.parse(request.body);
     return exclusive(input,async()=>{
       if((await graph.getState(options(input))).next.length) throw Object.assign(new Error("Approval pending"),{statusCode:409});
       return graph.invoke({owner:input.owner,question:input.question},options(input));
     });
   });
   app.get("/history/:owner/:thread",async request=>{
     const scope=Scope.parse(request.params);
     const state=await graph.getState(options(scope));
     return {messages:state.values.history??[],pending:state.next};
   });
   app.post("/approve",async (request,reply)=>{
     const input=Scope.extend({approved:z.boolean()}).parse(request.body);
     const id=options(input).configurable.thread_id;
     if(active.has(id)) return reply.code(409).send({error:"Thread busy"});
     active.add(id);
     let handedOff=false;
     try {
       if(!(await graph.getState(options(input))).next.includes("approval")) return reply.code(409).send({error:"No pending approval"});
       async function* events() {
         try {
           for await(const update of await graph.stream(new Command({resume:input.approved}),{...options(input),streamMode:"updates"})) yield sse("update",update);
         } catch (error) {
           request.log.error({err:error},"Approval stream failed");
           yield sse("error",{message:"Approval stream failed"});
         }
       }
       const stream=Readable.from(events());
       stream.once("close",()=>active.delete(id));
       reply.raw.once("close",()=>stream.destroy());
       handedOff=true;
       return reply.type("text/event-stream").send(stream);
     } finally {if(!handedOff) active.delete(id);}
   });
   return {app};
 } catch(error) {await app.close();throw error;}
}
