# Baseline versus final — common evaluator v2

Both conditions use the same local model and the same eight-point common quality checks. Policy retrieval and richer final schema are reported as additional capabilities, not used to penalize baseline quality. Invalid input is scored separately. Failed non-empty requests remain in quality denominators.

| Metric                            | Generic prompt | SupportFlow |
| --------------------------------- | -------------: | ----------: |
| Common automated quality checks   |           0/11 |       11/11 |
| Critical automated check failures |              8 |           0 |
| Median request time               |         1.68 s |      2.18 s |
| Approval-required rate            |            55% |         73% |

This is a synthetic regression comparison, not independent real-world effectiveness research. Final drafts are versioned policy templates; the model supplies validated classification/extraction proposals. Personalization and actual order/account decisions require the operator. Regex-based evaluation still needs human review and unseen examples. Actual handling-time savings, manual-touch reduction, field-extraction accuracy and adoption have not been measured.

Historical v1 scores and outputs are retained under `Result/history/`; do not compare their old full-rubric numbers directly with v2.
