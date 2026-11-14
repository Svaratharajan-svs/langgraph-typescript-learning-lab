# Error Handling and Retries solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

A bounded retry policy runs inside a subgraph so the parent can recover when retries are exhausted. The retried operation has no write side effects.
