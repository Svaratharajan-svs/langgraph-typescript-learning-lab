import { HumanMessage } from "@langchain/core/messages";
import { checkOllama } from "./config/env.js";
import { memory } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log(await (async () => {
 const graph=memory(); const options={configurable:{thread_id:"memory"}};
 for(const text of ["My name is Ada","I am learning LangGraph","I like TypeScript"]) await graph.invoke({messages:[new HumanMessage(text)]},options);
 return (await graph.invoke({messages:[new HumanMessage("What am I learning?")]},options)).messages.at(-1)?.text;
})());
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
