import { PDFParse } from "pdf-parse";
import { z } from "zod";

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

