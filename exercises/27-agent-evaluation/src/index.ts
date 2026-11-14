import { evaluate, fixture } from "./graph/workflow.js";

try {
  console.log(await evaluate(fixture));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
