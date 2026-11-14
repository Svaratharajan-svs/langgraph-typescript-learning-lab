# Interview questions

## 01. LangGraph Fundamentals

1. **Why does greet return only greeting?** LangGraph merges partial updates with the state.

2. **How is this example implemented?** START schedules greet. The node returns a partial update to greeting. END stops execution and invoke resolves to the merged state.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 02. State Management

1. **Why separate normalization from eligibility?** Eligibility should operate on a consistent representation.

2. **How is this example implemented?** profile survives both partial updates. Each node writes to one channel. The second node reads the first node’s committed value.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 03. Nodes and Edges

1. **How do you prevent tax from reading a stale subtotal?** Connect price directly to the tax node.

2. **How is this example implemented?** The tax node depends on the price node. Integer cents keep the calculation predictable.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 04. Conditional Routing

1. **What defines rule precedence?** The ordering of predicates in the routing function.

2. **How is this example implemented?** The conditional edge reads the current ticket and schedules exactly one queue. The order of rules defines precedence.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 05. State Reducers

1. **Why can both nodes update facts?** The reducer combines both writes during commit.

2. **How is this example implemented?** Both writes land in the same superstep. ReducedValue deduplicates facts and MessagesValue combines message updates by identity.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 06. Messages and Conversation

1. **What separates user messages and model replies?** HumanMessage and AIMessage preserve roles.

2. **How is this example implemented?** The reducer appends new messages. A stable thread ID retrieves earlier messages and lets the model see the conversation.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 07. Tool Calling

1. **What links a ToolMessage to its request?** tool_call_id identifies the originating AI tool call.

2. **How is this example implemented?** The model emits a typed tool call. ToolNode validates arguments and creates a ToolMessage carrying the same tool call ID.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 08. LLM-Powered Agents

1. **How does a recursion limit differ from the action budget?** The graph limit caps supersteps and the budget expresses business policy.

2. **How is this example implemented?** Each iteration applies one allowlisted action and feeds back observations. The explicit action budget bounds poorly behaved models.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 09. Structured Output

1. **Why parse a structured response again?** It protects the node contract if the adapter or fixture violates it.

2. **How is this example implemented?** The schema specifies the output contract. Parsing again at the node boundary protects downstream consumers. Invalid attempts receive one retry.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 10. Prompt Engineering

1. **What belongs in the system message?** Stable behavior and classification instructions.

2. **How is this example implemented?** ChatPromptTemplate preserves message roles. A version in the system prompt makes changes traceable. Few-shot examples guide the response shape.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 11. Memory Management

1. **Why are stable message IDs important?** RemoveMessage needs the ID of each existing message.

2. **How is this example implemented?** Summarize older messages before emitting removal operations. The reply receives the compacted channel plus the summary. This count-based budget is a simple proxy for token length.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 12. Checkpointing

1. **What does thread_id key?** The checkpoint series for a logical execution or conversation.

2. **How is this example implemented?** MemorySaver stores snapshots keyed by thread. getState sees the latest committed snapshot. Restarting the process discards this store.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 13. PostgreSQL Persistence

1. **When should saver setup run?** Before serving traffic, typically as deployment migration work.

2. **How is this example implemented?** setup installs the checkpointer tables under lab13. Rebuilding the graph around the same saver preserves access to snapshots. In deployment run migrations once before serving requests.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 14. Human-in-the-Loop

1. **Why defer side effects until after interrupt?** The interrupted node restarts during resume.

2. **How is this example implemented?** interrupt persists a continuation. Command supplies the answer on the same thread. The node re-executes from its beginning, so perform side effects after validation.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 15. Streaming

1. **Which mode shows node patches?** updates emits the fields each node wrote.

2. **How is this example implemented?** values streams complete states, updates reports writes, messages carries model chunks and metadata, and writer emits progress events.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 16. Parallel Execution

1. **What is the purpose of a fan-in barrier?** It prevents the join from running before all required branches complete.

2. **How is this example implemented?** Two workers are scheduled together. The array edge is a barrier that schedules report only after both upstream nodes finish.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 17. Subgraphs

1. **When is an adapter node useful?** When parent and child expose different state channels.

2. **How is this example implemented?** Parent nodes adapt the schema at each subgraph boundary. If parent and child share channels, a compiled child can instead be added directly as a node.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 18. Map Reduce

1. **Why use Send for each section?** Each worker receives a different payload determined at runtime.

2. **How is this example implemented?** Each Send carries a worker-specific input. Counts accumulate in a reducer and the reduce node computes the total after the workers finish.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 19. Error Handling and Retries

1. **Which operations can safely retry?** Idempotent work or work protected by an idempotency key.

2. **How is this example implemented?** A bounded retry policy runs inside a subgraph so the parent can recover when retries are exhausted. The retried operation has no write side effects.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 20. Time Travel

1. **Why keep the original checkpoint?** It remains the baseline for reproducing prior execution.

2. **How is this example implemented?** Replay starts at the saved location. updateState writes a new checkpoint as if adjust had produced the patch. Forking preserves the original history.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 21. Multi-Agent Systems

1. **Where does the supervisor get its routing inputs?** It examines the artifacts written into shared state.

2. **How is this example implemented?** The supervisor chooses the next role by inspecting artifact availability. Specialists share artifacts through explicit state channels.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 22. RAG Agents

1. **Why embed questions and chunks with the same model?** Both vectors need the same coordinate space for comparison.

2. **How is this example implemented?** The loader extracts PDF text, then the vector index ranks chunks by cosine similarity. This local index embeds the corpus on every query, which keeps the data flow visible.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 23. Agentic RAG

1. **How does this implementation bound correction?** The attempt channel permits only one rewrite.

2. **How is this example implemented?** A missing hit triggers one rewrite and a mock external lookup. The extractive acceptance check rejects text absent from the retrieved sentence. It cannot verify that the sentence answers the question.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 24. SQL Agents

1. **Why avoid accepting raw SQL from the model?** A typed filter contract constrains the query to application-owned SQL.

2. **How is this example implemented?** The model chooses typed filters. Application code compiles them into one parameterized SELECT, and PostgreSQL executes it in a read-only transaction. Restrict the database role further for deployment.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 25. Planning and Reflection

1. **What prevents endless reflection?** A revision budget enforced in the routing function.

2. **How is this example implemented?** Critique feeds back into the planning node, while revisions counts the budget. Deliver reports plans that still need review.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 26. Long-Term Memory

1. **How does updating memory avoid duplicates?** Reuse the key in the same namespace.

2. **How is this example implemented?** PostgreSQL keeps durable facts and the LangGraph store provides namespaced retrieval through a rebuilt index. The same key supports updates. Semantic search and episodic history serve different retrieval needs.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 27. Agent Evaluation

1. **Why is substring grounding only a proxy?** A matching substring can still be irrelevant or misleading.

2. **How is this example implemented?** The dataset specifies expected answers, supporting evidence and expected tool selection. Exact match and substring grounding are reproducible proxies. An LLM judge can score nuance but introduces drift.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 28. Observability

1. **Why exclude prompt contents from logs?** Prompts can contain confidential data and inflate telemetry storage.

2. **How is this example implemented?** The callback records duration, outcome, and optional token usage without logging prompt payloads. Replace it with an OpenTelemetry span or enable LangSmith through its environment configuration.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 29. Production Agent API

1. **Why separate health and readiness?** A process can be live while its model or database is unavailable.

2. **How is this example implemented?** The HTTP boundary validates input before invoking the graph. SSE frames carry progress and results. The bounded in-process queue demonstrates background work and drains on shutdown.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## 30. Capstone Project

1. **What state needs durable persistence?** Document slices and vectors, thread history, and pending interrupts.

2. **How is this example implemented?** The supervisor records the question, the librarian retrieves owner-scoped evidence, approval pauses at a durable checkpoint and the writer appends a cited answer. Document vectors and checkpoint history live in PostgreSQL.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.
