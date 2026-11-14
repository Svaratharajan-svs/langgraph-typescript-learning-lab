import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";

const Profile = z.object({ name: z.string().trim().min(1), email: z.email() });
const State = new StateSchema({ profile: Profile, normalizedEmail: z.string().default(""), eligible: z.boolean().default(false) });
export const graph = new StateGraph(State)
  .addNode("normalize", ({ profile }) => ({ normalizedEmail: profile.email.toLowerCase() }))
  .addNode("evaluate", ({ normalizedEmail }) => ({ eligible: normalizedEmail.endsWith("@example.org") }))
  .addEdge(START, "normalize").addEdge("normalize", "evaluate").addEdge("evaluate", END).compile();
export const run = (input: unknown) => graph.invoke({ profile: Profile.parse(input) });
