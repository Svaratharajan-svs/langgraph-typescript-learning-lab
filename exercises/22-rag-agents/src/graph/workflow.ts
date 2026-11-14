import { StateSchema, StateGraph, START, END } from "@langchain/langgraph";
import { PDFParse } from "pdf-parse";
import { readFile } from "node:fs/promises";
import { z } from "zod";
import { embeddings, ask, Ask } from "../config/env.js";

export type Chunk = {id:string;text:string};
export const Evidence=z.object({id:z.string(),text:z.string()});
export function chunks(text:string):Chunk[] {
 return text.trim().match(/[^\s]+(?:\s+[^\s]+){0,79}/g)?.map((part,index)=>({id:`chunk-${index+1}`,text:part})) ?? [];
}
export async function extractPdf(buffer:Buffer) {
 const parser=new PDFParse({data:buffer});
 try { return (await parser.getText()).text; }
 finally { await parser.destroy(); }
}
export function cosine(a:number[],b:number[]) {
 if(a.length!==b.length) throw new Error("Embedding dimension mismatch");
 const dot=a.reduce((sum,value,index)=>sum+value*b[index],0);
 return dot/(Math.hypot(...a)*Math.hypot(...b)||1);
}

const State=new StateSchema({question:z.string(), corpus:z.array(Evidence),context:z.array(Evidence).default(()=>[]),answer:z.string().default("")});
export function rag(embed:(text:string[])=>Promise<number[][]> = texts=>embeddings().embedDocuments(texts),generate:Ask=ask) {
 return new StateGraph(State).addNode("retrieve",async ({question,corpus})=>{
   const [query,...vectors]=await embed([question,...corpus.map(chunk=>chunk.text)]);
   return {context:corpus.map((chunk,i)=>({chunk,score:cosine(query,vectors[i])}))
     .sort((a,b)=>b.score-a.score).slice(0,3).map(({chunk})=>chunk)};
 }).addNode("compose",async ({question,context})=>({answer:context.length?
   await generate("Answer using only the evidence. Cite chunk IDs. "+JSON.stringify({question,context})):"No evidence."}))
 .addEdge(START,"retrieve").addEdge("retrieve","compose").addEdge("compose",END).compile();
}
export async function demo() {
 const file=process.argv[2];
 const text=file ? await extractPdf(await readFile(file)) : "Checkpoints preserve conversation state across invocations.";
 return rag().invoke({question:"What do checkpoints preserve?",corpus:chunks(text)});
}
