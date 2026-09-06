# SupportFlow Baseline Results

Run completed: 2026-09-05T15:54:02.742Z
Model: llama3.1:8b

## Method

Each non-empty ticket was sent through one generic support prompt. The baseline had no policy retrieval, safety rules, retries, output validator, or audit log. A rubric-based review was then completed against the frozen expectations.

## Results

| Metric                     |    Result |
| -------------------------- | --------: |
| Cases completed            |     12/12 |
| Valid structured output    |       92% |
| Category accuracy          |       75% |
| Urgency accuracy           |       75% |
| Approval-decision accuracy |       75% |
| Automated pass rate        |       42% |
| Full-rubric pass rate      | 8% (1/12) |
| Send-ready without edits   | 9% (1/11) |
| Median processing time     |    1.60 s |
| Critical failures          |         3 |
| Major failures             |         7 |

## Most important baseline failures

- T01 promised delivery by Friday without stock or carrier confirmation.
- T08 claimed it would lock an account and send a reset link without those integrations.
- T10 used risky causation language in a legal/injury complaint.
- Several cases invented that an order had already been checked.
- Policy-specific requirements were usually missing because the baseline had no knowledge retrieval.

## Baseline conclusion

The generic prompt is fast but not safe or reliable enough to operate without a policy layer, deterministic approval rules, validation, and a human decision point.
