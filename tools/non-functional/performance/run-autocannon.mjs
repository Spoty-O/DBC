/**
 * Load test for POST /api/generate using autocannon.
 *
 * Prerequisites:
 *   1. Backend running: pnpm exec nx serve backend
 *   2. Valid GROQ_API_KEY and GROQ_MODEL in .env (real LLM calls)
 *
 * Usage:
 *   node tools/non-functional/performance/run-autocannon.mjs
 *   GENERATE_BASE_URL=http://localhost:3000 DURATION=10 CONNECTIONS=5 node ...
 */
import autocannon from 'autocannon';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../../..');
const resultsDir = join(root, 'docs/non-functional/results');
const payloadDir = join(root, 'tools/non-functional/payloads');

const baseUrl =
  process.env.GENERATE_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';
const duration = Number(process.env.DURATION ?? 10);
const connections = Number(process.env.CONNECTIONS ?? 2);
const pipelining = Number(process.env.PIPELINING ?? 1);
const scenarioCooldownMs = Number(process.env.SCENARIO_COOLDOWN_MS ?? 5000);
/** Per-request timeout (seconds). LLM generation often exceeds autocannon's default. */
const requestTimeoutSec = Number(process.env.REQUEST_TIMEOUT_SEC ?? 120);

const scenarios = [
  { name: 'sql', file: 'sql.json' },
  { name: 'prisma', file: 'prisma.json' },
  { name: 'typeorm', file: 'typeorm.json' },
];

function summarize(result, scenario) {
  const total = result.requests.total;
  const errors = result.errors + result.timeouts + result.non2xx;
  const success = total - errors;
  return {
    scenario,
    target: `${baseUrl}/api/generate`,
    durationSeconds: duration,
    connections,
    requests: {
      total,
      successful: success,
      failed: errors,
      errorRate: total > 0 ? Number((errors / total).toFixed(4)) : 0,
    },
    latencyMs: {
      average: Math.round(result.latency.average * 100) / 100,
      max: result.latency.max,
      p50: result.latency.p50,
      p97_5: result.latency.p97_5,
      p99: result.latency.p99,
    },
    throughput: {
      requestsPerSecond:
        result.duration > 0
          ? Math.round((total / result.duration) * 100) / 100
          : 0,
      bytesPerSecond: Math.round(result.throughput.average * 100) / 100,
      totalBytes: result.throughput.total,
    },
    statusCodeCounts: result.statusCodeStats ?? {},
    timestamp: new Date().toISOString(),
  };
}

function runScenario(name, body) {
  return new Promise((resolve, reject) => {
    const instance = autocannon(
      {
        url: `${baseUrl}/api/generate`,
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        connections,
        duration,
        pipelining,
        timeout: requestTimeoutSec,
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(summarize(result, name));
      },
    );
    autocannon.track(instance, { renderProgressBar: true });
  });
}

async function probeServer() {
  try {
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: 'ping',
        resultType: 'sql',
      }),
      signal: AbortSignal.timeout(5000),
    });
    return { reachable: true, status: res.status };
  } catch (err) {
    return { reachable: false, error: String(err) };
  }
}

async function main() {
  mkdirSync(resultsDir, { recursive: true });

  const probe = await probeServer();
  if (!probe.reachable) {
    const prepared = {
      executed: false,
      reason:
        'Backend not reachable at GENERATE_BASE_URL. Start with: pnpm exec nx serve backend',
      probe,
      timestamp: new Date().toISOString(),
    };
    writeFileSync(
      join(resultsDir, 'performance-results.json'),
      JSON.stringify(prepared, null, 2),
    );
    console.error(prepared.reason);
    process.exit(2);
  }

  console.log(
    `Load testing ${baseUrl}/api/generate (${connections} connections, ${duration}s each scenario)`,
  );

  const runs = [];
  for (let i = 0; i < scenarios.length; i += 1) {
    const { name, file } = scenarios[i];
    if (i > 0 && scenarioCooldownMs > 0) {
      console.log(
        `\nCooling down ${scenarioCooldownMs}ms before next scenario…`,
      );
      await new Promise((r) => setTimeout(r, scenarioCooldownMs));
    }
    const body = JSON.parse(readFileSync(join(payloadDir, file), 'utf8'));
    console.log(`\n--- Scenario: ${name} ---`);
    runs.push(await runScenario(name, body));
  }

  const output = {
    executed: true,
    tool: 'autocannon',
    endpoint: 'POST /api/generate',
    configuration: {
      baseUrl,
      duration,
      connections,
      pipelining,
      scenarioCooldownMs,
      requestTimeoutSec,
    },
    probe,
    runs,
    timestamp: new Date().toISOString(),
  };

  const outPath = join(resultsDir, 'performance-results.json');
  writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`\nResults written to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
