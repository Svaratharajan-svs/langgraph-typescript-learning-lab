import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";
import { z } from "zod";
import { chat } from "../config/env.js";

type Event={node:string;durationMs:number;ok:boolean;tokens?:number};
export function observable(log:(event:Event)=>void,reply:(text:string)=>Promise<AIMessage>=text=>chat().invoke(text)) {
 const State=new StateSchema({text:z.string(),answer:z.string().default("")});
 return new StateGraph(State).addNode("reply",async ({text})=>{
   const started=performance.now();
   try {
     const message=await reply(text);
     log({node:"reply",durationMs:performance.now()-started,ok:true,tokens:message.usage_metadata?.total_tokens});
     return {answer:message.text};
   } catch(error) {
     log({node:"reply",durationMs:performance.now()-started,ok:false});
     throw error;
   }
 }).addEdge(START,"reply").addEdge("reply",END).compile();
}
