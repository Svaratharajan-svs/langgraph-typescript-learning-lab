import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";
import { chat } from "../config/env.js";

const Resume = z.object({ name:z.string().min(1), skills:z.array(z.string()), years:z.number().nonnegative() });
const State = new StateSchema({ resume:z.string().min(1), candidate: Resume.nullable().default(null) });
export function extraction(generate: (text:string) => Promise<unknown> = text => chat().withStructuredOutput(Resume).invoke(text)) {
  return new StateGraph(State).addNode("extract", async ({resume}) => {
    for (let attempt=0; attempt<2; attempt++) {
      try { return {candidate:Resume.parse(await generate(`Extract explicit résumé facts only. Attempt ${attempt+1}: ${resume}`))}; }
      catch (error) { if (attempt === 1) throw error; }
    }
    throw new Error("Extraction budget exhausted");
  }).addEdge(START,"extract").addEdge("extract",END).compile();
}
