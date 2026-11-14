# Agent Evaluation solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The dataset specifies expected answers, supporting evidence and expected tool selection. Exact match and substring grounding are reproducible proxies. An LLM judge can score nuance but introduces drift.
