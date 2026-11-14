import { HumanMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { checkOllama } from "./config/env.js";
import { assistant } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log((await assistant().invoke({messages:[new HumanMessage("Use the add tool to calculate 2 + 3")]}, {recursionLimit: 8})).messages.at(-1)?.text);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
