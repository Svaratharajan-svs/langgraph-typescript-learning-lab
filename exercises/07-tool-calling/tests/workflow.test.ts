import { expect, test } from "vitest";
import { HumanMessage, ToolMessage } from "@langchain/core/messages";
import { assistant, fixture } from "../src/graph/workflow.js";

test("Tool Calling", async () => {
  const result = await assistant(fixture).invoke({messages:[new HumanMessage("add")]}); expect(result.messages[2]).toBeInstanceOf(ToolMessage); expect(result.messages.at(-1)?.text).toBe("5");
});
