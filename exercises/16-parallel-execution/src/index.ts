import { research } from "./graph/workflow.js";

try {
  console.log(await research().invoke({query:"checkpoints"}));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
