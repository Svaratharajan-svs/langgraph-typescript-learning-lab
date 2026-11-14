import { StateSchema, StateGraph, START, END, ReducedValue } from "@langchain/langgraph";
import { z } from "zod";

const State = new StateSchema({query:z.string(), evidence:new ReducedValue(z.array(z.string()).default(()=>[]),{reducer:(a,b)=>a.concat(b)}), report:z.string().default("")});
export function research(search:(source:string, query:string)=>Promise<string> = async (source,query)=>`${source} evidence for ${query}`) {
 return new StateGraph(State).addNode("docs",async ({query})=>({evidence:[await search("docs",query)]}))
 .addNode("tickets",async ({query})=>({evidence:[await search("tickets",query)]}))
 .addNode("assemble",({evidence})=>({report:evidence.slice().sort().join("; ")}))
 .addEdge(START,"docs").addEdge(START,"tickets").addEdge(["docs","tickets"],"assemble").addEdge("assemble",END).compile();
}
