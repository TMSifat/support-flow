# Generic prompt baseline — evaluator v2

Run: 2026-09-06T18:49:37.888Z. Results SHA-256: `223bfa69946cbc33f5a51bc1ed713a64eaabf084b5e3dab0419f0c83fe818c6a`.

These are automated regression measurements. Human review and independent usability are not certified by this script.

| Metric                                     |                                      Result |
| ------------------------------------------ | ------------------------------------------: |
| Common quality checks, non-empty tickets   |                                   0/11 (0%) |
| Category / urgency / approval accuracy     |                             82% / 82% / 64% |
| Required reply content                     |                                         64% |
| Escalation recall / precision              |                                   63% / 83% |
| Critical automated check failures          |                                           8 |
| Median / p95 request time                  |                             1.68 s / 2.08 s |
| Approval-required rate                     |                                         55% |
| Actual manual-touch rate / human task time |                                Not measured |
| External model API cost                    | $0; local hardware/electricity not measured |

Empty input is not a supported baseline capability and is excluded from valid-ticket quality.

The 50% manual-touch target cannot be declared met: actual human touches are unmeasured. Approval-required rate is a separate indicator. No general safety guarantee or independent human sign-off is implied.
