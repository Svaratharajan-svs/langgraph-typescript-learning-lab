import { expect, test } from "vitest";
import { MemorySaver, Command } from "@langchain/langgraph";
import { knowledge } from "../src/graph/workflow.js";

test("Capstone Project", async () => {
  const graph=knowledge(new MemorySaver(),async()=>[{id:"c1",text:"State is durable."}],async()=> "State is durable [c1]"); const options={configurable:{thread_id:"capstone-test"}}; const paused=await graph.invoke({question:"What persists?",owner:"ada"},options); expect(paused).toHaveProperty("__interrupt__"); const result=await graph.invoke(new Command({resume:true}),options); expect(result.answer).toContain("[c1]"); expect(result.history).toHaveLength(2);
});
