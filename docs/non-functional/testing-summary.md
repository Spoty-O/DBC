# Testing Summary — DBC Non-Functional

**Last run:** 2026-05-15 (after LLM concurrency fix)

## Quick status

| Suite | Command | Result |
|-------|---------|--------|
| API + reliability + security + concurrency | `pnpm test:nf` | **25/25 passed** |
| Backend (all) | `pnpm test:backend` | **69/69 passed** |
| Performance (load) | `pnpm test:perf` | Prisma **4/4**, TypeORM **3/3** success (2 conn, 10 s) |

## Commands

```bash
pnpm exec nx serve backend
pnpm test:nf
pnpm test:backend
pnpm test:perf   # SCENARIO_COOLDOWN_MS=8000 REQUEST_TIMEOUT_SEC=120 recommended
```

## Where results live

- [non-functional-test-results.md](./non-functional-test-results.md)
- [presentation-non-functional-testing.md](./presentation-non-functional-testing.md)
- [results/performance-results.json](./results/performance-results.json)
- [results/jest-nf-summary.json](./results/jest-nf-summary.json)

## Coverage map

| Category | Location |
|----------|----------|
| Concurrency limiter | `apps/backend/.../llm-concurrency.limiter.ts` |
| Performance | `tools/non-functional/performance/run-autocannon.mjs` |
| Reliability | `generate.reliability.e2e-spec.ts` |
| Security | `generate.security.e2e-spec.ts` |
| Validation | `generate.api.e2e-spec.ts` |
| Concurrent e2e | `generate.concurrency.e2e-spec.ts` |
