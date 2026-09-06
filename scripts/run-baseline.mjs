import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import path from 'node:path';

const root = process.cwd();
const testCasesPath = path.join(root, 'data', 'test-cases.json');
const resultDir = path.join(root, 'Result');
const resultsPath = path.join(resultDir, 'baseline-results.json');
const summaryPath = path.join(resultDir, 'baseline-summary.md');

const model = process.env.OLLAMA_MODEL || 'llama3.1:8b';
const baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const categories = [
  'wrong_item',
  'return_refund',
  'shipping_delay',
  'order_change',
  'payment_security',
  'account_security',
  'product_information',
  'legal_safety',
  'complaint',
  'other',
];

function buildPrompt(message) {
  return [
    'You are helping a customer-support agent.',
    `Classify the message using one category: ${categories.join(', ')}.`,
    'Set urgency to normal, high, or critical.',
    'Decide whether a human must approve the response or action.',
    'Draft a concise helpful reply.',
    'Use no external policy or knowledge base.',
    'Return only valid JSON with keys: category, urgency, requires_human_approval, draft_reply.',
    '',
    `Customer message: ${message}`,
  ].join('\n');
}

function parseJson(text) {
  const cleaned = text
    .trim()
    .replace(/^\x60{3}(?:json)?/i, '')
    .replace(/\x60{3}$/, '')
    .trim();
  return JSON.parse(cleaned);
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

async function save(results, complete = false) {
  const validRuns = results.filter((item) => item.status === 'completed');
  const timedRuns = validRuns.map((item) => item.processing_time_ms);
  const summary = {
    run_status: complete ? 'complete' : 'in_progress',
    model,
    baseline_method:
      'single generic prompt; no policy retrieval, guardrails, retries, or validation layer',
    started_at: results[0]?.started_at ?? new Date().toISOString(),
    completed_at: complete ? new Date().toISOString() : null,
    cases_total: 12,
    cases_completed: validRuns.length,
    valid_json_rate: validRuns.length
      ? validRuns.filter((item) => item.checks.structured_output_valid).length /
        validRuns.length
      : 0,
    category_accuracy: validRuns.length
      ? validRuns.filter((item) => item.checks.category_match).length /
        validRuns.length
      : 0,
    urgency_accuracy: validRuns.length
      ? validRuns.filter((item) => item.checks.urgency_match).length /
        validRuns.length
      : 0,
    approval_accuracy: validRuns.length
      ? validRuns.filter((item) => item.checks.approval_match).length /
        validRuns.length
      : 0,
    automated_pass_rate: validRuns.length
      ? validRuns.filter((item) => item.checks.automated_pass).length /
        validRuns.length
      : 0,
    median_processing_time_ms: Math.round(median(timedRuns)),
    manual_safety_review: 'pending',
  };

  await writeFile(
    resultsPath,
    JSON.stringify({ summary, cases: results }, null, 2) + '\n',
    'utf8',
  );

  if (complete) {
    const percent = (value) => `${Math.round(value * 100)}%`;
    const markdown = [
      '# SupportFlow Baseline Results',
      '',
      `Run completed: ${summary.completed_at}`,
      `Model: ${model}`,
      '',
      '## Method',
      '',
      'Each non-empty ticket was sent through one generic support prompt. The baseline had no policy retrieval, safety rules, retries, output validator, or audit log.',
      '',
      '## Automated results',
      '',
      '| Metric | Result |',
      '| --- | ---: |',
      `| Cases completed | ${summary.cases_completed}/${summary.cases_total} |`,
      `| Valid JSON | ${percent(summary.valid_json_rate)} |`,
      `| Category accuracy | ${percent(summary.category_accuracy)} |`,
      `| Urgency accuracy | ${percent(summary.urgency_accuracy)} |`,
      `| Approval-decision accuracy | ${percent(summary.approval_accuracy)} |`,
      `| Automated pass rate | ${percent(summary.automated_pass_rate)} |`,
      `| Median processing time | ${(summary.median_processing_time_ms / 1000).toFixed(2)} s |`,
      '',
      '## Important limitation',
      '',
      'Safety, unsupported promises, and required-information checks still require a rubric-based review. No final quality claim should be made until that review is recorded.',
      '',
    ].join('\n');
    await writeFile(summaryPath, markdown, 'utf8');
  }
}

async function main() {
  await mkdir(resultDir, { recursive: true });
  const testCases = JSON.parse(await readFile(testCasesPath, 'utf8'));
  const results = [];

  for (const testCase of testCases) {
    const startedAt = new Date().toISOString();
    const started = performance.now();

    if (!testCase.message.trim()) {
      results.push({
        id: testCase.id,
        scenario: testCase.scenario,
        started_at: startedAt,
        status: 'completed',
        processing_time_ms: 0,
        expected: testCase.expected,
        output: null,
        raw_response: null,
        error: 'Message is required',
        checks: {
          structured_output_valid: false,
          category_match: false,
          urgency_match: false,
          approval_match: true,
          validation_error_match: true,
          automated_pass: false,
        },
        manual_review: 'pending',
      });
      console.log(`${testCase.id}: validation case recorded`);
      await save(results);
      continue;
    }

    try {
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: buildPrompt(testCase.message),
          stream: false,
          format: 'json',
          options: { temperature: 0, seed: 42, num_predict: 260 },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama returned HTTP ${response.status}`);
      }

      const payload = await response.json();
      const processingTime = Math.round(performance.now() - started);
      let output = null;
      let parseError = null;

      try {
        output = parseJson(payload.response);
      } catch (error) {
        parseError = error instanceof Error ? error.message : String(error);
      }

      const structuredOutputValid =
        output !== null &&
        typeof output.category === 'string' &&
        typeof output.urgency === 'string' &&
        typeof output.requires_human_approval === 'boolean' &&
        typeof output.draft_reply === 'string';
      const categoryMatch = output?.category === testCase.expected.category;
      const urgencyMatch = output?.urgency === testCase.expected.urgency;
      const approvalMatch =
        output?.requires_human_approval ===
        testCase.expected.requires_human_approval;

      results.push({
        id: testCase.id,
        scenario: testCase.scenario,
        started_at: startedAt,
        status: 'completed',
        processing_time_ms: processingTime,
        expected: testCase.expected,
        output,
        raw_response: payload.response,
        error: parseError,
        checks: {
          structured_output_valid: structuredOutputValid,
          category_match: categoryMatch,
          urgency_match: urgencyMatch,
          approval_match: approvalMatch,
          automated_pass:
            structuredOutputValid &&
            categoryMatch &&
            urgencyMatch &&
            approvalMatch,
        },
        manual_review: 'pending',
      });
      console.log(
        `${testCase.id}: ${processingTime}ms · ${structuredOutputValid ? 'valid' : 'invalid'} · ${categoryMatch && urgencyMatch && approvalMatch ? 'pass' : 'mismatch'}`,
      );
    } catch (error) {
      results.push({
        id: testCase.id,
        scenario: testCase.scenario,
        started_at: startedAt,
        status: 'failed',
        processing_time_ms: Math.round(performance.now() - started),
        expected: testCase.expected,
        output: null,
        raw_response: null,
        error: error instanceof Error ? error.message : String(error),
        checks: {
          structured_output_valid: false,
          category_match: false,
          urgency_match: false,
          approval_match: false,
          automated_pass: false,
        },
        manual_review: 'pending',
      });
      console.log(`${testCase.id}: failed`);
    }

    await save(results);
  }

  await save(results, true);
  console.log(`Baseline complete. Results saved to ${resultsPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
