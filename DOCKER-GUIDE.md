# Shared Docker services

From the archive root, initialize once.

PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File infrastructure/scripts/init.ps1
curl.exe http://localhost:11434/api/tags
```

Git Bash:

```bash
bash infrastructure/scripts/init.sh
curl http://localhost:11434/api/tags
```

Both scripts start Ollama and PostgreSQL and pull the chat and embedding models into one persistent volume. Set OLLAMA_MODEL and OLLAMA_EMBED_MODEL in the shell before initialization to override the tags. Match those settings in a lab's .env file. The default is qwen2.5:3b. On memory-constrained hardware a smaller tag is an option, though tool calling and structured output quality can vary.

Host processes use localhost. Containers attached to the Compose default network use http://ollama:11434 and postgres:5432. The scripts bind both host ports to loopback. Database labs use schemas lab13, lab24, lab26 and lab30. The example database login is intended for local learning.

```bash
docker compose -f infrastructure/docker-compose.yml ps
docker compose -f infrastructure/docker-compose.yml logs ollama postgres
docker compose -f infrastructure/docker-compose.yml down
```

Use down without -v to keep model files and database data.
