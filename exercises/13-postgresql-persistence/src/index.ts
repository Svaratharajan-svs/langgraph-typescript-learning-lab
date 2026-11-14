import { persistentDemo } from "./graph/workflow.js";

try {
  console.log(await persistentDemo());
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
