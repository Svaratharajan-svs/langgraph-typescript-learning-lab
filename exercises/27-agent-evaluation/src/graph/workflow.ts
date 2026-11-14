import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const State=new StateSchema({question:z.string(),answer:z.string().default(""),toolName:z.string().default("")});
export function subject(reply:(input:string)=>Promise<{answer:string;toolName:string}>) {
 return new StateGraph(State).addNode("reply",({question})=>reply(question))
 .addEdge(START,"reply").addEdge("reply",END).compile();
}
const dataset=[
 {question:"2 + 3",answer:"5",evidence:"2 + 3 = 5",toolName:"add"},
 {question:"SKU 42",answer:"In stock",evidence:"SKU 42: In stock",toolName:"inventory"},
];
export const fixture=subject(async q=>q.includes("+")?{answer:"5",toolName:"add"}:{answer:"In stock",toolName:"inventory"});
export async function evaluate(graph:ReturnType<typeof subject>) {
 const rows=await Promise.all(dataset.map(async example=>{
   const result=await graph.invoke({question:example.question});
   return {correct:result.answer===example.answer,grounded:result.answer.length>0&&example.evidence.includes(result.answer),tool:result.toolName===example.toolName};
 }));
 return {accuracy:rows.filter(r=>r.correct).length/rows.length,faithfulnessProxy:rows.filter(r=>r.grounded).length/rows.length,toolAccuracy:rows.filter(r=>r.tool).length/rows.length};
}
