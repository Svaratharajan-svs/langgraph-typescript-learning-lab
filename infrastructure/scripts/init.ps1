Push-Location (Join-Path $PSScriptRoot '..')
try {
  docker compose up -d --wait
  if ($LASTEXITCODE) { throw "Compose startup failed" }
  $model = if ($env:OLLAMA_MODEL) { $env:OLLAMA_MODEL } else { "qwen2.5:3b" }
  $embed = if ($env:OLLAMA_EMBED_MODEL) { $env:OLLAMA_EMBED_MODEL } else { "nomic-embed-text" }
  docker compose exec -T ollama ollama pull $model
  if ($LASTEXITCODE) { throw "Chat model pull failed" }
  docker compose exec -T ollama ollama pull $embed
  if ($LASTEXITCODE) { throw "Embedding model pull failed" }
} finally { Pop-Location }
