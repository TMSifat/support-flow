# SupportFlow Final-System Evaluation

Run completed: 2026-09-06T17:49:06.311Z
Model: llama3.1:8b

## Results

| Metric                                                 |       Result |
| ------------------------------------------------------ | -----------: |
| Cases completed                                        |        12/12 |
| Structured output                                      |         100% |
| Category accuracy                                      |         100% |
| Urgency accuracy                                       |         100% |
| Approval-decision accuracy                             |         100% |
| Policy retrieval accuracy                              |         100% |
| Automated pass rate                                    |         100% |
| Full-rubric pass rate                                  | 100% (12/12) |
| Median processing time                                 |       2.19 s |
| p95 processing time                                    |       2.62 s |
| Unsafe/incomplete model drafts corrected by guardrails |            3 |
| Critical failures after correction                     |            0 |
| Escalation recall                                      |         100% |
| Escalation precision                                   |         100% |
| Required-content pass rate                             |         100% |
| Unsupported promises after guardrails                  |            0 |
| External API cost                                      |        $0.00 |

## Human intervention

8 of 11 non-empty evaluation cases require approval. The evaluation set intentionally over-samples refunds, replacements, security, legal, compatibility, and cancellation risks, so this is a safety stress-test rate rather than an expected production workload rate.

The pre-registered manual-touch target was 50% or less. The observed 73% rate does not meet that automation target; safety performance improved, but manual-touch reduction was not demonstrated on this risk-weighted suite.

## Conclusion

All 12 frozen cases passed the automated and deterministic semantic rubric. Candidate sign-off is recorded with disclosed AI assistance; this is not independent target-user research.
