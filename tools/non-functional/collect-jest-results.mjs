/**
 * Runs backend non-functional Jest suites and writes structured JSON summary.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');
const resultsDir = join(root, 'docs/non-functional/results');

const pattern =
  'generate\\.(api|reliability|security)\\.e2e-spec\\.ts';

const result = spawnSync(
  'pnpm',
  [
    'exec',
    'nx',
    'run',
    'backend:test',
    '--',
    `--testPathPattern=${pattern}`,
    '--json',
    '--outputFile=docs/non-functional/results/jest-nf-output.json',
  ],
  { cwd: root, encoding: 'utf8', shell: true },
);

mkdirSync(resultsDir, { recursive: true });

const summary = {
  executed: result.status === 0,
  exitCode: result.status,
  tool: 'jest + supertest',
  pattern,
  stdout: result.stdout?.slice(-4000) ?? '',
  stderr: result.stderr?.slice(-4000) ?? '',
  timestamp: new Date().toISOString(),
};

writeFileSync(
  join(resultsDir, 'jest-nf-summary.json'),
  JSON.stringify(summary, null, 2),
);

if (result.status !== 0) {
  console.error('Non-functional Jest suites failed. See jest-nf-summary.json');
  process.exit(result.status ?? 1);
}

console.log('Non-functional Jest suites passed. Summary: jest-nf-summary.json');
