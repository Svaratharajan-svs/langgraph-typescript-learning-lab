import { checkOllama } from "./config/env.js";
import { demo } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log(await demo());
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
