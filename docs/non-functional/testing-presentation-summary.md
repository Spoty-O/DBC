# Testing Summary for Diploma Presentation

## Why Testing Was Needed

- The core feature (`POST /api/generate`) calls an **external LLM (Groq)** and returns database artifacts — failures affect real users, not only unit logic.
- **Non-functional testing** checks behavior under load, bad input, and provider stress — beyond “happy path” unit tests.
- LLM systems are **non-deterministic**: timeouts, rate limits, and invalid JSON must be handled safely.
- Multiple clients can hit generation at once; without control, **Groq rate limits** caused unstable Prisma/TypeORM responses under load.
- Output must stay **safe** (no SQL execution, no leaking secrets via prompts).

## What Was Tested

- **API validation** — `text`, `resultType` (sql / prisma / typeorm), length limits, whitelist
- **Reliability** — timeouts, rate limits, provider unavailable, invalid/empty LLM JSON, repair retries, malformed HTTP body
- **Security** — prompt injection, prompt exfiltration, oversized payloads, SQL returned as text only
- **Concurrency** — parallel Prisma, TypeORM, and mixed requests (mocked provider)
- **Load / performance** — autocannon against live backend + Groq (`sql`, `prisma`, `typeorm` scenarios)
- **SQL safety** — renderer produces strings only; no `execute` / `query` hooks
- **Unit coverage** — parsers, Zod validation, renderers, `GenerateService`, `LlmJsonService`, concurrency limiter

**Endpoint under test:** `POST /api/generate`

## How Testing Was Performed

| Approach | Tool | Notes |
|----------|------|--------|
| Automated API tests | **Jest + Supertest** | In-memory Nest app; **Groq mocked** — no API key in CI |
| Load tests | **autocannon** | Running backend + **real Groq**; payloads in `tools/non-functional/payloads/` |
| Unit tests | **Jest** | 14 spec files (renderers, LLM pipeline, limiter) |
| Orchestration | **Nx** | `backend:test`, `backend:test-nf` |
| Scripts | `pnpm test:nf`, `pnpm test:backend`, `pnpm test:perf` | Results in `docs/non-functional/results/` |

**E2e suites (4 files, 25 tests):** `generate.api`, `generate.reliability`, `generate.security`, `generate.concurrency`

**Test harness:** `apps/backend/src/testing/create-test-app.ts` — mirrors production `ValidationPipe` and `/api` prefix.

## What Problems Were Found

- **Prisma/TypeORM looked broken under load** — many HTTP **400** responses; not separate renderer bugs.
- **Root cause:** SQL, Prisma, and TypeORM share the **same Groq JSON pipeline**; only renderers differ.
- **Unbounded concurrent LLM pipelines** when autocannon used 2+ connections → Groq **429** / overload.
- **Rate limits and timeouts** were often exposed as generic **HTTP 400** (`LLM_GENERATION`) — hard to diagnose.
- **Sequential load scenarios** (SQL → Prisma → TypeORM) could **exhaust quota** before later scenarios.
- **Autocannon default timeout** could mark slow but successful LLM calls as failures.
- **SQL load scenario** in the recorded run: **8/113** success (mostly **400**) — documented as quota burst on the first scenario, not renderer failure.

## How Problems Were Fixed

- **`LlmConcurrencyLimiter`** — max **2** parallel generation pipelines (config: `LLM_MAX_CONCURRENT_REQUESTS`)
- **Provider retry + backoff** — `withRetry` for transient **429/5xx** (`LLM_RETRY_ATTEMPTS`, `LLM_RETRY_DELAY_MS`)
- **Per-call timeout** — `withTimeout` + **HTTP 504** (`LLM_REQUEST_TIMEOUT_MS`, default 120s)
- **Clear HTTP codes** — **429** rate limit, **503** unavailable, **504** timeout (via `LlmJsonService` + domain errors)
- **Load test tuning** — `SCENARIO_COOLDOWN_MS=8000`, `REQUEST_TIMEOUT_SEC=120` in autocannon runner
- **Prisma renderer** — rename conflicting field names instead of crashing on duplicate LLM field names
- **TypeORM renderer** — FK scalar columns alongside relations

## Final Results

| Result | Value | Source |
|--------|-------|--------|
| NF e2e tests | **25/25 passed** | `jest-nf-summary.json` |
| All backend tests | **69/69 passed** | `non-functional-test-results.md` |
| Load — Prisma | **4/4 success**, **0%** errors, avg **2731 ms**, all **201** | `performance-results.json` |
| Load — TypeORM | **3/3 success**, **0%** errors, avg **3178 ms**, all **201** | same |
| Load — SQL (first scenario) | **8/113** success — quota burst; not used as pass/fail for ORM fix | same |
| Security | Injection, oversized input, SQL-as-text — **passed** (e2e) | Jest NF suites |
| Validation | Invalid input rejected **before** mocked/real Groq call | API e2e |

**After fixes:** Prisma and TypeORM reached **100% success** under **2 concurrent clients** for **10 s** each (with cooldown between scenarios).

## Key Engineering Decisions

- **One JSON model from Groq** for all output types; `resultType` only selects the renderer.
- **Renderers never execute SQL** — they return text (SQL DDL, Prisma schema, TypeORM entities).
- **Validation layers:** DTO (`class-validator`) → service Zod → LLM JSON parse/validate → renderer checks.
- **Concurrency limiter** protects Groq and stabilizes parallel HTTP clients.
- **Mocked Groq for fast, repeatable e2e**; **live Groq only for load tests** (documented, reproducible config).
- **Structured API errors:** `{ ok: false, error: { code, message } }` via `GenerateHttpExceptionFilter`.

## Short Conclusion

Testing combined **Jest unit tests**, **25 Supertest e2e cases** with mocked Groq, and **autocannon load tests** against the real provider. Load testing showed that Prisma/TypeORM failures were caused by **uncontrolled LLM concurrency and error mapping**, not ORM-specific logic. A **concurrency limiter**, **retries**, **timeouts**, and **correct HTTP status codes** stabilized the system; recorded runs show **100% success for Prisma and TypeORM** under controlled load. The pipeline validates unsafe input early and returns generated SQL as **text only**, without executing it on a database.

---

**Commands for defense demo**

```bash
pnpm test:nf          # 25 e2e (mocked Groq)
pnpm test:backend     # 69 total backend tests
pnpm exec nx serve backend   # then: pnpm test:perf (live Groq)
```

**Artifacts:** `docs/non-functional/results/jest-nf-summary.json`, `performance-results.json`
