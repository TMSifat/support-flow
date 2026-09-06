# SupportFlow Final-System Evaluation

Run completed: 2026-09-06T17:10:36.363Z
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
| Median processing time                                 |       2.38 s |
| p95 processing time                                    |       2.73 s |
| Unsafe/incomplete model drafts corrected by guardrails |            4 |
| Critical failures after correction                     |            0 |

## Human intervention

8 of 11 non-empty evaluation cases require approval. The evaluation set intentionally over-samples refunds, replacements, security, legal, compatibility, and cancellation risks, so this is a safety stress-test rate rather than an expected production workload rate.

## Conclusion

All 12 frozen cases passed the automated and deterministic semantic rubric. Candidate sign-off is recorded with disclosed AI assistance; this is not independent target-user research.
