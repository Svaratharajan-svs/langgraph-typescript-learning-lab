import { expect, test } from "vitest";
import { agent } from "../src/graph/workflow.js";

test("LLM-Powered Agents", async () => {
  const result = await agent(async () => ({action:"list"})).invoke({request:"list"}); expect(result.actions).toHaveLength(3); expect(result.done).toBe(true);
});
