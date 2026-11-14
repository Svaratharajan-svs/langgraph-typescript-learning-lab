import { checkOllama } from "./config/env.js";
import { observable } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log(await observable(event=>console.log(JSON.stringify(event))).invoke({text:"What is a checkpoint?"}));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
