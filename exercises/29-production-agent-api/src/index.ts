import { config } from "./config/env.js";
import { agentApi, listen } from "./graph/workflow.js";

try {
  await listen(agentApi(config.LAB_API_KEY ?? ""));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
