# Validation report

| Check | Result |
| --- | --- |
| Node and dependency versions | Installed pinned npm versions, with Node 24.22.1 and pnpm 11.25.0 used for verification |
| Workspace installation | pnpm install --frozen-lockfile passed |
| Type checking | All 30 projects passed TypeScript strict checks |
| Tests | All 30 Vitest files passed using deterministic fixtures, including API injection and capstone approval/resume |
| Standalone folder | Lab 01 was copied outside the workspace, installed, type-checked, tested and run successfully |
| CLI smoke runs | Labs 01–05, 12, 14, 16–18, 20 and 27 run without external services |
| Compose | Parsed YAML and checked shared ports, health checks and persistent volumes. Bash initialization script passed syntax validation |
| Live infrastructure | Docker CLI and daemon were unavailable. Compose startup, PowerShell execution, live Ollama generation and embeddings, and PostgreSQL migrations and recovery remain unverified |
| API deployment | Fastify injection validated the Lab 29 request and stream routes. Lab 30 workflow passed with a memory checkpointer and deterministic retrieval. Live PDF upload through the HTTP route and the full PostgreSQL-backed capstone remain unverified |

Lessons use compact implementations where appropriate. The initial lab favors one focused test scenario per project. The supervisor examples use role-based graph nodes, SQL uses a fixed parameterized SELECT generated from typed filters, and the API background queue lives in process memory. The capstone uses a shared local API key, a bounded exact vector search over stored JSON embeddings, and step-level SSE updates. Extend those choices before operating the example as a multi-tenant production service.

For live verification, start the shared services, run pnpm health from a model-backed exercise, run Lab 13 for checkpoint recovery, and work through the REST examples in the root README with a text-based PDF.
