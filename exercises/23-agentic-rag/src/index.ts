import { checkOllama } from "./config/env.js";
import { corrective } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log(await corrective().invoke({question:"How do I recover a checkpoint?"}));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
