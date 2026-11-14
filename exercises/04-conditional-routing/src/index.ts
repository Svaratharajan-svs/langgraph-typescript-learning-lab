import { graph } from "./graph/workflow.js";

try {
  console.log(await graph.invoke({ ticket: "Refund a charge" }));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
