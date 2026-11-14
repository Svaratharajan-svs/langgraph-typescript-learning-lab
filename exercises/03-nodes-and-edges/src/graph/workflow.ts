import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";

const State = new StateSchema({ quantity: z.number().int().positive(), subtotal: z.number().default(0), total: z.number().default(0) });
export const price = ({ quantity }: { quantity: number }) => ({ subtotal: quantity * 1250 });
export const tax = ({ subtotal }: { subtotal: number }) => ({ total: subtotal + Math.round(subtotal * 0.08) });
export const graph = new StateGraph(State).addNode("price", price).addNode("tax", tax)
  .addEdge(START, "price").addEdge("price", "tax").addEdge("tax", END).compile();
