import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";
import { ask, Ask } from "../config/env.js";

const State=new StateSchema({question:z.string(),query:z.string().default(""),evidence:z.string().default(""),attempt:z.number().default(0),answer:z.string().default("")});
const search=(query:string,external:boolean)=>external && /checkpoint|durable/i.test(query)?"Checkpoint storage provides durable execution.":/thread/i.test(query)?"Use a distinct thread ID per conversation.":"";
export function corrective(generate:Ask=ask) {
 return new StateGraph(State).addNode("retrieve",({question,query,attempt})=>({evidence:search(query||question,attempt>0)}))
 .addNode("rewrite",async ({question})=>({query:await generate("Rewrite as a short search query: "+question),attempt:1}))
 .addNode("compose",async ({question,evidence})=>{
   if(!evidence) return {answer:"Insufficient evidence"};
   const answer=await generate("Respond using an exact sentence from the evidence. "+JSON.stringify({question,evidence}));
   return {answer:answer.trim() && evidence.includes(answer.trim())?answer.trim():"Insufficient evidence"};
 }).addEdge(START,"retrieve").addConditionalEdges("retrieve",({evidence,attempt})=>evidence||attempt?"compose":"rewrite",["compose","rewrite"])
 .addEdge("rewrite","retrieve").addEdge("compose",END).compile();
}
