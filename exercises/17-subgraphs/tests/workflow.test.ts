import { expect, test } from "vitest";
import { graph } from "../src/graph/workflow.js";

test("Subgraphs", async () => {
  expect(await graph.invoke({topic:"LangGraph"})).toMatchObject({evidence:"Guide for LangGraph",report:"Summary: guide for langgraph"});
});
