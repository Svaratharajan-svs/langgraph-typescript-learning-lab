import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";

const Child=new StateSchema({input:z.string(),output:z.string().default("")});
function stage(name:string, transform:(input:string)=>string) {
 return new StateGraph(Child).addNode(name,({input})=>({output:transform(input)}))
 .addEdge(START,name).addEdge(name,END).compile();
}
const search=stage("lookup",input=>`Guide for ${input}`);
const analyze=stage("inspect",input=>input.toLowerCase());
const summarize=stage("condense",input=>`Summary: ${input}`);
const Parent=new StateSchema({topic:z.string(), evidence:z.string().default(""), finding:z.string().default(""), report:z.string().default("")});
export const graph=new StateGraph(Parent)
 .addNode("search",async ({topic})=>({evidence:(await search.invoke({input:topic})).output}))
 .addNode("analyze",async ({evidence})=>({finding:(await analyze.invoke({input:evidence})).output}))
 .addNode("summarize",async ({finding})=>({report:(await summarize.invoke({input:finding})).output}))
 .addEdge(START,"search").addEdge("search","analyze").addEdge("analyze","summarize").addEdge("summarize",END).compile();
