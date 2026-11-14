import { checkOllama } from "./config/env.js";
await checkOllama();
console.log("Ollama model is ready");
