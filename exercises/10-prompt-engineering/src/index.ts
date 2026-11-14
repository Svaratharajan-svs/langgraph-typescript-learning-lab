import { checkOllama } from "./config/env.js";
import { analysis } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log(await analysis().invoke({audience:"HR",document:"All claims require approval."}));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
