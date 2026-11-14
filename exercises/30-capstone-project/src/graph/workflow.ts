import { StateSchema, StateGraph, START, END, MessagesValue, BaseCheckpointSaver, interrupt } from "@langchain/langgraph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import type { Ask } from "../config/env.js";
import { Evidence, type Chunk } from "../services/documents.js";

const State=new StateSchema({question:z.string(),context:z.array(Evidence).default(()=>[]),answer:z.string().default(""),owner:z.string(),history:MessagesValue});
type Find=(owner:string,question:string)=>Promise<Chunk[]>;
export function knowledge(checkpointer:BaseCheckpointSaver,find:Find,generate:Ask) {
 return new StateGraph(State)
 .addNode("supervisor",({question})=>({history:[new HumanMessage(question)],answer:""}))
 .addNode("librarian",async ({owner,question})=>({context:await find(owner,question)}))
 .addNode("approval",({context})=>({answer:z.boolean().parse(interrupt({sources:context.map(c=>c.id)}))?"approved":"Declined."}))
 .addNode("writer",async ({question,history,context})=>{
   const answer=await generate("Answer using only evidence. Cite source IDs. "+JSON.stringify({question,history:history.slice(-6).map(m=>m.text),context}));
   return {answer,history:[new AIMessage(answer)]};
 }).addNode("empty",()=>({answer:"No relevant evidence."}))
 .addEdge(START,"supervisor").addEdge("supervisor","librarian")
 .addConditionalEdges("librarian",({context})=>context.length?"approval":"empty",["approval","empty"])
 .addConditionalEdges("approval",({answer})=>answer==="approved"?"writer":END,["writer",END])
 .addEdge("writer",END).addEdge("empty",END).compile({checkpointer});
}
