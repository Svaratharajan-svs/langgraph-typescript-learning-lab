import { expect, test } from "vitest";
import { research } from "../src/graph/workflow.js";

test("Parallel Execution", async () => {
  const result=await research().invoke({query:"test"}); expect(result.evidence).toHaveLength(2); expect(result.report).toBe("docs evidence for test; tickets evidence for test");
});
