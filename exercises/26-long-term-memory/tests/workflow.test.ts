import { expect, test } from "vitest";
import { InMemoryStore } from "@langchain/langgraph";
import { personalized, remember } from "../src/graph/workflow.js";

test("Long-Term Memory", async () => {
  const store=new InMemoryStore(); await remember(store,"ada","editor","VS Code"); await remember(store,"ada","editor","Neovim"); await remember(store,"bob","editor","private"); const result=await personalized(store,async prompt=>prompt).invoke({user:"ada",question:"editor"}); expect(result.answer).toContain("Neovim"); expect(result.answer).not.toContain("private");
});
