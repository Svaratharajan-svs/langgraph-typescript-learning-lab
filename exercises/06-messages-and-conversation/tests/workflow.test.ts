import { expect, test } from "vitest";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { conversation } from "../src/graph/workflow.js";

test("Messages and Conversation", async () => {
  const graph = conversation(async messages => new AIMessage(String(messages.length))); const options = { configurable: { thread_id: "t" } }; await graph.invoke({messages:[new HumanMessage("hi")]}, options); expect((await graph.invoke({messages:[new HumanMessage("again")]}, options)).messages.at(-1)?.text).toBe("3");
});
