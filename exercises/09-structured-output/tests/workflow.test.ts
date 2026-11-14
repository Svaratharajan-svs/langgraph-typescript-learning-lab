import { expect, test } from "vitest";
import { extraction } from "../src/graph/workflow.js";

test("Structured Output", async () => {
  let tries=0; const result = await extraction(async () => ++tries === 1 ? {} : {name:"Ada",skills:["TS"],years:3}).invoke({resume:"Ada"}); expect(tries).toBe(2); expect(result.candidate?.name).toBe("Ada");
});
