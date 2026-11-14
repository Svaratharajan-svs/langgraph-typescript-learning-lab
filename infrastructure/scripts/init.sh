#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose up -d --wait
docker compose exec -T ollama ollama pull "${OLLAMA_MODEL:-qwen2.5:3b}"
docker compose exec -T ollama ollama pull "${OLLAMA_EMBED_MODEL:-nomic-embed-text}"
