# Candidate review and interview brief

Read this alongside the five-minute demo and raw results. Reading a prepared brief is not evidence of independent user testing, and no personal review is recorded automatically.

## Explain the workflow

The intended user is a small-store support operator. A pasted ticket goes through input validation, named-secret redaction, policy retrieval and local model classification/extraction. Deterministic risk rules and policy templates produce the review. The operator checks the policy and facts, edits the draft, acknowledges consequential cases and copies it. D1 records review metadata, not customer message text. The workflow ends before sending or taking order, payment or account actions.

## Explain the main decisions

- Local Ollama avoids external model API charges but requires installation, memory and local compute.
- Templates make policy wording predictable but require operator personalization.
- Rules preserve recognized requests against ordinary model errors; model proposals help with unmatched wording. Critical model signals still require review.
- Customer-provided order IDs and quoted facts are evidence from the message, not an external order lookup.
- Approval is a UI acknowledgement that resets on edits; it is not a durable approval or action record.

## Explain the measured result

All 50 current synthetic release cases pass. The original 11 non-empty inputs score 0/11 for a generic prompt, 2/11 for a policy-aware prompt and 11/11 for SupportFlow under the same common rubric. A neutral-model ablation also passes the original suite, showing that rules/templates explain that gain. It misses three semantic paraphrases in the added cases, where the model-backed system passes. These are development cases, not a hidden benchmark.

The controlled shared behavioral checks improve from 4/18 to 18/18. Examples include injury mixed with a return request bypassing review, "issue" matching "sue", address edits using a tracking-delay policy, partial password redaction and "five items" being mistaken for a delay. The evaluator itself was corrected after it accepted a forbidden lost-parcel claim; every original prohibition now has a negative fixture.

## State the limitations accurately

No independent participant was available. Human time savings, adoption and current-version user feedback remain unmeasured. The store and data are synthetic. The model estimate is uncalibrated, pattern checks have limits, and the app has no live order/action integration. The next step is an observed five-ticket operator study followed by unseen examples and a read-only sandbox order lookup.

## Complete your own review

Watch [the current demo](demo.md), inspect [the comparison](system-comparison.md) and its linked raw evidence, and explain the decisions above in your own words. Only then fill in [current-candidate-review.json](current-candidate-review.json) with your actual name, date and observations. Do not backdate it or mark an activity complete before doing it. Independent user observations belong in the separate [human test kit](human-test-kit.md).
