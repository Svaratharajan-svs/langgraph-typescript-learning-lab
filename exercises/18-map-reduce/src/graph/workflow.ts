import { StateSchema, StateGraph, START, END, ReducedValue, Send } from "@langchain/langgraph";
import { z } from "zod";

const State=new StateSchema({sections:z.array(z.string()),counts:new ReducedValue(z.array(z.number()).default(()=>[]),{reducer:(a,b)=>a.concat(b)}),total:z.number().default(0)});
export const graph=new StateGraph(State)
 .addNode("split",()=>({}))
 .addNode("count",({section})=>({counts:[section.trim().split(/\s+/).filter(Boolean).length]}),{input:new StateSchema({section:z.string()})})
 .addNode("reduce",({counts})=>({total:counts.reduce((sum,next)=>sum+next,0)}))
 .addEdge(START,"split")
 .addConditionalEdges("split",({sections})=>sections.length?sections.map(section=>new Send("count",{section})):"reduce",["count","reduce"])
 .addEdge("count","reduce").addEdge("reduce",END).compile();
