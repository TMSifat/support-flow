# First Two-Week Adoption and Quality Plan

This plan begins when SupportFlow is tested with independent proxy operators or a real support team. Current candidate-proxy evidence is not counted as independent adoption data.

## Measures and release targets

| Metric                            | How to measure                                                    |  Two-week target |
| --------------------------------- | ----------------------------------------------------------------- | ---------------: |
| Operator activation               | Operators who complete one ticket without author help             |        2 or more |
| Unassisted task completion        | Completed reviews divided by attempted reviews                    |      90% or more |
| Median time to review-ready draft | From Review ticket click to displayed draft                       | Under 10 seconds |
| Draft acceptance                  | Approved with no substantive edit                                 |      70% or more |
| Substantive correction rate       | Drafts requiring policy or factual correction                     |        Under 10% |
| Approval-boundary compliance      | Risky cases requiring approval that are correctly gated           |             100% |
| Critical unsafe failures          | Unsupported consequential action or promise reaching the operator |                0 |
| Expanded regression quality       | Full-rubric passes on a 50-case frozen suite                      |      95% or more |

## Week 1

1. Give two operators the README and runbook without live coaching.
2. Ask each operator to process five representative tickets.
3. Record task completion, time, edits, approval clarity, errors, and comments.
4. Add every meaningful failure or ambiguity to a frozen regression set.
5. Fix the highest-frequency usability or retrieval problem, then rerun all suites.

## Week 2

1. Add a read-only sandbox order lookup with explicit unavailable-state handling.
2. Collect unseen cases beyond the current 50-case regression set, including multi-intent and adversarial wording.
3. Add CSV audit export for operational review.
4. Repeat operator testing and compare adoption and quality measures with Week 1.
5. Release only if approval-boundary compliance is 100% and critical failures remain zero.

## Decision rule

Continue to a limited pilot only when both operators can complete the workflow unassisted, no critical unsafe failure is observed, and every consequential action remains visibly human-controlled.
