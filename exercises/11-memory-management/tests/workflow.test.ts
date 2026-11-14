import { expect, test } from "vitest";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { memory } from "../src/graph/workflow.js";

test("Memory Management", async () => {
  const state=await memory(async () => "history",async () => new AIMessage("answer")).invoke({messages:[1,2,3,4].map(i=>new HumanMessage({id:String(i),content:String(i)}))},{configurable:{thread_id:"t"}}); expect(state.summary).toBe("history"); expect(state.messages.map(m=>m.text)).toEqual(["2","3","4","answer"]);
});
