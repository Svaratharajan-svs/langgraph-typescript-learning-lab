# Time Travel solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

Replay starts at the saved location. updateState writes a new checkpoint as if adjust had produced the patch. Forking preserves the original history.
