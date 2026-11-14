import { inspect } from "./graph/workflow.js";

try {
  console.log(await inspect());
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
