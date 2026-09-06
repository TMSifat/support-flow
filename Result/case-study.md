# SupportFlow — case study

## Whose workflow changed?

The intended user is a non-technical operator at a small e-commerce store. For each ticket they classify the issue, identify urgency, find policy, draft a response, decide which actions require approval, and record metadata. The synthetic store assumes 20–50 English-language messages daily; this volume and actual time savings have not been observed in a real support team.

The candidate completed disclosed proxy flows earlier in the sprint. Current automated browser testing is distinct from independent user research. Synthetic data is allowed by the brief and is disclosed throughout this project.

## What was built?

A local web workspace connects an Ollama model, versioned store policies and a D1 audit log. It accepts one pasted ticket and produces a policy-grounded review. The operator can read the policy, verify missing information, edit a policy-template reply, approve when needed and copy it.

The model supplies schema-validated classification/extraction proposals. Risk rules preserve critical priority across mixed intents. Invalid model objects receive one retry and then an approval-required fallback. Operator-visible recommended actions and replies use policy templates; unverified model prose is not delivered as the final reply. This sacrifices personalization for predictable policy wording. Extracted facts are retained only when present in the redacted input.

No email, refund, replacement, cancellation or account action is performed. Order/inventory/payment/account verification and sending remain human responsibilities. Local model inference avoids external model API charges but requires installation and suitable local resources.

## Baseline and proof

Both conditions use the same Llama 3.1 8B model and the original 12-case suite: 11 non-empty messages plus a separate validation case. Baseline uses one generic prompt without policies or tools. Evaluator v2 applies the same eight-point quality checks to baseline and final; final schema/policy capabilities are additional checks. Failed requests stay in the denominator. Recorded v2 results and timing are in [comparison](comparison.md), [baseline summary](baseline-summary.md), and [final summary](final-summary.md).

The earlier v1 full-rubric comparison overstated what its checker established. That claim was withdrawn: baseline used static case reviews while final reused automated passes. The corrected checker rejects known-bad refund, compatibility and liability statements and does not create human sign-off. Its outputs are automated regression evidence, not proof of universal safety.

## Failures, causes and changes

- Mixed legal/security plus recent tracking text downgraded critical priority. A general tracking override outranked risk; the override now applies only when no higher-risk reason exists.
- Null or incomplete JSON bypassed retry validation. Both JSON schema guidance and runtime shape validation now apply inside the retry boundary.
- Equals signs and quoted passwords evaded redaction. Named-secret parsing now supports these forms, and request-prompt probes verify removal.
- Unsafe recommendations and unsupported reply promises escaped text checks. The delivered reply/action now use versioned templates and derived verification items.
- The UI showed only a policy ID and could display contradictory missing-information text. Policy content is expandable; verification items are derived independently from model suggestions.
- Old responses could race edited input; request versioning prevents stale rendering. Clipboard failures now produce an actionable message. Browser tests exercise approval reset, copy gating and WebMCP error handling.

Controlled fault tests improved from 3/20 on the earlier source to 20/20. Original live tests pass 12/12, challenge tests 12/12, and new mixed-intent/privacy tests 8/8 in the retained run. [Raw hardening evidence](hardening-regression.json) and [browser evidence](browser-verification.json) disclose their automated methods.

## Human ownership and remaining limitations

The candidate owns scope, synthetic-data disclosure, operating boundaries and final presentation. AI performed substantial coding, data creation, checks and documentation, including this later hardening. Current result files are not automatically signed off by the candidate.

Actual human handling time, manual touches, field-extraction accuracy, independent setup and adoption remain unmeasured. Approval-required rate is not manual-touch rate; the 50% manual-touch target is unproven. Text rules can miss new phrasing, confidence is uncalibrated, and templates can be too generic. English-only text and one primary issue are deliberate scope limits. D1 records review metadata, not durable approval or sending events.

## Next two weeks

Week 1: give two independent operators the README/runbook, observe unassisted setup and five tickets each, record time/edits/approval mistakes, and respond to their feedback. Week 2: expand to 50 cases, test a read-only sandbox order lookup and compare operator outcomes. Actual adoption begins only when people use the system. See [the measurement plan](adoption-plan.md) and [uncompleted acceptance form](handoff-acceptance.md).
