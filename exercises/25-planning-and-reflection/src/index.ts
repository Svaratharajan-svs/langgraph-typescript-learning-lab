import { planning } from "./graph/workflow.js";

try {
  console.log(await planning().invoke({goal:"Roll out a shared React component library"}));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
