import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { Readable } from "node:stream";
import { z } from "zod";
import { config, ask, Ask } from "../config/env.js";
import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";

export function server(key:string) {
 const secret=z.string().min(16).parse(key);
 const app=Fastify({logger:process.env.NODE_ENV!=="test",bodyLimit:1024*1024});
 app.register(rateLimit,{max:30,timeWindow:"1 minute"});
 app.addHook("onRequest",async (request,reply)=>{
   if(request.url==="/health") return;
   const actual=Buffer.from(String(request.headers.authorization??""));
   const expected=Buffer.from("Bearer "+secret);
   if(actual.length!==expected.length||!timingSafeEqual(actual,expected)) return reply.code(401).send({error:"Unauthorized"});
 });
 app.get("/health",async()=>({status:"ok"}));
 app.setErrorHandler((error,request,reply)=>{
   if(error instanceof z.ZodError) return reply.code(400).send({error:"Invalid input",issues:error.issues});
   const status=typeof error==="object"&&error!==null&&"statusCode" in error&&typeof error.statusCode==="number" ? error.statusCode : 500;
   if(status>=500) request.log.error({err:error},"Request failed");
   return reply.code(status).send({error:status>=500?"Request failed":"Request rejected"});
 });
 return app;
}
export async function listen(app:ReturnType<typeof server>) {
 const shutdown=()=>{void app.close().catch(error=>{console.error(error);process.exitCode=1;});};
 process.once("SIGINT",shutdown);
 process.once("SIGTERM",shutdown);
 await app.listen({host:"127.0.0.1",port:config.PORT});
}
const sse=(event:string,data:unknown)=>`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

const Input=z.object({text:z.string().trim().min(1).max(4000)});
export function agentApi(key:string,generate:Ask=ask) {
 const app=server(key);
 const State=new StateSchema({text:z.string(),answer:z.string().default("")});
 const graph=new StateGraph(State).addNode("generate",async ({text},runtime)=>{
   runtime.writer?.({status:"generating"});
   return {answer:await generate(text)};
 }).addEdge(START,"generate").addEdge("generate",END).compile();
 type JobStatus={status:"pending"|"complete"|"failed";result?:unknown};
 const jobs=new Map<string,JobStatus>();
 const running=new Set<Promise<void>>();
 app.post("/run",async request=>graph.invoke(Input.parse(request.body)));
 app.post("/stream",async (request,reply)=>{
   const input=Input.parse(request.body);
   async function* events(){
     try {for await(const update of await graph.stream(input,{streamMode:["custom","updates"]})) yield sse(update[0],update[1]);}
     catch {yield sse("error",{message:"Graph execution failed"});}
   }
   return reply.type("text/event-stream").send(Readable.from(events()));
 });
 app.post("/jobs",async (request,reply)=>{
   const input=Input.parse(request.body);
   if(jobs.size>=50) return reply.code(503).send({error:"Job capacity reached"});
   const id=randomUUID();
   jobs.set(id,{status:"pending"});
   const job=graph.invoke(input).then(
     result=>{jobs.set(id,{status:"complete",result});},
     ()=>{jobs.set(id,{status:"failed"});},
   ).finally(()=>{
     running.delete(job);
     setTimeout(()=>jobs.delete(id),60000).unref();
   });
   running.add(job);
   return reply.code(202).send({id});
 });
 app.get("/jobs/:id",async(request,reply)=>{
   const {id}=z.object({id:z.uuid()}).parse(request.params);
   const job=jobs.get(id);
   if(!job) return reply.code(404).send({error:"Job not found"});
   return job;
 });
 app.addHook("onClose",async()=>{await Promise.all(running);});
 return app;
}
