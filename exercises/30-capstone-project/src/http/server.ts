import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { config } from "../config/env.js";

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
export async function listen(app:Awaited<ReturnType<typeof server>>) {
 const shutdown=()=>{void app.close().catch(error=>{console.error(error);process.exitCode=1;});};
 process.once("SIGINT",shutdown);
 process.once("SIGTERM",shutdown);
 await app.listen({host:"127.0.0.1",port:config.PORT});
}
export const sse=(event:string,data:unknown)=>`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

