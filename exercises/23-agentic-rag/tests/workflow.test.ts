import { expect, test } from "vitest";
import { corrective } from "../src/graph/workflow.js";

test("Agentic RAG", async () => {
  const result=await corrective(async prompt=>prompt.startsWith("Rewrite")?"durable checkpoint":"I invented a fact").invoke({question:"resume?"}); expect(result.attempt).toBe(1); expect(result.answer).toBe("Insufficient evidence");
});
