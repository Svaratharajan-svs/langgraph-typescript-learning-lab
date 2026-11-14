# Troubleshooting

| Symptom | Check |
| --- | --- |
| Connection refused on 11434 | Start Docker Desktop, then run the initialization script. |
| Model missing | Confirm the exact tag in /api/tags and the lab's .env. |
| 3B model runs slowly | CPU generation can be slow. Check Docker memory and use a suitable smaller model tag if necessary. |
| PostgreSQL error | Check port 5432, DATABASE_URL, and Compose logs. |
| Recursion limit | Inspect the loop exit condition and the model's tool-call messages. |
| Checkpoint missing | Use the same thread ID and checkpointer. MemorySaver ends when the process exits. |
| API returns 401 | Send Authorization: Bearer followed by the configured LAB_API_KEY. |
