import { readFile, writeFile, mkdir, copyFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { categories, scoreCase, summarize } from './evaluation-core.mjs';

const mode = process.argv[2] ?? 'final';
const reviewOnly = process.argv.includes('--review');
const final = mode !== 'baseline';
const source =
  mode === 'challenge'
    ? 'data/day-4-challenge-cases.json'
    : mode === 'hardening'
      ? 'data/hardening-cases.json'
      : 'data/test-cases.json';
const destination =
  mode === 'challenge'
    ? 'Result/day-4-challenge-after.json'
    : `Result/${mode}-results.json`;
const tests = JSON.parse(await readFile(source, 'utf8'));
const engineSource = await readFile('lib/support-engine.ts');
const evaluatorSource = await readFile('scripts/evaluation-core.mjs');
const model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
const appUrl = process.env.SUPPORTFLOW_URL || 'http://localhost:3000';
const modelUrl = (
  process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'
).replace(/\/+$/, '');
const cases = [];
let originalSummary = null;
if (reviewOnly) {
  const previous = JSON.parse(await readFile(destination, 'utf8'));
  originalSummary = previous.summary;
  for (const t of tests) {
    const old = previous.cases.find((c) => c.id === t.id);
    if (!old) throw new Error(`Missing evidence for ${t.id}`);
    if (old.message !== undefined && old.message !== t.message)
      throw new Error(`Input changed for ${t.id}; rerun instead of rescoring.`);
    const validation =
      final &&
      !t.message.trim() &&
      (old.http_status === 400 || old.checks.validation_error_match);
    cases.push({
      ...old,
      message: t.message,
      checks: scoreCase(t, old.output, { final, validation }),
    });
  }
} else {
  for (const t of tests) {
    const started = performance.now();
    try {
      if (!final && !t.message.trim()) {
        cases.push({
          ...t,
          status: 'not_applicable',
          output: null,
          http_status: null,
          processing_time_ms: null,
          checks: scoreCase(t, null),
          note: 'No validation capability in generic prompt baseline; not counted as a valid-ticket quality case.',
        });
        continue;
      }
      const prompt = [
        'You are helping a customer-support agent.',
        `Classify using one of: ${categories.join(', ')}.`,
        'Set urgency normal, high, or critical. Decide whether a human must approve. Draft a concise helpful reply. Use no external policy or knowledge base. Return JSON with category, urgency, requires_human_approval, draft_reply.',
        `Customer message: ${t.message}`,
      ].join('\n');
      const response = await fetch(
        final ? `${appUrl}/api/review` : `${modelUrl}/api/generate`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(
            final
              ? { message: t.message }
              : {
                  model,
                  prompt,
                  stream: false,
                  format: 'json',
                  options: { temperature: 0, seed: 42, num_predict: 420 },
                },
          ),
          signal: AbortSignal.timeout(125000),
        },
      );
      const raw = await response.json();
      let output = final ? raw : null;
      if (!final && response.ok) {
        try {
          output = JSON.parse(
            raw.response
              .trim()
              .replace(/^```(?:json)?/i, '')
              .replace(/```$/, '')
              .trim(),
          );
        } catch {
          output = null;
        }
      }
      const validation =
        final &&
        !t.message.trim() &&
        response.status === 400 &&
        raw.code === 'MESSAGE_REQUIRED';
      if (validation) output = null;
      const checks = scoreCase(t, output, { final, validation });
      cases.push({
        ...t,
        status: response.ok || validation ? 'completed' : 'failed',
        http_status: response.status,
        output,
        processing_time_ms: Math.round(performance.now() - started),
        checks,
      });
      console.log(`${t.id}: ${checks.pass ? 'PASS' : 'FAIL'}`);
    } catch (e) {
      cases.push({
        ...t,
        status: 'failed',
        output: null,
        error: e.message,
        processing_time_ms: Math.round(performance.now() - started),
        checks: scoreCase(t, null, { final }),
      });
      console.log(`${t.id}: ERROR`);
    }
  }
}
await mkdir('Result/history', { recursive: true });
try {
  await access(destination);
  await copyFile(
    destination,
    path.join(
      'Result/history',
      `${path.basename(destination, '.json')}-${Date.now()}.json`,
    ),
  );
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
const hash = (value) => createHash('sha256').update(value).digest('hex');
let revision = null,
  dirty = null;
try {
  revision = execFileSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
  dirty = !!execFileSync('git', ['status', '--porcelain'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
} catch {
  /* ZIP delivery has no Git metadata. */
}
const result = {
  summary: {
    ...summarize(cases),
    system: mode,
    run_status: 'complete',
    completed_at: originalSummary?.completed_at ?? new Date().toISOString(),
    rescored_at: reviewOnly ? new Date().toISOString() : null,
    evaluator_version: '2',
    model: originalSummary?.model ?? model,
    source_revision: reviewOnly
      ? (originalSummary?.source_revision ?? null)
      : revision,
    source_dirty: reviewOnly ? (originalSummary?.source_dirty ?? null) : dirty,
    suite_sha256: hash(await readFile(source)),
    engine_sha256: reviewOnly
      ? (originalSummary?.engine_sha256 ?? null)
      : hash(engineSource),
    evaluator_sha256: hash(evaluatorSource),
  },
  cases,
};
result.summary.result_sha256 = hash(JSON.stringify(cases));
if (!reviewOnly)
  await writeFile(
    `Result/history/engine-${hash(engineSource)}.txt`,
    engineSource,
  );
await writeFile(
  `Result/history/evaluator-${hash(evaluatorSource)}.txt`,
  evaluatorSource,
);
await writeFile(destination, JSON.stringify(result, null, 2) + '\n');
console.log(
  `${destination}: ${result.summary.cases_passed}/${cases.length} checks passed; human review not asserted.`,
);
// A baseline is expected to expose failures; final systems must satisfy the gate.
if (final && cases.some((c) => !c.checks.pass)) process.exitCode = 1;
