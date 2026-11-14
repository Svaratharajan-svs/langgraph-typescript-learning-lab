# SQL Agents solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The model chooses typed filters. Application code compiles them into one parameterized SELECT, and PostgreSQL executes it in a read-only transaction. Restrict the database role further for deployment.
