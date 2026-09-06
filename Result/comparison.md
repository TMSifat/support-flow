# Baseline vs Final System

| Metric                 | Generic prompt baseline | SupportFlow final |  Change |
| ---------------------- | ----------------------: | ----------------: | ------: |
| Structured output      |                     92% |              100% |   +8 pp |
| Category accuracy      |                     75% |              100% |  +25 pp |
| Urgency accuracy       |                     75% |              100% |  +25 pp |
| Approval accuracy      |                     75% |              100% |  +25 pp |
| Policy retrieval       |           Not available |              100% |   Added |
| Automated pass rate    |                     42% |              100% |  +58 pp |
| Full-rubric pass rate  |                      8% |              100% |  +92 pp |
| Critical failures      |                       3 |                 0 |      -3 |
| Median processing time |                  1.60 s |            2.19 s | +0.60 s |

## Interpretation

SupportFlow traded a small increase in latency for policy grounding, complete classification and approval accuracy, and elimination of the three critical baseline failures. Guardrails automatically corrected 3 model drafts before presentation to the operator.

## Limits

- The dataset is synthetic and contains only 12 English-language cases.
- The same local model generated baseline and final outputs; results may vary on other hardware or models.
- The test set is deliberately risk-heavy and does not estimate real production ticket distribution.
- No live order, inventory, payment, carrier, or email action is connected.
- A real support operator has not yet completed usability testing.
