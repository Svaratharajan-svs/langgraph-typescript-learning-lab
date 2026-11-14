import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";
import { ask, Ask } from "../config/env.js";

const State=new StateSchema({goal:z.string(),plan:z.string().default(""),critique:z.string().default(""),result:z.string().default(""),revisions:z.number().default(0)});
export function planning(generate:Ask=ask) {
 return new StateGraph(State).addNode("draftPlan",async ({goal,plan,critique,revisions})=>({
   plan:await generate("Produce a staged plan with owners and verification steps. "+JSON.stringify({goal,plan,critique})),revisions:revisions+1,
 })).addNode("critic",async ({plan})=>({critique:await generate("Return APPROVED or list concrete risks to fix. "+plan)}))
 .addNode("deliver",({plan,critique})=>({result:critique.trim()==="APPROVED"?plan:"Needs review: "+plan}))
 .addEdge(START,"draftPlan").addEdge("draftPlan","critic")
 .addConditionalEdges("critic",({critique,revisions})=>critique.trim()==="APPROVED"||revisions>=2?"deliver":"draftPlan",["deliver","draftPlan"])
 .addEdge("deliver",END).compile();
}
