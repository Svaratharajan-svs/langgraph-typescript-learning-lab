import { expect, test } from "vitest";
import { resilient } from "../src/graph/workflow.js";

test("Error Handling and Retries", async () => {
  let attempts=0; const result=await resilient(async ()=>{attempts++;throw new Error("unavailable");},async ()=>"fallback").invoke({text:"x"}); expect(attempts).toBe(2); expect(result).toMatchObject({source:"fallback",answer:"fallback"});
});
