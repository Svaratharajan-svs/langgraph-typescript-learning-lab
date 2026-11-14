# RAG Agents solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The loader extracts PDF text, then the vector index ranks chunks by cosine similarity. This local index embeds the corpus on every query, which keeps the data flow visible.
