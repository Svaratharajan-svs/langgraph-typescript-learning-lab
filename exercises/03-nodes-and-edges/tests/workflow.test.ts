import { expect, test } from "vitest";
import { graph, price } from "../src/graph/workflow.js";

test("Nodes and Edges", async () => {
  expect(price({ quantity: 2 })).toEqual({subtotal: 2500}); expect((await graph.invoke({ quantity: 2 })).total).toBe(2700);
});
