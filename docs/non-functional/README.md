# Non-Functional Testing — DBC

This folder documents and stores results for non-functional tests of the **POST `/api/generate`** pipeline (natural language → LLM JSON → SQL / Prisma / TypeORM text).

## Architecture under test

| Layer | Component | Role |
|-------|-----------|------|
| HTTP | `GenerateController` | `POST /api/generate` |
| Validation | `GenerateRequestDto` + `ValidationPipe` | Request shape, length, whitelist |
| Service | `GenerateService` + Zod | Trim text, `resultType` |
| LLM | `GroqSchemaProvider` | Groq chat completions → JSON schema |
| Output | `DatabaseOutputService` + renderers | **Text only** — no SQL execution |

## How to run

### 1. API, reliability, security (Jest + Supertest)

Uses an in-memory Nest app with **mocked Groq** (no real API key required).

```bash
pnpm install
pnpm test:nf
```

Collect JSON summary:

```bash
pnpm test:nf:collect
```

Outputs:

- `docs/non-functional/results/jest-nf-output.json` (full Jest JSON, when using collect script)
- `docs/non-functional/results/jest-nf-summary.json`

### 2. Performance / load (autocannon)

Requires a **running backend** and valid **Groq** credentials (real LLM calls).

```bash
# Terminal 1
pnpm exec nx serve backend

# Terminal 2
pnpm test:perf
```

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `GENERATE_BASE_URL` | `http://localhost:3000` | Backend base URL |
| `DURATION` | `10` | Seconds per scenario |
| `CONNECTIONS` | `2` | Concurrent connections |
| `PIPELINING` | `1` | HTTP pipelining |
| `SCENARIO_COOLDOWN_MS` | `5000` | Pause between SQL / Prisma / TypeORM scenarios |
| `REQUEST_TIMEOUT_SEC` | `120` | Per-request timeout (LLM latency) |

### Backend LLM tuning (`.env`)

| Variable | Default | Purpose |
|----------|---------|---------|
| `LLM_MAX_CONCURRENT_REQUESTS` | `2` | Max parallel Groq generation pipelines |
| `LLM_REQUEST_TIMEOUT_MS` | `120000` | Groq HTTP call timeout (ms) |
| `LLM_RETRY_ATTEMPTS` | `3` | Retries on transient 429/5xx |
| `LLM_RETRY_DELAY_MS` | `750` | Backoff between provider retries |
| `SCHEMA_GEN_MAX_RETRIES` | `2` | JSON repair attempts after invalid LLM output |

Payloads: `tools/non-functional/payloads/{sql,prisma,typeorm}.json`

Output: `docs/non-functional/results/performance-results.json`

If the server is not reachable, the script writes `executed: false` and exits with code `2` (no fake metrics).

**Latest run (2026-05-15, after concurrency fix):** Prisma **4/4** and TypeORM **3/3** success under 2 connections × 10 s. See `results/performance-results.json`. Use `SCENARIO_COOLDOWN_MS` and `REQUEST_TIMEOUT_SEC` when running `pnpm test:perf`.

### 3. All backend unit tests

```bash
pnpm test:backend
```

## Test categories

| Category | Spec file | Tool | Groq |
|----------|-----------|------|------|
| API / validation | `generate.api.e2e-spec.ts` | Jest + Supertest | Mocked |
| Reliability | `generate.reliability.e2e-spec.ts` | Jest + Supertest | Mocked failures |
| Security / safety | `generate.security.e2e-spec.ts` | Jest + Supertest | Mocked |
| Performance | `run-autocannon.mjs` | autocannon | **Live** |

## Expected metrics (performance)

| Metric | Meaning |
|--------|---------|
| `latencyMs.average` | Mean response time (ms) |
| `latencyMs.max` | Worst case (ms) |
| `throughput.averageRps` | Successful requests per second |
| `requests.successful` / `failed` | HTTP success vs errors/timeouts/non-2xx |
| `requests.errorRate` | `failed / total` |

LLM latency dominates; use modest `CONNECTIONS` to avoid provider rate limits.

## Interpreting HTTP errors

| Code | Typical `error.code` | Cause |
|------|---------------------|--------|
| 400 | `EMPTY_TEXT` | Whitespace-only rules |
| 400 | `INVALID_RESULT_TYPE` | Bad `resultType` |
| 400 | `LLM_GENERATION` | Groq timeout / unavailable / empty model |
| 400 | `SCHEMA_VALIDATION` | Invalid LLM JSON after retries |
| 400 | (Nest validation) | DTO: missing fields, too long, extra keys |

Domain errors use `{ ok: false, error: { code, message } }` via `GenerateHttpExceptionFilter`. DTO validation uses Nest’s default `{ statusCode, message }` format.

## Results files

| File | Description |
|------|-------------|
| `results/performance-results.json` | autocannon run or “not executed” |
| `results/jest-nf-summary.json` | Jest NF run summary |
| `non-functional-test-results.md` | Human-readable table |
| `testing-summary.md` | Short index |
| `presentation-non-functional-testing.md` | Diploma slide content |
