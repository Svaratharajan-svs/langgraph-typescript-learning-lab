# Structured Output solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The schema specifies the output contract. Parsing again at the node boundary protects downstream consumers. Invalid attempts receive one retry.
