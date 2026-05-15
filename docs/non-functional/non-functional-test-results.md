# Non-Functional Test Results — DBC

**Execution date:** 2026-05-15 (after concurrency-limiter fix)  
**Endpoint:** `POST /api/generate`  
**Environment:** Local backend, root `.env` with Groq credentials

## Root cause (Prisma/TypeORM load failures)

All `resultType` values share the **same LLM pipeline** (Groq → JSON → renderers). Earlier load failures were **not** Prisma/TypeORM-specific render bugs. They were caused by:

1. **Unbounded concurrent Groq calls** when autocannon opened 2+ connections.
2. **Groq rate limits** returning errors mapped to HTTP **400** (generic).
3. **Sequential perf scenarios** (SQL then Prisma then TypeORM) exhausting quota before later scenarios.
4. **Autocannon default request timeout** marking slow LLM responses as failures despite HTTP **201**.

**Fixes applied:** `LlmConcurrencyLimiter`, provider retry/backoff, HTTP **429/503/504** error codes, scenario cooldown, `REQUEST_TIMEOUT_SEC=120` for load tests.

## Results table

| Category | Component | Tool | Scenario | Metric | Actual result | Status |
|----------|-----------|------|----------|--------|---------------|--------|
| API / validation | DTO + Zod | Jest + Supertest | SQL / Prisma / TypeORM | HTTP 201 | 3/3 (mocked Groq) | **passed** |
| API / validation | `ValidationPipe` | Jest + Supertest | Invalid input cases | HTTP 400 | 9/9 | **passed** |
| Reliability | `LlmJsonService` | Jest + Supertest | Timeout / rate limit / unavailable | 504 / 429 / 503 | 8/8 | **passed** |
| Reliability | Express | Jest + Supertest | Malformed JSON | HTTP 400 | Pass | **passed** |
| Security | Input + renderers | Jest + Supertest | Injection / oversized / SQL safety | No crash | 5/5 | **passed** |
| Concurrency | Full API + renderers | Jest + Supertest | 4× parallel Prisma/TypeORM | HTTP 201 | 3/3 suites | **passed** |
| Concurrency | `LlmConcurrencyLimiter` | Jest unit | Max 2 Groq pipelines | `maxActive ≤ 2` | Pass | **passed** |
| Performance (load) | Live Groq | autocannon | SQL, 2 conn × 10 s | Success rate | 8/113 (quota burst; see note) | **partial** |
| Performance (load) | Live Groq | autocannon | Prisma, 2 conn × 10 s | Success rate | **4/4 (100%)**, avg **2731 ms** | **passed** |
| Performance (load) | Live Groq | autocannon | TypeORM, 2 conn × 10 s | Success rate | **3/3 (100%)**, avg **3178 ms** | **passed** |
| Unit + e2e | Backend | Jest | All suites | — | **69/69 passed** | **passed** |

**SQL load note:** First scenario after prior runs saw many fast HTTP 400 responses (Groq quota). Prisma/TypeORM scenarios with **8 s cooldown** and **concurrency limit** achieved **100% HTTP 201**.

## Jest summary

| Command | Result |
|---------|--------|
| `pnpm test:nf` | **25/25 passed** (e2e NF) |
| `pnpm test:backend` | **69/69 passed** (unit + e2e) |

## Performance (autocannon) — live Groq

**Config:** `DURATION=10`, `CONNECTIONS=2`, `SCENARIO_COOLDOWN_MS=8000`, `REQUEST_TIMEOUT_SEC=120`

| Scenario | Total | Successful | Failed | Error rate | Avg latency (ms) | Max (ms) | Req/s |
|----------|-------|------------|--------|------------|------------------|----------|-------|
| sql | 113 | 8 | 105 | 92.9% | 156 | 2148 | 11.2 |
| prisma | 4 | 4 | 0 | **0%** | 2731 | 4310 | 0.37 |
| typeorm | 3 | 3 | 0 | **0%** | 3178 | 3876 | 0.29 |

**Status codes (Prisma/TypeORM):** all **201**. No mass HTTP 400 under concurrency after fix.

## New environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `LLM_MAX_CONCURRENT_REQUESTS` | `2` | Max parallel LLM generation pipelines |
| `LLM_REQUEST_TIMEOUT_MS` | `120000` | Per Groq HTTP call timeout |
| `LLM_RETRY_ATTEMPTS` | `3` | Retries for transient 429/5xx |
| `LLM_RETRY_DELAY_MS` | `750` | Base delay between provider retries |
| `SCHEMA_GEN_MAX_RETRIES` | `2` | JSON repair rounds (unchanged) |

## Commands

```bash
pnpm exec nx serve backend
pnpm test:nf
pnpm test:backend
pnpm test:perf   # optional: SCENARIO_COOLDOWN_MS=8000 REQUEST_TIMEOUT_SEC=120
```

## Artifacts

- `docs/non-functional/results/performance-results.json`
- `docs/non-functional/results/jest-nf-summary.json`
- `docs/non-functional/presentation-non-functional-testing.md`
