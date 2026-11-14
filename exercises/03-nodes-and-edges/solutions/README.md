# Nodes and Edges solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The tax node depends on the price node. Integer cents keep the calculation predictable.
