import { expect, test } from "vitest";
import { evaluate, fixture, subject } from "../src/graph/workflow.js";

test("Agent Evaluation", async () => {
  expect(await evaluate(fixture)).toEqual({accuracy:1,faithfulnessProxy:1,toolAccuracy:1}); expect((await evaluate(subject(async()=>({answer:"unknown",toolName:"none"})))).accuracy).toBe(0);
});
