import { expect, test } from "vitest";
import { graph } from "../src/graph/workflow.js";

test("Map Reduce", async () => {
  expect((await graph.invoke({sections:["one two","three",""]})).total).toBe(3); expect((await graph.invoke({sections:[]})).total).toBe(0);
});
