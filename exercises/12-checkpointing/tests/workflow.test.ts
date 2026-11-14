import { expect, test } from "vitest";
import { inspect } from "../src/graph/workflow.js";

test("Checkpointing", async () => {
  const state=await inspect(); expect(state.messages).toHaveLength(4); expect(state.messages[3].text).toBe("Messages before reply: 3");
});
