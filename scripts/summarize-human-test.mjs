import fs from 'node:fs/promises';
const data = JSON.parse(
  await fs.readFile('Result/human-observations.json', 'utf8'),
);
const final = JSON.parse(
  await fs.readFile('Result/final-results.json', 'utf8'),
);
const valid =
  data.operator?.identifier &&
  data.operator?.date &&
  data.operator?.machine &&
  data.operator.not_the_builder === true &&
  typeof data.setup?.completed_without_coaching === 'boolean' &&
  Number.isFinite(data.setup?.minutes) &&
  data.setup.minutes >= 0 &&
  data.result_sha256 === final.summary.result_sha256 &&
  data.engine_sha256 === final.summary.engine_sha256;
const completeTrial = (t) =>
  Number.isFinite(t.seconds) &&
  t.seconds >= 0 &&
  Number.isInteger(t.substantive_edits) &&
  t.substantive_edits >= 0 &&
  [
    'completed_without_help',
    'approval_boundary_correct',
    'unsafe_output',
  ].every((k) => typeof t[k] === 'boolean') &&
  typeof t.feedback === 'string' &&
  t.feedback.trim();
const ids = ['T02', 'T04', 'T08', 'T06', 'T11'];
const trialSet =
  Array.isArray(data.trials) &&
  data.trials.length === 10 &&
  ids.every((id) =>
    ['previous_method', 'supportflow'].every(
      (method) =>
        data.trials.filter((t) => t.case_id === id && t.method === method)
          .length === 1,
    ),
  );
if (
  !valid ||
  !trialSet ||
  !data.trials.every(completeTrial) ||
  !data.overall_feedback
) {
  await fs.writeFile(
    'Result/human-test-summary.md',
    '# Human outcome evidence — pending\n\nNo complete, version-matched independent human session has been recorded. Time savings, manual touches, unassisted adoption and independent acceptance remain unmeasured. Use human-test-kit.md; do not fill missing observations with estimates or automated browser timings.\n',
  );
  console.log(
    'Pending: collect a complete real session on the current version.',
  );
  process.exit(0);
}
const median = (xs) => {
  const a = [...xs].sort((a, b) => a - b);
  return (a[Math.floor((a.length - 1) / 2)] + a[Math.floor(a.length / 2)]) / 2;
};
const rows = ['previous_method', 'supportflow'].map((method) => {
  const trials = data.trials.filter((t) => t.method === method);
  return {
    method,
    n: trials.length,
    median_seconds: median(trials.map((t) => t.seconds)),
    unassisted: trials.filter((t) => t.completed_without_help).length,
    edits: trials.reduce((s, t) => s + t.substantive_edits, 0),
    approval_correct: trials.filter((t) => t.approval_boundary_correct).length,
    unsafe: trials.filter((t) => t.unsafe_output).length,
  };
});
const safe =
  rows[1].unassisted === 5 &&
  rows[1].approval_correct === 5 &&
  rows[1].unsafe === 0 &&
  data.setup.completed_without_coaching;
await fs.writeFile(
  'Result/human-test-summary.md',
  [
    '# Recorded human pilot',
    '',
    `Participant: ${data.operator.identifier}. Date: ${data.operator.date}. Result SHA-256: ${data.result_sha256}.`,
    '',
    '| Method | Cases | Median human seconds | Unassisted completion | Edits | Correct approval boundary | Unsafe outputs |',
    '|---|---:|---:|---:|---:|---:|---:|',
    ...rows.map(
      (r) =>
        `| ${r.method} | ${r.n} | ${r.median_seconds} | ${r.unassisted}/${r.n} | ${r.edits} | ${r.approval_correct}/${r.n} | ${r.unsafe} |`,
    ),
    '',
    `Pilot acceptance: ${safe ? 'observed targets met' : 'targets NOT met'}. This summarizes supplied human observations; the script does not independently certify their authenticity.`,
    '',
    `Feedback: ${data.overall_feedback}`,
    `Requested change: ${data.change_requested ?? 'Not recorded'}`,
    `Change made: ${data.change_made ?? 'Not recorded'}`,
    '',
    'One operator and five repeated tickets do not establish general real-world savings. Report learning effects and obtain additional independent observations.',
    '',
  ].join('\n'),
);
console.log(
  'Version-matched human observations summarized; no automatic candidate sign-off created.',
);
