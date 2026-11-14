import { travel } from "./graph/workflow.js";

try {
  console.log(await travel());
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
