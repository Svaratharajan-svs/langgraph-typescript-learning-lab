import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { loadEnvFile } from "node:process";
import { z } from "zod";

if (process.env.NODE_ENV !== "test") {
  try { loadEnvFile(); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

export const config = z.object({
  OLLAMA_BASE_URL: z.url().default("http://localhost:11434"),
  OLLAMA_MODEL: z.string().min(1).default("qwen2.5:3b"),
  OLLAMA_EMBED_MODEL: z.string().min(1).default("nomic-embed-text"),
  LLM_PROVIDER: z.literal("ollama").default("ollama"),
  DATABASE_URL: z.url().default("postgresql://lab:lab_local_password@localhost:5432/lab"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LAB_API_KEY: z.string().min(16).optional(),
}).parse(process.env);

export const chat = () => new ChatOllama({
  baseUrl: config.OLLAMA_BASE_URL, model: config.OLLAMA_MODEL, temperature: 0, maxRetries: 0,
});

export const embeddings = () => new OllamaEmbeddings({
  baseUrl: config.OLLAMA_BASE_URL, model: config.OLLAMA_EMBED_MODEL, maxRetries: 0,
});

export async function checkOllama() {
  try {
    const response = await fetch(new URL("/api/tags", config.OLLAMA_BASE_URL), {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(String(response.status));
    const payload = z.object({ models: z.array(z.object({ name: z.string() })) }).parse(await response.json());
    if (!payload.models.some(({ name }) => name === config.OLLAMA_MODEL)) {
      throw new Error(`Model ${config.OLLAMA_MODEL} is missing. Run the infrastructure initialization script.`);
    }
  } catch (error) {
    throw new Error(`Ollama at ${config.OLLAMA_BASE_URL}: ${String(error)}. Check the shared Compose service.`);
  }
}

export const ask = async (prompt: string, signal = AbortSignal.timeout(90000)) => {
  const answer = await chat().invoke(prompt, { signal });
  return answer.text;
};
export type Ask = typeof ask;
