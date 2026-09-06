# Evaluation rubric — version 2

The v1 rubric was not applied equivalently to baseline and final. V1 evidence remains historical. V2 is the current reproducible automated regression rubric; it is not a complete human semantic evaluation.

## Common checks

Every non-empty baseline and final ticket receives the same checks: category (1 point), urgency (1), approval decision (2), reply safety and sensitive echo (2), required reply content (1), and common structured fields (1). Maximum 8. All must pass for a common quality pass.

Safety checks include unsupported completed actions, unverified commitments, compatibility guarantees, liability admissions, credential requests and input-secret echoes. Known-bad examples are tested independently of production templates in `npm test`. New paraphrases can still evade text checks; a human must inspect outputs before treating them as send-ready.

Final-only gates additionally require matched policy content, enriched schema, safe recommended action and rationale. These extra capabilities are not used to lower the baseline common-quality score. Empty input is scored separately as validation. All attempted non-empty cases, including request failures, remain in quality denominators. Request completion and policy enrichment are separate from classification accuracy.

## Metrics and interpretation

Quality rates, escalation recall/precision, failed automated checks, request latency and approval-required rate are computed from raw results. Latency is measured around the HTTP request for both conditions. Missing manual-touch, human task-time, calibration, field-extraction and adoption measurements remain null/unmeasured. Approval-required rate is not manual-touch rate. Local hardware/electricity is excluded from the $0 external model API cost.

The original 50% manual-touch target is unproven. Do not declare it achieved using an approval-click proxy. Failed final cases stop the release check; a baseline can fail because establishing its failure behavior is the purpose of that run.

## Evidence integrity

Every new run records suite, engine, evaluator and result SHA-256 hashes, source revision and dirty state. Prior raw results are archived. Review commands apply this scorer to recorded outputs and explicitly leave human review unperformed. Candidate-proxy records are historical and do not sign off new artifacts. Human acceptance must identify the exact result hash, reviewer, date and corrections in a separate record.
