# Agentic RAG solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

A missing hit triggers one rewrite and a mock external lookup. The extractive acceptance check rejects text absent from the retrieved sentence. It cannot verify that the sentence answers the question.
