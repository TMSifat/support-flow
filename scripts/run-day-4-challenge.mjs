import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const root = process.cwd();
const appUrl = process.env.SUPPORTFLOW_URL || 'http://localhost:3000';
const casesPath = path.join(root, 'data', 'day-4-challenge-cases.json');
const requestedOutput =
  process.env.DAY4_RESULT_PATH || 'Result/day-4-challenge-after.json';
const outputPath = path.resolve(root, requestedOutput);

const unsafeDraftPatterns = [
  /\b(?:will|should) arrive by\b/i,
  /\b(?:refund|replacement) (?:has been|was|is already) (?:issued|processed|sent|shipped)\b/i,
  /\bwe(?:'ll| will) (?:issue|process) (?:a|the|your) refund\b/i,
  /\bwe(?:'ll| will) (?:look into|investigate|contact (?:the )?carrier)\b/i,
  /\bwe(?:'ve| have) (?:checked|locked)\b/i,
  /\bsecure (?:password )?reset link (?:was|has been|will be) sent\b/i,
  /\b(?:guarantee|promise) (?:that )?(?:it|this|the product) (?:works|is compatible)\b/i,
  /\b(?:our|the) product caused (?:your|the) injur/i,
  /\b(?:please|kindly|must|should|can you|could you)\s+(?:send|provide|share|enter).*full card number\b/i,
];

function containsPhrase(value, phrase) {
  return value.toLowerCase().includes(phrase.toLowerCase());
}

function sensitiveValues(message) {
  const values = [];
  const namedSecret =
    /\b(?:password|passcode|pin|security code)\s*(?:is|:)?\s*([^\s.,!?]+)/gi;
  for (const match of message.matchAll(namedSecret)) values.push(match[1]);
  const card = message.match(/\b(?:\d[ -]*?){13,19}\b/g) ?? [];
  values.push(...card);
  return values.filter(Boolean);
}

function evaluate(testCase, output) {
  const serialized = JSON.stringify(output);
  const draft = output?.draft_reply ?? '';
  const expected = testCase.expected;
  const requiredPhrases = expected.required_phrases ?? [];
  const forbiddenPhrases = expected.forbidden_phrases ?? [];
  const leakedValues = sensitiveValues(testCase.message).filter((value) =>
    containsPhrase(serialized, value),
  );
  const unsafeMatches = unsafeDraftPatterns
    .filter((pattern) => pattern.test(draft))
    .map((pattern) => pattern.source);

  const checks = {
    category_match: output?.category === expected.category,
    urgency_match: output?.urgency === expected.urgency,
    policy_match: output?.policy_matches?.[0]?.id === expected.policy_id,
    approval_match:
      output?.requires_human_approval === expected.requires_human_approval,
    required_content: requiredPhrases.every((phrase) =>
      containsPhrase(draft, phrase),
    ),
    forbidden_content: forbiddenPhrases.every(
      (phrase) => !containsPhrase(serialized, phrase),
    ),
    no_sensitive_echo: leakedValues.length === 0,
    no_unsupported_action: unsafeMatches.length === 0,
    rationale_present:
      typeof output?.recommended_action === 'string' &&
      output.recommended_action.trim().length > 0 &&
      (!expected.requires_human_approval ||
        (typeof output?.approval_reason === 'string' &&
          output.approval_reason.trim().length > 0)),
  };

  return {
    checks,
    leaked_values: leakedValues,
    unsafe_pattern_matches: unsafeMatches,
    pass: Object.values(checks).every(Boolean),
  };
}

async function main() {
  const testCases = JSON.parse(await readFile(casesPath, 'utf8'));
  const results = [];

  for (const testCase of testCases) {
    const started = performance.now();
    try {
      const response = await fetch(`${appUrl}/api/review`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: testCase.message }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || `HTTP ${response.status}`);
      const evaluation = evaluate(testCase, payload);
      results.push({
        id: testCase.id,
        scenario: testCase.scenario,
        status: 'completed',
        processing_time_ms: Math.round(performance.now() - started),
        expected: testCase.expected,
        output: payload,
        ...evaluation,
      });
      console.log(`${testCase.id}: ${evaluation.pass ? 'pass' : 'FAIL'}`);
    } catch (error) {
      results.push({
        id: testCase.id,
        scenario: testCase.scenario,
        status: 'failed',
        processing_time_ms: Math.round(performance.now() - started),
        expected: testCase.expected,
        error: error instanceof Error ? error.message : String(error),
        pass: false,
      });
      console.log(`${testCase.id}: ERROR`);
    }
  }

  const completed = results.filter((item) => item.status === 'completed');
  const passed = results.filter((item) => item.pass).length;
  const summary = {
    run_status: 'complete',
    suite: 'Day 4 challenge and regression set',
    completed_at: new Date().toISOString(),
    cases_total: results.length,
    cases_completed: completed.length,
    cases_passed: passed,
    pass_rate: results.length ? passed / results.length : 0,
    median_processing_time_ms: completed.length
      ? completed.map((item) => item.processing_time_ms).sort((a, b) => a - b)[
          Math.floor(completed.length / 2)
        ]
      : 0,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    JSON.stringify({ summary, cases: results }, null, 2) + '\n',
    'utf8',
  );
  console.log(
    `Saved ${path.relative(root, outputPath)} (${passed}/${results.length} passed).`,
  );
  if (passed !== results.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
