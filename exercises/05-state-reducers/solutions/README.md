# State Reducers solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

Both writes land in the same superstep. ReducedValue deduplicates facts and MessagesValue combines message updates by identity.
