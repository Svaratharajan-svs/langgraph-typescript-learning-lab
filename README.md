# LangGraph.js and TypeScript Learning Lab

Thirty independently runnable TypeScript projects share one local Docker Compose stack.

1. Install [Node, pnpm and Docker Desktop](WINDOWS-SETUP.md).
2. Start [shared Ollama and PostgreSQL](DOCKER-GUIDE.md) when a lesson needs them.
3. Pick a project from the [learning roadmap](LEARNING-ROADMAP.md).
4. Run `pnpm install`, `pnpm start`, `pnpm typecheck`, and `pnpm test` in that project.

The configuration module is copied into each lab so the folder can be extracted and installed on its own. All copies read the same environment variables and target the same shared services. To install the whole repository once, run `pnpm install` at the root.

[Concept index](CONCEPT-INDEX.md) · [Package versions](PACKAGE-VERSIONS.md) · [Interview questions](INTERVIEW-QUESTIONS.md) · [Progress tracker](PROGRESS-TRACKER.md) · [Troubleshooting](TROUBLESHOOTING.md) · [Validation report](VALIDATION.md)

## API exercises

Set LAB_API_KEY as shown in Windows setup. Lab 29 exposes GET /health, POST /run and POST /stream with a JSON text field, and POST /jobs plus GET /jobs/:id. Add an Authorization bearer header for all routes except health.

Lab 30 uses the same key and port. Upload a PDF with multipart POST /documents/ada. Send POST /ask with JSON fields owner (ada), thread (a UUID you generate), and question. Approve or reject via POST /approve with owner, thread and approved (boolean). Inspect the thread at GET /history/ada/THREAD. One trusted API key grants access to all owner scopes in this local lab. Run one server at a time, or set different PORT values.

## Sources

- [LangGraph.js overview](https://docs.langchain.com/oss/javascript/langgraph/overview)
- [LangGraph Graph API](https://docs.langchain.com/oss/javascript/langgraph/graph-api)
- [LangGraph persistence](https://docs.langchain.com/oss/javascript/langgraph/persistence)
- [ChatOllama integration](https://docs.langchain.com/oss/javascript/integrations/chat/ollama)

### Try the REST endpoints

Set the API key using the Windows setup guide. In Git Bash, with Lab 29 running:

```bash
curl -fsS http://localhost:3000/health
curl -fsS -H "Authorization: Bearer $LAB_API_KEY" -H 'Content-Type: application/json' \
  -d '{"text":"Explain a LangGraph checkpoint in one sentence"}' http://localhost:3000/run
```

With Lab 30 running and a local text-based PDF called guide.pdf:

```bash
thread=$(node -e 'console.log(crypto.randomUUID())')
base=http://localhost:3000
auth="Authorization: Bearer $LAB_API_KEY"
curl -fsS -H "$auth" -F 'file=@guide.pdf;type=application/pdf' "$base/documents/ada"
curl -fsS -H "$auth" -H 'Content-Type: application/json' \
  -d "{\"owner\":\"ada\",\"thread\":\"$thread\",\"question\":\"What does this guide cover?\"}" "$base/ask"
curl -fsSN -H "$auth" -H 'Content-Type: application/json' \
  -d "{\"owner\":\"ada\",\"thread\":\"$thread\",\"approved\":true}" "$base/approve"
curl -fsS -H "$auth" "$base/history/ada/$thread"
```

Use curl.exe from PowerShell. For complex JSON, construct a PowerShell hashtable, pipe it through ConvertTo-Json -Compress, and send it via Invoke-RestMethod with -ContentType 'application/json'. Use Git Bash for the exact multi-line examples above.
