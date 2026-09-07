import { spawnSync } from 'node:child_process';
const steps = [
  ...[
    'final',
    'challenge',
    'hardening',
    'remediation',
    'baseline',
    'policy-baseline',
  ].map((mode) => ['scripts/evaluate-system.mjs', mode]),
  ['scripts/evaluate-ablation.mjs'],
  ['scripts/render-evaluation.mjs'],
  ['scripts/render-system-comparison.mjs'],
];
for (const args of steps) {
  const run = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
}
