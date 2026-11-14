# Subgraphs solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

Parent nodes adapt the schema at each subgraph boundary. If parent and child share channels, a compiled child can instead be added directly as a node.
