# Parallel Execution solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

Two workers are scheduled together. The array edge is a barrier that schedules report only after both upstream nodes finish.
