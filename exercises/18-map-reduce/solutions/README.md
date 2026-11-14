# Map Reduce solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

Each Send carries a worker-specific input. Counts accumulate in a reducer and the reduce node computes the total after the workers finish.
