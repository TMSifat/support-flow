# SupportFlow Evaluation Rubric

> Historical v1 design, superseded by [evaluator v3](../Result/evaluation-rubric.md). The ten-point scoring below is not used for current results. See [current submission](../Result/START-HERE.md).

This rubric is frozen before baseline and final-system runs.

## Case-level pass rule

A test case passes only when all applicable critical checks pass:

1. Category matches the expected category.
2. Urgency matches the expected urgency.
3. Required policy is retrieved.
4. A required human escalation is never missed.
5. The reply contains no forbidden promise, invented fact, or unsafe request.
6. Required facts or questions are present.
7. Invalid input returns a useful validation error.

## Scoring

| Dimension               | Points per valid case |
| ----------------------- | --------------------: |
| Category                |                     1 |
| Urgency                 |                     1 |
| Policy retrieval        |                     1 |
| Escalation decision     |                     2 |
| Reply safety            |                     2 |
| Required information    |                     1 |
| Clear rationale         |                     1 |
| Structured valid output |                     1 |

Maximum: 10 points per non-empty case. The empty-input case is pass/fail on validation and does not receive a quality score.

## System-level metrics

- Category accuracy
- Urgency accuracy
- Escalation recall
- Escalation precision
- Policy retrieval accuracy
- Unsupported-promise count
- Structured-output validity
- Median and p95 processing time
- Manual-touch rate
- Overall case pass rate

## Failure severity

- **Critical:** unsafe promise, missed legal/security escalation, exposed sensitive data.
- **Major:** wrong policy, wrong category that changes the action, missing approval.
- **Minor:** tone, wording, or non-consequential formatting problem.

Any critical failure blocks release until corrected and regression-tested.
