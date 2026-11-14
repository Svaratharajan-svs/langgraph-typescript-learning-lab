import { StateSchema, StateGraph, START, END, MemorySaver, Command, interrupt } from "@langchain/langgraph";
import { z } from "zod";

const State = new StateSchema({ amount:z.number().positive(), decision:z.string().default("pending") });
export function expenses() {
 return new StateGraph(State).addNode("review",({amount})=>{
   const approved=z.boolean().parse(interrupt({amount,question:"Approve expense?"}));
   return {decision:approved?"approved":"rejected"};
 }).addEdge(START,"review").addEdge("review",END).compile({checkpointer:new MemorySaver()});
}
export async function review(approved:boolean) {
 const graph=expenses(); const options={configurable:{thread_id:"expense"}};
 const paused=await graph.invoke({amount:125},options);
 const resumed=await graph.invoke(new Command({resume:approved}),options);
 return {paused,resumed};
}
