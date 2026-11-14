import { expect, test } from "vitest";
import { analytics, statement } from "../src/graph/workflow.js";

test("SQL Agents", async () => {
  const graph=analytics(async query=>{expect(statement(query).values).toEqual(["east",100]);return [{sku:"SKU",revenue:120}];},async()=>({region:"east",minimum:100})); expect((await graph.invoke({question:"east"})).rows).toHaveLength(1); await expect(analytics(async()=>[],async()=>({region:"invalid",minimum:0})).invoke({question:"x"})).rejects.toThrow();
});
