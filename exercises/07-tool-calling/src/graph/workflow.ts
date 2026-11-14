import { StateGraph, START, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { AIMessage, ToolMessage, BaseMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { chat } from "../config/env.js";

export const tools = [
  tool(({ city }) => ({ Colombo: "29 C", London: "12 C" }[city] ?? "Unknown city"), {
    name: "weather", description: "Find mock weather by city", schema: z.object({ city: z.string() }),
  }),
  tool(({ a, b }) => a + b, { name: "add", description: "Add two numbers", schema: z.object({ a: z.number(), b: z.number() }) }),
  tool(({ sku }) => sku === "42" ? "In stock" : "Unknown SKU", { name: "inventory", description: "Look up a mock database record", schema: z.object({ sku: z.string() }) }),
];
export function assistant(reply: (messages: BaseMessage[]) => Promise<AIMessage> = messages => chat().bindTools(tools).invoke(messages)) {
  return new StateGraph(MessagesAnnotation)
    .addNode("model", async ({ messages }) => ({ messages: [await reply(messages)] }))
    .addNode("tools", new ToolNode(tools))
    .addEdge(START, "model").addConditionalEdges("model", toolsCondition)
    .addEdge("tools", "model").compile();
}
export const fixture = async (messages: BaseMessage[]) => messages.at(-1) instanceof ToolMessage
  ? new AIMessage(String(messages.at(-1)?.content))
  : new AIMessage({content:"", tool_calls:[{ name:"add", args:{a:2,b:3}, id:"sum" }]});
