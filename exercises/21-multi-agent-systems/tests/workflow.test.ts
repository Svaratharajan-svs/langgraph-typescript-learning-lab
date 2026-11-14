import { expect, test } from "vitest";
import { team } from "../src/graph/workflow.js";

test("Multi-Agent Systems", async () => {
  const prompts:string[]=[]; const result=await team(async prompt=>{prompts.push(prompt);return String(prompts.length);}).invoke({goal:"catalog"}); expect(result.review).toBe("4"); expect(prompts[2]).toContain("tradeoffs" in {} ? "" : "research");
});
