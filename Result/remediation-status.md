# Current remediation status — 7 September 2026

This is the current status. Earlier Day 1–5 completion labels and v1/v2 scores are historical.

| Audit finding | Implemented correction | Evidence |
|---|---|---|
| Injury plus return bypassed approval | Injury recognition and critical-model priority; safe-self-service cannot suppress critical review | R04/R05/R16, controlled conflict tests, browser injury-return gate |
| Ordinary issue/suede triggered legal risk | Token boundaries in risk recognition and retrieval | R01/R09 |
| Delivery address changes used shipping policy | Address update/edit/change recognition; order verification and approval | R02/R08 |
| Punctuated/unclosed-quoted secret partially survived | Redact the complete unquoted token or quoted line; independent partial-echo checks | R06/R10, outgoing-prompt probes |
| Item quantity mistaken for tracking duration | Clause/context-based timing; explicit business days; ambiguous intervals verified | R03/R12/R13/R14 |
| Supplied order number reported missing | Shared identifier extraction, provided-fields UI and personalized templates | R07/R11; field assertions on all 18 cases |
| must_not requirements skipped | Explicit mapping and 11 negative fixtures; unmapped requirements fail | evaluator v3, npm test |
| Correct model category discarded for unmatched input | Accept model proposals for unmatched intent; definitions guide semantic classification | R15/R16/R17 |
| Model overrode an explicit refund / benign tracking case | Ordinary proposals cannot overwrite a recognized request; high-risk security proposals can escalate | Retained failing runs and current full suite |
| Model's incremental value unmeasured | Added policy-aware prompt and no-inference comparison | system-comparison.md, ablation-results.json |
| Human outcome evidence absent | Prepared version-bound five-ticket kit and strict observation summarizer | human-test-kit.md, human-observations.json |

Current final-system regression: 50/50. Controlled shared behavioral checks: 4/18 before, 18/18 after. New extracted-field enrichment is excluded from this before/after behavior count. All 18 new controlled cases pass final checks.

## Still requires actual participation

The candidate confirmed that no independent operator is currently available. Independent unassisted setup, observed human time/edits/adoption and current-version feedback remain pending. The kit makes them executable; it cannot make them happen automatically. Candidate review of the exact current results and the separately supplied recording is also pending. Historical screenshot descriptions are retained as unverified-within-this-package historical evidence; original images were not supplied with this revision.

The technical changes do not guarantee general safety or hiring. Synthetic data, a small development set, regex limitations, generic templates and no external order/action integration remain disclosed. Online hosting and JSON export are not requirements of the supplied brief.
