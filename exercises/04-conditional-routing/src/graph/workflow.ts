import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";

const State = new StateSchema({ ticket: z.string().min(1), queue: z.string().default("") });
export const route = ({ ticket }: { ticket: string }) => {
  if (/invoice|refund/i.test(ticket)) return "billing";
  if (/error|crash/i.test(ticket)) return "technical";
  return "general";
};
export const graph = new StateGraph(State)
  .addNode("classify", () => ({}))
  .addNode("billing", () => ({ queue: "billing" }))
  .addNode("technical", () => ({ queue: "technical" }))
  .addNode("general", () => ({ queue: "general" }))
  .addEdge(START, "classify").addConditionalEdges("classify", route, ["billing", "technical", "general"])
  .addEdge("billing", END).addEdge("technical", END).addEdge("general", END).compile();
