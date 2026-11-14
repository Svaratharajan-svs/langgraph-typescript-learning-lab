# Human-in-the-Loop solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

interrupt persists a continuation. Command supplies the answer on the same thread. The node re-executes from its beginning, so perform side effects after validation.
