import { graph } from "./graph/workflow.js";

try {
  console.log(await graph.invoke({ quantity: 2 }));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
