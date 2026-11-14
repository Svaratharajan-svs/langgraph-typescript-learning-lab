import { expect, test } from "vitest";
import { travel } from "../src/graph/workflow.js";

test("Time Travel", async () => {
  expect(await travel()).toMatchObject({original:8,replay:8,fork:20});
});
