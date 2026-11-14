import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";
import { ask, Ask } from "../config/env.js";

const State=new StateSchema({text:z.string(),answer:z.string().default(""),source:z.string().default("")});
class Transient extends Error {}
export function resilient(primary:Ask=ask, fallback:Ask=async text=>`Queued for review: ${text}`) {
 const attempted=async (text:string) => {
   try { return await primary(text,AbortSignal.timeout(8000)); }
   catch(error) { throw new Transient("Primary failed",{cause:error}); }
 };
 return new StateGraph(State)
 .addNode("recover",async ({text})=>{
   try {
     const inner=new StateGraph(State).addNode("primary",async ({text})=>({answer:await attempted(text)}),
       {retryPolicy:{maxAttempts:2,initialInterval:10,retryOn:error=>error instanceof Transient}})
       .addEdge(START,"primary").addEdge("primary",END).compile();
     return {answer:(await inner.invoke({text})).answer,source:"primary"};
   } catch(error) {
     if (!(error instanceof Transient)) throw error;
     return {answer:await fallback(text),source:"fallback"};
   }
 }).addEdge(START,"recover").addEdge("recover",END).compile();
}
