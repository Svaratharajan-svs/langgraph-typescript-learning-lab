import { StateGraph, START, END, MessagesAnnotation, BaseCheckpointSaver } from "@langchain/langgraph";
import { AIMessage, HumanMessage, BaseMessage } from "@langchain/core/messages";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { Pool } from "pg";
import { randomUUID } from "node:crypto";
import { config } from "../config/env.js";

export function support(checkpointer: BaseCheckpointSaver) {
 return new StateGraph(MessagesAnnotation).addNode("support",({messages})=>({messages:[new AIMessage(`Support history size: ${messages.length}`)]}))
 .addEdge(START,"support").addEdge("support",END).compile({checkpointer});
}
export async function persistentDemo() {
 const pool=new Pool({connectionString:config.DATABASE_URL});
 try {
   await pool.query("CREATE SCHEMA IF NOT EXISTS lab13");
   const saver=new PostgresSaver(pool, undefined, {schema:"lab13"});
   await saver.setup();
   const options={configurable:{thread_id:randomUUID()}};
   await support(saver).invoke({messages:[new HumanMessage("Order 42")]},options);
   return (await support(saver).getState(options)).values.messages.map((message:BaseMessage)=>message.text);
 } finally { await pool.end(); }
}
