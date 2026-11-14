import { expect, test } from "vitest";
import { analysis } from "../src/graph/workflow.js";

test("Prompt Engineering", async () => {
  const result=await analysis(async messages => { expect(messages[0].text).toContain("v1"); expect(messages.at(-1)?.text).toContain("HR"); return "policy"; }).invoke({audience:"HR",document:"Receipts are required"}); expect(result.response).toBe("policy");
});
