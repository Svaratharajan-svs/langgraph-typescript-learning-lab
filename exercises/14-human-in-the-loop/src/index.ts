import { review } from "./graph/workflow.js";

try {
  console.log(await review(process.argv.includes("--approve")));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
