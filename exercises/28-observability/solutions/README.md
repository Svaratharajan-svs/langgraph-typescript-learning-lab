# Observability solution

The executable solution is [src/graph/workflow.ts](../src/graph/workflow.ts), wired through the [CLI](../src/index.ts) and exercised by [Vitest](../tests/workflow.test.ts).

The callback records duration, outcome, and optional token usage without logging prompt payloads. Replace it with an OpenTelemetry span or enable LangSmith through its environment configuration.
