import { StateGraph, START, END, MessagesAnnotation, MemorySaver } from "@langchain/langgraph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";

export function conversation() {
 return new StateGraph(MessagesAnnotation)
 .addNode("reply",({messages})=>({messages:[new AIMessage(`Messages before reply: ${messages.length}`)]}))
 .addEdge(START,"reply").addEdge("reply",END).compile({checkpointer:new MemorySaver()});
}
export async function inspect() {
 const graph=conversation(); const options={configurable:{thread_id:"checkpoint"}};
 await graph.invoke({messages:[new HumanMessage("First")]},options);
 await graph.invoke({messages:[new HumanMessage("Second")]},options);
 return (await graph.getState(options)).values;
}
