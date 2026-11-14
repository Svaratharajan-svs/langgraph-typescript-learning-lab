# Multi-Agent Systems solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The supervisor chooses the next role by inspecting artifact availability. Specialists share artifacts through explicit state channels.
