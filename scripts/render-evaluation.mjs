import { readFile, writeFile } from 'node:fs/promises';
const baseline = JSON.parse(
  await readFile('Result/baseline-results.json', 'utf8'),
);
const final = JSON.parse(await readFile('Result/final-results.json', 'utf8'));
if (
  baseline.summary.evaluator_version !== '3' ||
  final.summary.evaluator_version !== '3'
)
  throw new Error('Run baseline and final using evaluator v3 first.');
const pct = (n) => (n === null ? 'Not measured' : `${Math.round(n * 100)}%`);
const seconds = (n) =>
  n === null ? 'Not measured' : `${(n / 1000).toFixed(2)} s`;
for (const [name, result] of [
  ['baseline', baseline],
  ['final', final],
]) {
  const s = result.summary;
  await writeFile(
    `Result/${name}-summary.md`,
    [
      `# ${name === 'baseline' ? 'Generic prompt baseline' : 'SupportFlow final'} — evaluator v3`,
      '',
      `Run: ${s.completed_at}. Results SHA-256: \`${s.result_sha256}\`.`,
      '',
      'These are automated regression measurements. Human review and independent usability are not certified by this script.',
      '',
      '| Metric | Result |',
      '| --- | ---: |',
      `| Common quality checks, non-empty tickets | ${s.common_passes}/${s.valid_ticket_count} (${pct(s.common_pass_rate)}) |`,
      `| Category / urgency / approval accuracy | ${pct(s.category_accuracy)} / ${pct(s.urgency_accuracy)} / ${pct(s.approval_accuracy)} |`,
      `| Required reply content | ${pct(s.required_content_pass_rate)} |`,
      `| Escalation recall / precision | ${pct(s.escalation_recall)} / ${pct(s.escalation_precision)} |`,
      `| Critical automated check failures | ${s.critical_check_failures} |`,
      `| Median / p95 request time | ${seconds(s.median_request_time_ms)} / ${seconds(s.p95_request_time_ms)} |`,
      `| Approval-required rate | ${pct(s.approval_required_rate)} |`,
      '| Actual manual-touch rate / human task time | Not measured |',
      '| External model API cost | $0; local hardware/electricity not measured |',
      '',
      name === 'final'
        ? `Release check: ${s.cases_passed}/${s.cases_total} cases passed, including input validation. ${s.cases_passed === s.cases_total ? 'Automated gate passed.' : 'Automated gate FAILED.'}`
        : 'Empty input is not a supported baseline capability and is excluded from valid-ticket quality.',
      '',
      'The 50% manual-touch target cannot be declared met: actual human touches are unmeasured. Approval-required rate is a separate indicator. No general safety guarantee or independent human sign-off is implied.',
      '',
    ].join('\n'),
  );
}
const b = baseline.summary,
  f = final.summary;
await writeFile(
  'Result/comparison.md',
  [
    '# Baseline versus final — common evaluator v3',
    '',
    'Both conditions use the same local model and the same eight-point common quality checks. Policy retrieval and richer final schema are reported as additional capabilities, not used to penalize baseline quality. Invalid input is scored separately. Failed non-empty requests remain in quality denominators.',
    '',
    '| Metric | Generic prompt | SupportFlow |',
    '| --- | ---: | ---: |',
    `| Common automated quality checks | ${b.common_passes}/${b.valid_ticket_count} | ${f.common_passes}/${f.valid_ticket_count} |`,
    `| Critical automated check failures | ${b.critical_check_failures} | ${f.critical_check_failures} |`,
    `| Median request time | ${seconds(b.median_request_time_ms)} | ${seconds(f.median_request_time_ms)} |`,
    `| Approval-required rate | ${pct(b.approval_required_rate)} | ${pct(f.approval_required_rate)} |`,
    '',
    'This is a synthetic regression comparison, not independent real-world effectiveness research. Final drafts are versioned policy templates; the model supplies validated classification/extraction proposals. Personalization and actual order/account decisions require the operator. Regex-based evaluation still needs human review and unseen examples. Actual handling-time savings, manual-touch reduction, field-extraction accuracy and adoption have not been measured.',
    '',
    'Historical v1/v2 outputs are retained under `Result/history/`. V3 enforces every declared must-not prohibition. Do not compare differently scored runs directly. See system-comparison.md for the policy-aware prompt and no-inference ablation.',
    '',
  ].join('\n'),
);
