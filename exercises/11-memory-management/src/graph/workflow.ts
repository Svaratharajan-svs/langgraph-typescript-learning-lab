import { StateSchema, StateGraph, START, END, MessagesValue, MemorySaver } from "@langchain/langgraph";
import { SystemMessage, RemoveMessage, BaseMessage } from "@langchain/core/messages";
import { z } from "zod";
import { chat, ask, Ask } from "../config/env.js";

const State = new StateSchema({messages:MessagesValue, summary:z.string().default("")});
export function memory(summarize: Ask = ask, reply: (messages:BaseMessage[])=>Promise<BaseMessage> = async messages => chat().invoke(messages)) {
 return new StateGraph(State).addNode("compact",async ({messages,summary}) => {
   const stale = messages.slice(0,-3);
   if (!stale.length) return {};
   return {summary:await summarize(JSON.stringify({summary, stale:stale.map(message=>message.text)})),
     messages:stale.flatMap(message=>message.id ? [new RemoveMessage({id:message.id})] : [])};
 }).addNode("reply",async ({summary,messages})=>({messages:[await reply([new SystemMessage(`Prior context: ${summary}`),...messages])]}))
 .addEdge(START,"compact").addEdge("compact","reply").addEdge("reply",END).compile({checkpointer:new MemorySaver()});
}
