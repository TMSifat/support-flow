import fs from 'node:fs/promises';
const read = async (name) =>
  JSON.parse(await fs.readFile(`Result/${name}.json`, 'utf8'));
const names = [
  'final-results',
  'day-4-challenge-after',
  'hardening-results',
  'remediation-results',
];
const suites = await Promise.all(names.map(read));
const baseline = await read('baseline-results'),
  policy = await read('policy-baseline-results'),
  ablation = await read('ablation-results');
const final = suites[0];
if (
  [baseline, policy, ...suites].some(
    (s) => s.summary.evaluator_version !== '3',
  ) ||
  suites.some((s) => s.summary.engine_sha256 !== final.summary.engine_sha256)
)
  throw new Error('Comparison requires current, same-engine v3 results.');
const records = [
  ['Generic prompt', baseline.summary],
  ['Policy-aware prompt', policy.summary],
  ['SupportFlow', final.summary],
];
const lines = [
  '# What the system improves — evaluator v3',
  '',
  '## Same original inputs and common scorer',
  '',
  'The three live conditions use the same model, seed, temperature, token limit and 11 non-empty messages. The policy-aware baseline also receives the supplied knowledge base and operating boundary. Blank validation is separate. The scorer applies the same eight-point common checks; enriched fields do not lower either prompt baseline score.',
  '',
  '| Condition | Common passes | Category accuracy | Critical check failures | Median HTTP time |',
  '|---|---:|---:|---:|---:|',
  ...records.map(
    ([name, s]) =>
      `| ${name} | ${s.common_passes}/${s.valid_ticket_count} | ${Math.round(s.category_accuracy * 100)}% | ${s.critical_check_failures} | ${(s.median_request_time_ms / 1000).toFixed(2)} s |`,
  ),
  '',
  '## Final system versus no-inference ablation',
  '',
  'A constant neutral model response is fed to the actual rule/template engine. This isolates reliance on model proposals; it is not an optimized independent rules implementation. In-process timing is excluded from the HTTP comparison.',
  '',
  '| Suite | Model-backed common passes | No-inference common passes | Final release checks |',
  '|---|---:|---:|---:|',
  ...suites.map((s, i) => {
    const a = ablation.suites[i];
    return `| ${a.suite} | ${s.summary.common_passes}/${s.summary.valid_ticket_count} | ${a.summary.common_passes}/${a.summary.valid_ticket_count} | ${s.summary.cases_passed}/${s.summary.cases_total} |`;
  }),
  '',
  `Narrow extraction on the 18 remediation cases: order_number accuracy ${Math.round(suites[3].summary.order_number_accuracy * 100)}%; required identifier facts on two cases ${Math.round(suites[3].summary.facts_capture_rate * 100)}%. Both the parsed order field and facts must agree with supplied text. This does not measure every useful fact.`,
  '',
  'The original suite can be handled by rules and templates alone. The added semantic paraphrases test model contribution; they were used during development and are not unseen generalization evidence. Templates remain the final drafting method, with operator personalization and consequential judgment.',
  '',
  'Human task time, actual edits/touches, installation by another person and adoption are unmeasured. The supplied handoff kit measures these when a real participant is available. No real-world time-saving percentage is claimed.',
  '',
  '## Reproduction and provenance',
  '',
  'Run npm run evaluate:all with SupportFlow and Ollama running. Failed final suites stop the command. Prior raw runs are retained. Each raw file includes source/evaluator/suite/knowledge/runner hashes and the result hash. The two earlier incomplete remediation runs are retained as failure evidence.',
  '',
  ...[baseline, policy, ...suites].map(
    (r) => `- ${r.summary.system}: result SHA-256 ${r.summary.result_sha256}`,
  ),
  '',
];
await fs.writeFile('Result/system-comparison.md', lines.join('\n'));
console.log('System comparison written.');
