# Prompt Engineering solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

ChatPromptTemplate preserves message roles. A version in the system prompt makes changes traceable. Few-shot examples guide the response shape.
