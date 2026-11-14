# Streaming solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

values streams complete states, updates reports writes, messages carries model chunks and metadata, and writer emits progress events.
