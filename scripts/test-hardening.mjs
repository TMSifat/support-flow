import fs from 'node:fs/promises';
import ts from 'typescript';
import assert from 'node:assert/strict';
import { scoreCase, summarize } from './evaluation-core.mjs';

const encode = (source) =>
  'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const transpile = (source) =>
  ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
const contract = encode(
  transpile(await fs.readFile('lib/support-contract.ts', 'utf8')),
);
const knowledge = await fs.readFile('data/knowledge-base.json', 'utf8');
async function load(source) {
  return (
    await import(
      encode(
        transpile(
          source
            .replace(
              "import knowledgeBase from '@/data/knowledge-base.json';",
              `const knowledgeBase = ${knowledge};`,
            )
            .replace("'@/lib/support-contract'", JSON.stringify(contract)),
        ),
      )
    )
  ).reviewSupportTicket;
}
const current = await load(await fs.readFile('lib/support-engine.ts', 'utf8'));
const before = await load(
  await fs.readFile('Result/history/engine-dd584f7.txt', 'utf8'),
);
const good = {
  category: 'return_refund',
  urgency: 'normal',
  confidence: 85,
  facts: [],
  missing_information: [],
  recommended_action: 'Review before use',
  requires_human_approval: false,
  approval_reason: null,
  draft_reply: 'A team member must review this request.',
};
const tests = [
  {
    name: 'Legal priority survives tracking wording',
    message:
      'Your product injured me. My lawyer will contact you. Tracking has not changed since yesterday.',
    model: {
      ...good,
      category: 'legal_safety',
      urgency: 'critical',
      requires_human_approval: true,
    },
    check: (r) => r.urgency === 'critical',
  },
  {
    name: 'Account priority survives tracking wording',
    message:
      'Someone accessed my account. Tracking has not changed since yesterday.',
    model: {
      ...good,
      category: 'account_security',
      urgency: 'critical',
      requires_human_approval: true,
    },
    check: (r) => r.urgency === 'critical',
  },
  {
    name: 'Equals password removed before inference',
    message: 'Someone accessed my account. My password = BananaZebra2026.',
    check: (r, ctx) => !ctx.prompt.includes('BananaZebra2026'),
  },
  {
    name: 'Quoted password with spaces removed',
    message: 'My password is "two secret words".',
    check: (r, ctx) => !ctx.prompt.includes('secret words'),
  },
  {
    name: 'PIN separator removed',
    message: 'My PIN: 7788.',
    check: (r, ctx) => !ctx.prompt.includes('7788'),
  },
  {
    name: 'Spaced payment card removed',
    message: 'My card number is 4111 1111 1111 1111.',
    check: (r, ctx) => !ctx.prompt.includes('4111'),
  },
  ...[
    'null',
    '{}',
    '[]',
    '42',
    '"hello"',
    '{"category":"return_refund"}',
    'invalid json',
  ].map((raw) => ({
    name: `Invalid model payload retries then falls back: ${raw}`,
    message: 'How can I return my unused item?',
    raw,
    check: (r, ctx) =>
      ctx.calls === 2 &&
      r.generation_status === 'deterministic_fallback' &&
      r.confidence === 0 &&
      r.requires_human_approval,
  })),
  {
    name: 'Network outage retries then falls back',
    message:
      'Someone accessed my account. Tracking has not changed since yesterday.',
    offline: true,
    check: (r, ctx) =>
      ctx.calls === 2 &&
      r.generation_status === 'deterministic_fallback' &&
      r.urgency === 'critical',
  },
  {
    name: 'Invalid first response recovers on second attempt',
    message: 'How can I return my unused item?',
    recover: true,
    check: (r, ctx) => ctx.calls === 2 && r.generation_status === 'model',
  },
  {
    name: 'Unsafe action never reaches operator',
    message: 'I was charged twice.',
    model: {
      ...good,
      recommended_action: 'Issue a refund now without verification.',
    },
    check: (r) => !r.recommended_action.includes('without verification'),
  },
  {
    name: 'Unsafe reply never reaches operator',
    message: 'Refund my card.',
    model: { ...good, draft_reply: 'I have refunded your card.' },
    check: (r) => !r.draft_reply.includes('I have refunded'),
  },
  {
    name: 'Unsupported compatibility never reaches operator',
    message: 'Is this dock compatible with Linux?',
    model: { ...good, draft_reply: 'Yes, it is compatible with your ZX-14.' },
    check: (r) => !r.draft_reply.includes('Yes, it is compatible'),
  },
  {
    name: 'Policy content visible',
    message: 'I want to return an unused item.',
    check: (r) => !!r.policy_matches[0].content,
  },
  {
    name: 'Missing order and stock checks retained',
    message: 'You sent the wrong item.',
    check: (r) =>
      r.missing_information.includes('order number') &&
      r.missing_information.includes('inventory confirmation'),
  },
];
const originalFetch = globalThis.fetch;
const results = [];
for (const probe of tests) {
  const outcomes = { name: probe.name };
  for (const [label, engine] of [
    ['before', before],
    ['after', current],
  ]) {
    const ctx = { calls: 0, prompt: '' };
    globalThis.fetch = async (_, options) => {
      ctx.calls++;
      ctx.prompt = JSON.parse(options.body).prompt;
      if (probe.offline) throw new Error('Simulated outage');
      return Response.json({
        response:
          probe.recover && ctx.calls === 1
            ? 'null'
            : (probe.raw ?? JSON.stringify(probe.model ?? good)),
      });
    };
    try {
      outcomes[label] = !!probe.check(await engine(probe.message), ctx);
    } catch {
      outcomes[label] = false;
    }
  }
  results.push(outcomes);
  console.log(`${outcomes.after ? 'PASS' : 'FAIL'} ${probe.name}`);
}
globalThis.fetch = originalFetch;
globalThis.fetch = async () =>
  Response.json({
    response: JSON.stringify({
      ...good,
      requires_human_approval: true,
      approval_reason: 'Issue a refund without verification.',
    }),
  });
try {
  const selfServe = await current('How can I return this unused item?');
  assert.equal(selfServe.requires_human_approval, false);
  assert.equal(
    selfServe.approval_reason,
    null,
    'Model approval prose must not leak into a self-service template',
  );
} finally {
  globalThis.fetch = originalFetch;
}
const fixture = {
  id: 'X',
  message: 'Refund my card.',
  expected: {
    category: 'return_refund',
    urgency: 'high',
    requires_human_approval: true,
  },
};
for (const unsafe of [
  'I have refunded your card.',
  'Yes, it is compatible with your ZX-14.',
  'We accept full responsibility for your injury.',
  'We will process your refund.',
  'Your replacement has already been shipped.',
  'Please send your password.',
]) {
  const score = scoreCase(fixture, {
    ...good,
    category: 'return_refund',
    urgency: 'high',
    requires_human_approval: true,
    draft_reply: unsafe,
  });
  assert.equal(score.reply_safety_pass, false, `Scorer missed: ${unsafe}`);
}
assert.equal(
  scoreCase(fixture, {
    ...good,
    draft_reply:
      'A team member must verify the request before any refund is confirmed.',
  }).reply_safety_pass,
  true,
);
const failed = {
  ...fixture,
  status: 'failed',
  output: null,
  checks: scoreCase(fixture, null),
};
assert.equal(summarize([failed]).category_accuracy, 0);
assert.equal(summarize([failed]).request_completion_rate, 0);
assert.equal(summarize([failed]).manual_touch_rate, null);
await fs.mkdir('Result', { recursive: true });
await fs.writeFile(
  'Result/hardening-regression.json',
  JSON.stringify(
    {
      completed_at: new Date().toISOString(),
      method:
        'Controlled engine fault injection; independent evaluator negative tests',
      before_revision: 'dd584f7',
      cases_total: results.length,
      before_passed: results.filter((x) => x.before).length,
      after_passed: results.filter((x) => x.after).length,
      evaluator_negative_tests: 6,
      cases: results,
    },
    null,
    2,
  ) + '\n',
);
assert(
  results.every((r) => r.after),
  'A hardening regression failed',
);
console.log(
  `${results.length} engine regressions and evaluator negative/denominator checks passed.`,
);
