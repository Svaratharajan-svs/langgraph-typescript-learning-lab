import { expect, test } from "vitest";
import { greet } from "../src/graph/workflow.js";

test("LangGraph Fundamentals", async () => {
  expect((await greet(" Ada ")).greeting).toBe("Hello, Ada!"); await expect(async () => greet("")).rejects.toThrow();
});
