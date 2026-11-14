import { run } from "./graph/workflow.js";

try {
  console.log(await run({ name: "Ada", email: "ADA@Example.ORG" }));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
