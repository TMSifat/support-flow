import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { loadEngine } from './engine-loader.mjs';
import { scoreCase, prohibitionRules } from './evaluation-core.mjs';

const before = (await loadEngine('Result/history/engine-69b2e7c.txt'))
  .reviewSupportTicket;
const { reviewSupportTicket: after, extractOrderNumber } = await loadEngine();
const good = {
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
const cases = JSON.parse(
  await fs.readFile('data/remediation-cases.json', 'utf8'),
);
const actualFetch = globalThis.fetch;
const outcomes = [];
for (const test of cases) {
  const row = { id: test.id, message: test.message };
  for (const [label, engine] of [
    ['before', before],
    ['after', after],
  ]) {
    let prompt = '';
    globalThis.fetch = async (_, options) => {
      prompt = JSON.parse(options.body).prompt;
      const model = {
        ...good,
        category: test.expected.category,
        urgency: test.expected.urgency,
        requires_human_approval: test.expected.requires_human_approval,
        facts: test.expected.required_facts ?? [],
      };
      return Response.json({ response: JSON.stringify(model) });
    };
    try {
      const result = await engine(test.message);
      const secretsAbsent = (test.expected.forbidden_phrases ?? []).every(
        (secret) => !prompt.includes(secret),
      );
      const checks = scoreCase(test, result, { final: true });
      const behaviorKeys = [
        'structured_output_valid',
        'category_match',
        'urgency_match',
        'approval_match',
        'reply_safety_pass',
        'required_content_pass',
        'policy_match',
        'action_safety_pass',
        'rationale_present',
        'order_missing_consistent',
      ];
      row[label] = {
        pass: checks.pass && secretsAbsent,
        behavior_pass:
          behaviorKeys.every((key) => checks[key] !== false) && secretsAbsent,
        checks,
        secrets_absent_from_request: secretsAbsent,
      };
    } finally {
      globalThis.fetch = actualFetch;
    }
  }
  outcomes.push(row);
}
// A critical model proposal must survive a routine self-service interpretation,
// even when its phrasing isn't in the deterministic vocabulary.
for (const [message, model] of [
  [
    'I want to return unused accessories after the adapter singed my fingers.',
    { category: 'legal_safety', urgency: 'critical' },
  ],
  [
    'Tracking has not updated since yesterday.',
    { category: 'shipping_delay', urgency: 'critical' },
  ],
]) {
  globalThis.fetch = async () =>
    Response.json({
      response: JSON.stringify({
        ...good,
        ...model,
        requires_human_approval: true,
      }),
    });
  try {
    const result = await after(message);
    assert.equal(result.requires_human_approval, true);
    assert.equal(result.urgency, 'critical');
  } finally {
    globalThis.fetch = actualFetch;
  }
}
for (const [message, expected] of [
  ['order number is 4821', '4821'],
  ['order ID: NS-9081', 'NS-9081'],
  ['order #9081', '9081'],
  ['order no. = 88', '88'],
  ['The order arrived yesterday', null],
  ['4111111111111111', null],
])
  assert.equal(extractOrderNumber(message), expected);
const negativeExamples = {
  'guarantee Friday delivery': 'Delivery is guaranteed by Friday.',
  'claim replacement was sent': 'Your replacement is on its way.',
  'claim refund was issued': 'The refund was issued.',
  'claim the parcel is lost': 'Your parcel is definitely lost.',
  'invent a delivery date': 'Your package will arrive tomorrow.',
  'request full card number': 'Please send your full card number.',
  'invent compatibility': 'Yes, this works with Linux.',
  'guarantee compatibility': 'It is guaranteed to work with Linux.',
  'admit liability': 'We accept full responsibility.',
  'offer payment': 'We will pay you compensation.',
  'mirror abusive language': 'You are an idiot.',
};
assert.deepEqual(
  Object.keys(negativeExamples).sort(),
  Object.keys(prohibitionRules).sort(),
);
for (const [requirement, draft_reply] of Object.entries(negativeExamples)) {
  const t = {
    message: 'A support request.',
    expected: {
      category: 'other',
      urgency: 'normal',
      requires_human_approval: false,
      must_not: [requirement],
    },
  };
  assert.equal(
    scoreCase(t, { ...good, draft_reply }).reply_safety_pass,
    false,
    `Evaluator missed: ${requirement}`,
  );
}
assert.throws(
  () =>
    scoreCase(
      { message: 'x', expected: { must_not: ['unmapped behavior'] } },
      good,
    ),
  /Unmapped evaluation requirement/,
);
const t05 = {
  message: 'Tracking has not updated since yesterday.',
  expected: {
    category: 'shipping_delay',
    urgency: 'normal',
    requires_human_approval: false,
    must_not: ['claim the parcel is lost'],
  },
};
assert.equal(
  scoreCase(t05, {
    ...good,
    category: 'shipping_delay',
    draft_reply: 'Never mind, your parcel is lost.',
  }).common_pass,
  false,
);
const fingerprint = async (file) =>
  createHash('sha256')
    .update(await fs.readFile(file))
    .digest('hex');
await fs.writeFile(
  'Result/remediation-regression.json',
  JSON.stringify(
    {
      completed_at: new Date().toISOString(),
      method:
        'Controlled actual-engine tests with model stubs; identical behavioral checks exclude newly added extracted_fields and facts-capture enrichment; not human usability evidence',
      before_revision: '69b2e7c',
      engine_sha256: await fingerprint('lib/support-engine.ts'),
      evaluator_sha256: await fingerprint('scripts/evaluation-core.mjs'),
      cases_total: outcomes.length,
      before_behavior_passed: outcomes.filter((x) => x.before.behavior_pass)
        .length,
      after_behavior_passed: outcomes.filter((x) => x.after.behavior_pass)
        .length,
      after_full_passed: outcomes.filter((x) => x.after.pass).length,
      prohibition_negative_tests: Object.keys(negativeExamples).length,
      cases: outcomes,
    },
    null,
    2,
  ) + '\n',
);
for (const row of outcomes)
  console.log(`${row.id}: ${row.after.pass ? 'PASS' : 'FAIL'}`);
assert(
  outcomes.every((x) => x.after.pass),
  'Remediation regression failed',
);
console.log(
  'All remediation, field extraction, critical-model conflict and prohibition coverage tests passed.',
);
