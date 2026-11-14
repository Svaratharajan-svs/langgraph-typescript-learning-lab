# Tool Calling solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The model emits a typed tool call. ToolNode validates arguments and creates a ToolMessage carrying the same tool call ID.
