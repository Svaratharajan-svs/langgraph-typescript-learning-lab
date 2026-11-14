import { expect, test } from "vitest";
import { planning } from "../src/graph/workflow.js";

test("Planning and Reflection", async () => {
  const result=await planning(async prompt=>prompt.startsWith("Return")?"Add a rollback step":"Version the package").invoke({goal:"ship"}); expect(result.revisions).toBe(2); expect(result.result).toContain("Needs review");
});
