import { StateSchema, StateGraph, START, END, ReducedValue, MessagesValue } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";
import { z } from "zod";

const State = new StateSchema({
  facts: new ReducedValue(z.array(z.string()).default(() => []), {
    reducer: (previous, update) => [...new Set([...previous, ...update])],
  }),
  messages: MessagesValue,
});
export const graph = new StateGraph(State)
  .addNode("catalog", () => ({ facts: ["SKU 42"], messages: [new AIMessage("Catalog checked")] }))
  .addNode("inventory", () => ({ facts: ["SKU 42", "In stock"], messages: [new AIMessage("Inventory checked")] }))
  .addEdge(START, "catalog").addEdge(START, "inventory")
  .addNode("join", () => ({})).addEdge(["catalog", "inventory"], "join").addEdge("join", END).compile();
