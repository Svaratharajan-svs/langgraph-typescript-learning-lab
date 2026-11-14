import { checkOllama } from "./config/env.js";
import { resilient } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log(await resilient().invoke({text:"Summarize retry policies in one sentence"}));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
