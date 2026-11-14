import { expect, test } from "vitest";
import { review } from "../src/graph/workflow.js";

test("Human-in-the-Loop", async () => {
  const denied=await review(false); expect(denied.paused).toHaveProperty("__interrupt__"); expect(denied.resumed.decision).toBe("rejected"); expect((await review(true)).resumed.decision).toBe("approved");
});
