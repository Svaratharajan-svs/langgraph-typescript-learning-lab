import { checkOllama } from "./config/env.js";
import { extraction } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log(await extraction().invoke({resume:"Ada Lovelace, TypeScript and Python, 3 years of experience"}));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
