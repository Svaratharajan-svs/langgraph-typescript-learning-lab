import { checkOllama } from "./config/env.js";
import { collect, streaming } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log(await collect(streaming(), "Say hello in two sentences"));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
