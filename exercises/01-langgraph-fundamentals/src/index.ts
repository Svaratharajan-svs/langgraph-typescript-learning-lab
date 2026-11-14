import { greet } from "./graph/workflow.js";

try {
  console.log(await greet("Ada"));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
