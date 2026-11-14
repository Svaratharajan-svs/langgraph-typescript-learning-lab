import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { createInterface } from "node:readline/promises";
import { checkOllama } from "./config/env.js";
import { conversation } from "./graph/workflow.js";

try {
  await checkOllama();
  console.log(await (async () => {
  const graph = conversation();
  const options = { configurable: { thread_id: "interactive" } };
  const cli = createInterface({ input: process.stdin, output: process.stdout });
  try {
    let first = true;
    while (true) {
      const line = await cli.question("You (enter /quit to leave)> ");
      if (line === "/quit") return "Conversation ended.";
      if (!line.trim()) continue;
      const messages = first ? [new SystemMessage("Answer briefly."), new HumanMessage(line)] : [new HumanMessage(line)];
      const state = await graph.invoke({ messages }, options);
      first = false;
      console.log(state.messages.at(-1)?.text);
    }
  } finally { cli.close(); }
})());
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
