import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";

const State = new StateSchema({ name: z.string().trim().min(1), greeting: z.string().default("") });
export const graph = new StateGraph(State)
  .addNode("greet", ({ name }) => ({ greeting: `Hello, ${name}!` }))
  .addEdge(START, "greet").addEdge("greet", END).compile();
export const greet = (name: string) => graph.invoke({ name: z.string().trim().min(1).parse(name) });
