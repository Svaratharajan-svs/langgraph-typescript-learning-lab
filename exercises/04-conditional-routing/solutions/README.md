# Conditional Routing solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The conditional edge reads the current ticket and schedules exactly one queue. The order of rules defines precedence.
