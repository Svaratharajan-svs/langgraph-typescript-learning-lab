import { StateGraph, START, END, MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage, BaseMessage } from "@langchain/core/messages";
import { chat } from "../config/env.js";

export function streaming(reply: (messages:BaseMessage[])=>Promise<BaseMessage> = async messages=>chat().invoke(messages)) {
 return new StateGraph(MessagesAnnotation).addNode("reply",async ({messages},runtime)=>{
   runtime.writer?.({phase:"generating"});
   return {messages:[await reply(messages)]};
 }).addEdge(START,"reply").addEdge("reply",END).compile();
}
export async function collect(graph:ReturnType<typeof streaming>, text:string) {
 const modes=new Set<string>();
 for await(const [mode,data] of await graph.stream({messages:[new HumanMessage(text)]},{streamMode:["updates","values","messages","custom"]})) {
   modes.add(mode);
   if (process.env.NODE_ENV !== "test") console.log(mode, mode==="messages" ? data[0].text : data);
 }
 return [...modes];
}
