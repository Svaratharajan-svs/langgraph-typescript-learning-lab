import { graph } from "./graph/workflow.js";

try {
  console.log(await graph.invoke({topic:"LangGraph"}));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
