import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { Pool } from "pg";
import { z } from "zod";
import { config, chat } from "../config/env.js";

const Query=z.object({region:z.enum(["east","west"]),minimum:z.number().nonnegative()}).strict();
type Query=z.infer<typeof Query>;
export const statement=({region,minimum}:Query)=>({text:"SELECT sku, revenue FROM lab24.sales WHERE region = $1 AND revenue >= $2 ORDER BY revenue DESC LIMIT 20",values:[region,minimum]});
const State=new StateSchema({question:z.string(),rows:z.array(z.object({sku:z.string(),revenue:z.number()})).default(()=>[])});
export function analytics(select:(query:Query)=>Promise<unknown[]>,interpret:(text:string)=>Promise<unknown>=text=>chat().withStructuredOutput(Query).invoke(text)) {
 return new StateGraph(State).addNode("query",async ({question})=>{
   const query=Query.parse(await interpret("Select east/west region and minimum revenue for lab24.sales(sku,region,revenue): "+question));
   return {rows:z.array(z.object({sku:z.string(),revenue:z.number()})).parse(await select(query))};
 }).addEdge(START,"query").addEdge("query",END).compile();
}
export async function demo() {
 const pool=new Pool({connectionString:config.DATABASE_URL});
 const client=await pool.connect().catch(async error=>{await pool.end();throw error;});
 try {
   await client.query("CREATE SCHEMA IF NOT EXISTS lab24");
   await client.query("CREATE TABLE IF NOT EXISTS lab24.sales (sku text PRIMARY KEY, region text, revenue int)");
   await client.query("INSERT INTO lab24.sales VALUES ('SKU-42','east',120) ON CONFLICT DO NOTHING");
   await client.query("BEGIN READ ONLY");
   await client.query("SET LOCAL statement_timeout = '2s'");
   return await analytics(async query=>(await client.query(statement(query))).rows).invoke({question:"East sales over 100"});
 } finally {
   try { await client.query("ROLLBACK"); }
   finally { client.release(); await pool.end(); }
 }
}
