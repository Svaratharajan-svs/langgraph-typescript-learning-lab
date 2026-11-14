import { StateSchema, StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { z } from "zod";
import { config } from "../config/env.js";

const State=new StateSchema({input:z.number(),adjusted:z.number().default(0),output:z.number().default(0)});
export async function travel() {
 const graph=new StateGraph(State).addNode("adjust",({input})=>({adjusted:input+1}))
 .addNode("double",({adjusted})=>({output:2*adjusted}))
 .addEdge(START,"adjust").addEdge("adjust","double").addEdge("double",END).compile({checkpointer:new MemorySaver()});
 const options={configurable:{thread_id:"travel"}};
 const original=await graph.invoke({input:3},options);
 const history=[];
 for await(const state of graph.getStateHistory(options)) history.push(state);
 const checkpoint=history.find(state=>state.next.includes("double"));
 if(!checkpoint) throw new Error("Missing checkpoint before double");
 const replay=await graph.invoke(null,checkpoint.config);
 const fork=await graph.updateState(checkpoint.config,{adjusted:10},"adjust");
 const changed=await graph.invoke(null,fork);
 return {original:original.output,replay:replay.output,fork:changed.output,latest:(await graph.getState(options)).values.output};
}
