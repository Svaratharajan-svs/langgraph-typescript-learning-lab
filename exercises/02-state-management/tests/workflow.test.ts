import { expect, test } from "vitest";
import { run } from "../src/graph/workflow.js";

test("State Management", async () => {
  expect(await run({ name: "Ada", email: "ADA@Example.ORG" })).toMatchObject({ normalizedEmail: "ada@example.org", eligible: true });
});
