import { expect, test } from "vitest";
import { AIMessage } from "@langchain/core/messages";
import { collect, streaming } from "../src/graph/workflow.js";

test("Streaming", async () => {
  expect(await collect(streaming(async()=>new AIMessage("Hello")),"Hi")).toEqual(expect.arrayContaining(["values","updates","custom"]));
});
