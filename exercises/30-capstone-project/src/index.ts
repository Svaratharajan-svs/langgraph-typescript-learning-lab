import { config } from "./config/env.js";
import { capstone } from "./http/capstone.js";
import { listen } from "./http/server.js";

try {
  await listen((await capstone(config.LAB_API_KEY??"")).app);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
