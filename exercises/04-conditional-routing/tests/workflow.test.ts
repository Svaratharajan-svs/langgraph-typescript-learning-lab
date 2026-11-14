import { expect, test } from "vitest";
import { graph } from "../src/graph/workflow.js";

test("Conditional Routing", async () => {
  for (const [ticket, queue] of [["refund","billing"],["app crash","technical"],["hello","general"]]) expect((await graph.invoke({ ticket })).queue).toBe(queue);
});
