import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";
import { chat } from "../config/env.js";

const State = new StateSchema({ request: z.string(), actions: z.array(z.string()).default(() => []), done: z.boolean().default(false) });
const Decision = z.object({ action: z.enum(["list", "prioritize", "finish"]) });
const tasks = ["Reply to Sam", "Prepare sprint demo"];
export function agent(decide: (prompt: string) => Promise<unknown> = prompt => chat().withStructuredOutput(Decision).invoke(prompt)) {
  return new StateGraph(State).addNode("act", async ({request, actions}) => {
    const {action} = Decision.parse(await decide(JSON.stringify({request, actions})));
    if (action === "finish" || actions.length >= 3) return {done:true};
    const observation = action === "list" ? tasks.join(", ") : tasks[1] + " first";
    return {actions:[...actions, observation]};
  }).addEdge(START,"act").addConditionalEdges("act", ({done}) => done ? END : "act", [END,"act"]).compile();
}
