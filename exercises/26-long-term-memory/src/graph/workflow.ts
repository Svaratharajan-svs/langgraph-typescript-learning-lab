import { StateSchema, StateGraph, START, END, InMemoryStore, BaseStore } from "@langchain/langgraph";
import { Pool } from "pg";
import { z } from "zod";
import { config, embeddings, ask, Ask } from "../config/env.js";

export const namespace=(user:string,kind:"semantic"|"episodic")=>["lab26",z.string().min(1).parse(user),kind];
export async function remember(store:BaseStore,user:string,key:string,value:string,kind:"semantic"|"episodic"="semantic") {
 await store.put(namespace(user,kind),key,{value});
}
const State=new StateSchema({user:z.string(),question:z.string(),answer:z.string().default("")});
export function personalized(store:BaseStore,generate:Ask=ask) {
 return new StateGraph(State).addNode("recall",async ({user,question})=>{
   const matches=await Promise.all([store.search(namespace(user,"semantic"),{query:question,limit:4}),store.search(namespace(user,"episodic"),{limit:4})]);
   return {answer:await generate("Answer with these user memories as context. "+JSON.stringify({question,memories:matches.flat().map(item=>item.value)}))};
 }).addEdge(START,"recall").addEdge("recall",END).compile();
}
export async function demo() {
 const pool=new Pool({connectionString:config.DATABASE_URL});
 try {
   await pool.query("CREATE SCHEMA IF NOT EXISTS lab26");
   await pool.query("CREATE TABLE IF NOT EXISTS lab26.memory (user_id text, key text, value text, PRIMARY KEY(user_id,key))");
   await pool.query("INSERT INTO lab26.memory VALUES ($1,$2,$3) ON CONFLICT(user_id,key) DO UPDATE SET value=excluded.value",["ada","editor","VS Code"]);
   const rows=await pool.query<{key:string;value:string}>("SELECT key,value FROM lab26.memory WHERE user_id=$1",["ada"]);
   const vectorizer=embeddings();
   const store=new InMemoryStore({index:{dims:(await vectorizer.embedQuery("dimension probe")).length,embeddings:vectorizer,fields:["value"]}});
   for(const row of rows.rows) await remember(store,"ada",row.key,row.value);
   return await personalized(store).invoke({user:"ada",question:"Which editor do I prefer?"});
 } finally {await pool.end();}
}
