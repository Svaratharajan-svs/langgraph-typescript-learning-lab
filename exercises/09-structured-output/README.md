# 09. Structured Output

## A. Learning Objectives

- Zod schemas
- Structured responses
- JSON validation
- Output parsing
- Schema errors
- Retry on invalid responses

## B. Concept Explanation

The schema specifies the output contract. Parsing again at the node boundary protects downstream consumers. Invalid attempts receive one retry.

**Application.** Resume information extraction agent. State is useful when downstream steps need an explicit record of prior decisions. Each additional channel expands the data that must be tested and, for checkpointed graphs, stored. A common mistake is mutating state directly instead of returning a patch.

## C. Architecture

```mermaid
flowchart LR
    Input --> Graph["Compiled LangGraph workflow"]
    Graph --> State["State channels"]
    Graph --> Output
```

```mermaid
flowchart TD
    Start --> Work["extract"]
```

The CLI supplies the sample input. The graph runs the nodes and merges their state updates. The test calls the same implementation with fixtures and checks observable behavior. Read the edge declarations for the exact routing rules.

## D. Prerequisites

Node.js 24 and pnpm 11. Complete the earlier graph and state lessons first. Services for the demo: Ollama.

## E. Initial Project Setup

PowerShell, from this project folder:

```powershell
Copy-Item .env.example .env
pnpm install
```

Git Bash:

```bash
cp .env.example .env
pnpm install
```

## F. Exercises Without Answers

**Difficulty:** Intermediate

**Problem.** Resume information extraction agent.

- **Requirements.** Implement the stages in the graph and verify the scenario with an automated test.
- **Input example.** Ada Lovelace, TypeScript and Python, 3 years.
- **Expected behavior.** A résumé object contains name, skills and nonnegative years.
- **Hint.** List the values each stage reads and writes before connecting the edges.


## G. Complete Solutions

[Solution walkthrough](solutions/README.md) · [Graph](src/graph/workflow.ts) · [CLI](src/index.ts) · [Tests](tests/workflow.test.ts)

## H. Deep Code Explanation

The schema specifies the output contract. Parsing again at the node boundary protects downstream consumers. Invalid attempts receive one retry.

Start at the state declaration and identify the channels read by each node. Follow the edges outward from START. Each node emits its update, the graph commits or merges updates for the step, and the selected successor receives the next state. For checkpointed examples, inspect committed state with the same thread ID.

## I. Execution

If the demo uses shared services, start them once from the archive root using `powershell -ExecutionPolicy Bypass -File infrastructure/scripts/init.ps1` or `bash infrastructure/scripts/init.sh`. Return to this project and use `pnpm health` to check Ollama when applicable.

```text
pnpm install
pnpm typecheck
pnpm test
pnpm start
```

Stop a long-running CLI or API with Ctrl+C. Stop the shared services from the root with `docker compose -f infrastructure/docker-compose.yml down`.

## J. Expected Output

For the sample in `src/index.ts`, look for the following outcome. Model-generated wording can vary.

```text
candidate: Ada Lovelace, [TypeScript, Python], 3
```

## K. Challenge Exercises

1. Model missing years explicitly.
2. Capture validation errors.
3. Test two invalid attempts.

## L. Interview Questions

1. **Why parse a structured response again?** It protects the node contract if the adapter or fixture violates it.

2. **How is this example implemented?** The schema specifies the output contract. Parsing again at the node boundary protects downstream consumers. Invalid attempts receive one retry.

3. **What happens if two branches write one channel?** Declare a reducer for that channel or consolidate the writes at a join.

4. **How can you test a model-backed node during CI?** Inject a deterministic model or function, then assert the resulting state and edges.

5. **A workflow returns an unexpected final value. Where do you look first?** Inspect updates for the earliest node that produced an unexpected write, then check its inputs and reducer.

## M. Debugging

If imports fail, run pnpm install with Node 24. If Ollama fails, run pnpm health and check the model tag and port. If a state value is missing, inspect the responsible node's returned patch and the state schema.

## N. Knowledge Check

- Which state fields exist before the first node runs?
- Which node can change the sample result and what does it read?
- Which behavior would you test without the external services?
