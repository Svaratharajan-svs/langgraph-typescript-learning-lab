# PostgreSQL Persistence solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

setup installs the checkpointer tables under lab13. Rebuilding the graph around the same saver preserves access to snapshots. In deployment run migrations once before serving requests.
