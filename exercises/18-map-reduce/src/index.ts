import { graph } from "./graph/workflow.js";

try {
  console.log(await graph.invoke({sections:["Agents use nodes","State persists"]}));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
