import { expect, test } from "vitest";
import { graph } from "../src/graph/workflow.js";

test("State Reducers", async () => {
  const state = await graph.invoke({}); expect(state.facts.sort()).toEqual(["In stock","SKU 42"]); expect(state.messages).toHaveLength(2);
});
