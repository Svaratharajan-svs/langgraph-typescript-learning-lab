# Checkpointing solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

MemorySaver stores snapshots keyed by thread. getState sees the latest committed snapshot. Restarting the process discards this store.
