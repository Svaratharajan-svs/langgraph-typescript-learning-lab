# Capstone Project solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The supervisor records the question, the librarian retrieves owner-scoped evidence, approval pauses at a durable checkpoint and the writer appends a cited answer. Document vectors and checkpoint history live in PostgreSQL.

- [REST routes and database persistence](../src/http/capstone.ts)
- [Fastify configuration](../src/http/server.ts)
- [PDF parsing, chunking, and vector similarity](../src/services/documents.ts)
