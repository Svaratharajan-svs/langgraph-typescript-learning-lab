# Long-Term Memory solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

PostgreSQL keeps durable facts and the LangGraph store provides namespaced retrieval through a rebuilt index. The same key supports updates. Semantic search and episodic history serve different retrieval needs.
