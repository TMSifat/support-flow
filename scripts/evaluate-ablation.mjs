import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { loadEngine } from './engine-loader.mjs';
import { evaluatorVersion, scoreCase, summarize } from './evaluation-core.mjs';
const { reviewSupportTicket } = await loadEngine();
const originalFetch = globalThis.fetch;
const result = [];
const neutral = {
  category: 'other',
  urgency: 'normal',
  confidence: 95,
  facts: [],
  missing_information: [],
  recommended_action: 'Review the request.',
  requires_human_approval: false,
  approval_reason: null,
  draft_reply: 'A team member must review this request.',
};
globalThis.fetch = async () =>
  Response.json({ response: JSON.stringify(neutral) });
try {
  for (const [suite, file] of [
    ['original', 'data/test-cases.json'],
    ['challenge', 'data/day-4-challenge-cases.json'],
    ['hardening', 'data/hardening-cases.json'],
    ['remediation', 'data/remediation-cases.json'],
  ]) {
    const cases = [];
    for (const test of JSON.parse(await fs.readFile(file, 'utf8')).filter((t) =>
      t.message.trim(),
    )) {
      const started = performance.now();
      const output = await reviewSupportTicket(test.message);
      cases.push({
        ...test,
        output,
        status: 'completed',
        processing_time_ms: Math.round(performance.now() - started),
        checks: scoreCase(test, output, { final: true }),
      });
    }
    result.push({ suite, summary: summarize(cases), cases });
  }
} finally {
  globalThis.fetch = originalFetch;
}
await fs.writeFile(
  'Result/ablation-results.json',
  JSON.stringify(
    {
      completed_at: new Date().toISOString(),
      evaluator_version: evaluatorVersion,
      method:
        'No-inference ablation: same neutral valid model object for every input; actual rules/templates unchanged. This is a controlled ablation, not an optimized independent rules product. In-process timing is not comparable to HTTP timings.',
      engine_sha256: createHash('sha256')
        .update(await fs.readFile('lib/support-engine.ts'))
        .digest('hex'),
      evaluator_sha256: createHash('sha256')
        .update(await fs.readFile('scripts/evaluation-core.mjs'))
        .digest('hex'),
      suites: result,
    },
    null,
    2,
  ) + '\n',
);
console.log(
  result
    .map(
      (s) =>
        `${s.suite}: ${s.summary.common_passes}/${s.summary.valid_ticket_count} common passes`,
    )
    .join('\n'),
);
