import { StateGraph, START, END, MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";
import { chat } from "../config/env.js";

export function conversation(reply: (messages: BaseMessage[]) => Promise<BaseMessage> = async messages => chat().invoke(messages)) {
  return new StateGraph(MessagesAnnotation)
    .addNode("reply", async ({ messages }) => ({ messages: [await reply(messages)] }))
    .addEdge(START, "reply").addEdge("reply", END).compile({ checkpointer: new MemorySaver() });
}
