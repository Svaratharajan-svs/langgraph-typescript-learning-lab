import { expect, test } from "vitest";
import { AIMessage } from "@langchain/core/messages";
import { observable } from "../src/graph/workflow.js";

test("Observability", async () => {
  const events:Array<{ok:boolean}>=[]; expect((await observable(e=>events.push(e),async()=>new AIMessage("hello")).invoke({text:"hi"})).answer).toBe("hello"); await expect(observable(e=>events.push(e),async()=>{throw new Error("fail");}).invoke({text:"hi"})).rejects.toThrow("fail"); expect(events.map(e=>e.ok)).toEqual([true,false]);
});
