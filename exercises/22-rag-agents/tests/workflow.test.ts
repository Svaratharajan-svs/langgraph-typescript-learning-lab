import { expect, test } from "vitest";
import { cosine, rag } from "../src/graph/workflow.js";

test("RAG Agents", async () => {
  expect(cosine([1,0],[1,0])).toBe(1); const result=await rag(async()=>[[1,0],[0,1],[1,0]],async()=> "State [chunk-2]").invoke({question:"state",corpus:[{id:"chunk-1",text:"x"},{id:"chunk-2",text:"state"}]}); expect(result.context[0].id).toBe("chunk-2");
});
