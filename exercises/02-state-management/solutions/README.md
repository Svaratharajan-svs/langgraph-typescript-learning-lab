# State Management solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

profile survives both partial updates. Each node writes to one channel. The second node reads the first node’s committed value.
