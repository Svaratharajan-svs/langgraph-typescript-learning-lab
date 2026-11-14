# LangGraph Fundamentals solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

START schedules greet. The node returns a partial update to greeting. END stops execution and invoke resolves to the merged state.
