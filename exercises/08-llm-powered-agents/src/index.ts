import { checkOllama } from "./config/env.js";
import { agent } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log(await agent().invoke({request:"List my tasks, prioritize them, then finish"}, {recursionLimit: 8}));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
