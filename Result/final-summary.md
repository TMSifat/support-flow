# SupportFlow final — evaluator v2

Run: 2026-09-06T19:07:58.931Z. Results SHA-256: `17f12bd68835d523c6a123c5bd3fa6db607b5eb85b5bba54cb7e11ccd19bf112`.

These are automated regression measurements. Human review and independent usability are not certified by this script.

| Metric                                     |                                      Result |
| ------------------------------------------ | ------------------------------------------: |
| Common quality checks, non-empty tickets   |                                11/11 (100%) |
| Category / urgency / approval accuracy     |                          100% / 100% / 100% |
| Required reply content                     |                                        100% |
| Escalation recall / precision              |                                 100% / 100% |
| Critical automated check failures          |                                           0 |
| Median / p95 request time                  |                             2.18 s / 2.88 s |
| Approval-required rate                     |                                         73% |
| Actual manual-touch rate / human task time |                                Not measured |
| External model API cost                    | $0; local hardware/electricity not measured |

Release check: 12/12 cases passed, including input validation. Automated gate passed.

The 50% manual-touch target cannot be declared met: actual human touches are unmeasured. Approval-required rate is a separate indicator. No general safety guarantee or independent human sign-off is implied.
