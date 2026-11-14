# LLM-Powered Agents solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

Each iteration applies one allowlisted action and feeds back observations. The explicit action budget bounds poorly behaved models.
