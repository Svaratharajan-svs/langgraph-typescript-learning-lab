import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";
import { ask, Ask } from "../config/env.js";

const State=new StateSchema({goal:z.string(),plan:z.string().default(""),research:z.string().default(""),draft:z.string().default(""),review:z.string().default("")});
export function team(generate:Ask=ask) {
 return new StateGraph(State).addNode("supervisor",()=>({}))
 .addNode("planner",async ({goal})=>({plan:await generate("Create a development plan: "+goal)}))
 .addNode("researcher",async ({plan})=>({research:await generate("Identify design tradeoffs for: "+plan)}))
 .addNode("developer",async ({plan,research})=>({draft:await generate("Draft an implementation as text: "+JSON.stringify({plan,research}))}))
 .addNode("reviewer",async ({draft})=>({review:await generate("Review this draft for correctness: "+draft)}))
 .addEdge(START,"supervisor")
 .addConditionalEdges("supervisor",({plan,research,draft,review})=>!plan?"planner":!research?"researcher":!draft?"developer":!review?"reviewer":END,["planner","researcher","developer","reviewer",END])
 .addEdge("planner","supervisor").addEdge("researcher","supervisor").addEdge("developer","supervisor").addEdge("reviewer","supervisor").compile();
}
