# Production Agent API solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The HTTP boundary validates input before invoking the graph. SSE frames carry progress and results. The bounded in-process queue demonstrates background work and drains on shutdown.
