# Windows setup

Install Docker Desktop with the WSL 2 backend, start it and install Node.js 24 LTS. In PowerShell or Git Bash, run:

```text
npm install --global pnpm@11.25.0
node --version
pnpm --version
docker compose version
```

Extract the ZIP and open a terminal in the extracted root. Follow [Docker setup](DOCKER-GUIDE.md) for shared services. Start a lab with the commands below.

```text
cd exercises/01-langgraph-fundamentals
pnpm install
pnpm start
pnpm test
```

In PowerShell, set a server API key with `$env:LAB_API_KEY = 'your-local-key-of-at-least-16-characters'`. Git Bash uses `export LAB_API_KEY='your-local-key-of-at-least-16-characters'`. The APIs bind to loopback.
