import fs from 'node:fs/promises';
const result = JSON.parse(
  await fs.readFile('Result/final-results.json', 'utf8'),
);
const cases = JSON.parse(await fs.readFile('data/test-cases.json', 'utf8'));
const ids = ['T02', 'T04', 'T08', 'T06', 'T11'];
const template = {
  status: 'pending_real_participant',
  result_sha256: result.summary.result_sha256,
  engine_sha256: result.summary.engine_sha256,
  operator: {
    identifier: null,
    date: null,
    machine: null,
    not_the_builder: null,
  },
  setup: { completed_without_coaching: null, minutes: null, problem: null },
  trials: ids.flatMap((id) =>
    ['previous_method', 'supportflow'].map((method) => ({
      case_id: id,
      method,
      seconds: null,
      completed_without_help: null,
      substantive_edits: null,
      approval_boundary_correct: null,
      unsafe_output: null,
      feedback: null,
    })),
  ),
  overall_feedback: null,
  change_requested: null,
  change_made: null,
};
try {
  await fs.access('Result/human-observations.json');
} catch {
  await fs.writeFile(
    'Result/human-observations.json',
    JSON.stringify(template, null, 2) + '\n',
  );
}
const paragraphs = [
  '# Human handoff test — ready to run, not yet performed',
  '',
  'No independent operator is currently available (candidate confirmed 7 September 2026). This kit enables the remaining evidence; it does not claim the session happened.',
  '',
  `Version to test: engine SHA-256 \`${result.summary.engine_sha256}\`; result SHA-256 \`${result.summary.result_sha256}\`.`,
  '',
  '## Instructions for the participant',
  '',
  'Use the root README to start SupportFlow. Do not ask the builder to explain the interface. Record setup time and anything unclear. Only synthetic messages are used. Never send a reply or perform a real refund, order or account action.',
  '',
  'For each ticket below, compare your usual policy-assisted drafting method with SupportFlow. Start timing when you begin reading and stop when you have a reviewed, edited, ready-to-copy draft. Include policy lookup, edits and approval decisions. Alternate which method you use first; repeated tickets have a learning effect, so disclose it. This five-ticket exercise is a small pilot, not a rigorous field study.',
  '',
  'Read the matching policies in data/knowledge-base.json for the previous method. In SupportFlow, read the matched policy, check provided details and remaining verification, edit the draft if needed, approve consequential replies and copy. Edit an approved consequential draft once and verify that approval resets.',
  '',
    'Fill Result/human-observations.json with observed seconds, edits, task completion, approval understanding, unsafe outputs and your actual feedback. Leave unknowns null. At least one concrete confusing point or “none observed” should be recorded. Run `npm run handoff:summarize` after collecting the data; a blank file stays pending.',
  '',
  ...ids.flatMap((id) => [
    `## ${id}`,
    '',
    cases.find((c) => c.id === id).message,
    '',
  ]),
  '## Observer-only acceptance checks',
  '',
  'T02: normal return instructions, 30 days/proof of purchase, no extra approval. T04: shipping delay, verify carrier status and approve. T08: critical account concern, password absent from the result, approve. T06: order number and fulfillment verification, approve. T11: calm complaint response, no extra approval. No case performs external actions.',
  '',
  'Record a real change requested/made after feedback. A participant repeating coached clicks is not unassisted operation. More operators, new tickets and counterbalanced order are needed before claiming general savings.',
  '',
];
await fs.writeFile('Result/human-test-kit.md', paragraphs.join('\n'));
const signoff = {
  status: 'pending_candidate_review',
  result_sha256: result.summary.result_sha256,
  engine_sha256: result.summary.engine_sha256,
  reviewer: null,
  date: null,
  watched_current_demo: null,
  reviewed_raw_results: null,
  can_explain_architecture_and_tradeoffs: null,
  corrections_or_rejections: null,
};
try {
  await fs.access('Result/current-candidate-review.json');
} catch {
  await fs.writeFile(
    'Result/current-candidate-review.json',
    JSON.stringify(signoff, null, 2) + '\n',
  );
}
console.log(
  'Human test kit prepared. Existing observation/sign-off records were not overwritten.',
);
