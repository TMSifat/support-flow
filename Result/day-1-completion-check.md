# Day 1 Completion Check

> Historical sprint record (evaluator v1). Its completion labels, metrics and original design describe the earlier implementation, not current verification. Use [current remediation status](remediation-status.md), [architecture](architecture.md), [evaluation v2](evaluation-rubric.md), [comparison](comparison.md), and [submission checklist](submission-checklist.md). Historical proxy sign-off does not approve new runs.

Status: complete
Audit date: 2026-09-05

| Required Day 1 output                                                     | Evidence                                                 | Status   |
| ------------------------------------------------------------------------- | -------------------------------------------------------- | -------- |
| Target user and job-to-be-done                                            | day-1-foundation.md, section 1                           | Complete |
| Workflow map: trigger, input, judgment, tool, approval, output, exception | day-1-foundation.md, section 3                           | Complete |
| Evidence of pain                                                          | day-1-foundation.md, section 4 and baseline-results.json | Complete |
| Baseline time and quality                                                 | baseline-results.json and baseline-summary.md            | Complete |
| Success metrics and explicit non-goals                                    | day-1-foundation.md, sections 6 and 8                    | Complete |
| 8–12 representative, edge, and failure cases                              | 12 cases in data/test-cases.json                         | Complete |
| v1 scope for Day 5                                                        | day-1-foundation.md, section 7                           | Complete |

## Baseline integrity

- The evaluation rubric was frozen before the final-system comparison.
- All 12 cases completed.
- Raw model responses and per-case timing are retained.
- Manual safety review is complete.
- Synthetic-data and proxy-user assumptions are explicit.
- No real-user observation or production-volume claim is presented as measured fact.

## Day 1 key question

**Is the problem real, recurring, and measurable against a baseline?**

Yes, with one qualification: the workflow is a realistic recurring e-commerce support pattern evaluated through a disclosed proxy user and synthetic data rather than a real production team. The pain is measurable against the completed generic-prompt baseline through accuracy, full-rubric pass rate, send-readiness, severity of failures, and processing time.

## Locked Day 1 numbers

- Cases: 12
- Full-rubric baseline pass rate: 8% (1/12)
- Send-ready baseline drafts: 9% (1/11 non-empty cases)
- Category accuracy: 75%
- Urgency accuracy: 75%
- Approval-decision accuracy: 75%
- Median processing time: 1.60 seconds
- Critical failures: 3
- Major failures: 7

These numbers must not be changed unless the baseline is intentionally rerun and the new run is fully disclosed.
