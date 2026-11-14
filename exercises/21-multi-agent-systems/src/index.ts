import { checkOllama } from "./config/env.js";
import { team } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log(await team().invoke({goal:"Design a read-only book catalog"},{recursionLimit:12}));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
