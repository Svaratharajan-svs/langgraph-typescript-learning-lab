# Messages and Conversation solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The reducer appends new messages. A stable thread ID retrieves earlier messages and lets the model see the conversation.
