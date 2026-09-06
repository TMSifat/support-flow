# Day 4 — Evaluate, Break, and Harden

Date: 2026-09-06
Status: complete with disclosed candidate-proxy execution and AI-assisted evidence review

## Evaluation design

Day 4 preserved the original frozen 12-case suite in `data/test-cases.json` and added a separate 12-case challenge suite in `data/day-4-challenge-cases.json`. The challenge suite tests paraphrases, multi-intent requests, prompt injection, privacy, policy retrieval, approval boundaries, and safe self-service behavior.

The challenge set is regression evidence, not an independent holdout benchmark: it was used to discover failures and then retained to prevent those failures from returning.

## Break-test result before hardening

| Metric                                               |     Result |
| ---------------------------------------------------- | ---------: |
| Challenge cases completed                            |      12/12 |
| Cases passing the full automated and semantic checks | 2/12 (17%) |
| Median end-to-end time                               |     2.15 s |

Raw evidence: `day-4-challenge-before.json`.

## Failures and root causes

### 1. Paraphrased shipping delays missed policy and approval

- Observed in C01 and C04.
- Symptoms: `GEN-00` policy, missing carrier-investigation approval, and drafts claiming “we'll look into” an unavailable carrier action.
- Root cause: retrieval and delay-threshold rules covered the frozen phrases but not `package`, `carrier scan`, `nine days`, `frozen`, or `last Monday`. The unsupported-action validator covered “we are looking into” but not future-tense variants.
- Change: expanded shipping vocabulary and duration recognition, added carrier-threshold approval, and blocked future-tense investigation/carrier-action claims.

### 2. Multi-intent tickets used last-match behavior instead of risk precedence

- Observed in C02 and C12.
- Symptoms: a legal-plus-payment ticket became payment security; an account-takeover-plus-refund ticket became return/refund.
- Root cause: independent rules could overwrite a higher-risk category with a later lower-risk category.
- Change: introduced explicit category priority: legal/safety, account security, payment security, order changes, fulfillment, refunds, product information, shipping, and ordinary complaints.

### 3. Passcodes were not treated as secrets

- Observed in C05.
- Symptoms: the passcode reached model-visible structured fields, the policy fell back to `GEN-00`, and urgency remained high instead of critical.
- Root cause: redaction and account-risk rules recognized `password` but not `passcode`, profile takeover, or broader compromise wording.
- Change: redacted password, passcode, PIN, security-code, and card-number patterns before inference; expanded takeover detection; enforced critical account-security handling and `ACC-05` retrieval.

### 4. Common intent paraphrases fell through to the general policy

- Observed in C06–C10.
- Symptoms: compatibility, cancellation, damaged-item, complaint, and standard-return paraphrases relied on model classification while the prompt still contained `GEN-00`.
- Root cause: the deterministic vocabulary was too close to the original frozen test wording.
- Change: expanded intent phrases for compatibility, stop-shipment requests, shattered items, ordinary complaints, unopened returns, and send-back requests.

### 5. Safe low-confidence complaints were unnecessarily escalated

- Observed after the first hardening pass in C09.
- Symptom: all classification and policy checks passed, but a safe complaint required manager approval only because model confidence was 50%.
- Root cause: the low-confidence rule bypassed the existing safe-self-service exception.
- Change: low confidence now triggers consequential approval only outside explicitly safe self-service cases. The operator still reviews every displayed draft before sending.

## Regression result after hardening

| Metric                              | Original frozen suite | Day 4 challenge suite |
| ----------------------------------- | --------------------: | --------------------: |
| Cases completed                     |                 12/12 |                 12/12 |
| Full automated + semantic pass rate |                  100% |                  100% |
| Median processing time              |                2.19 s |                1.94 s |
| p95 processing time                 |                2.62 s |          Not reported |
| Critical failures after guardrails  |                     0 |                     0 |

The latest frozen-suite run recorded three model drafts corrected by guardrails. The challenge run exercised five corrections. Eight of eleven non-empty frozen cases required consequential human approval; this is a deliberately risk-heavy suite and not a production manual-touch estimate.

The 73% approval rate does not meet the pre-registered manual-touch target of 50% or less. The sprint demonstrated safety and decision consistency, but did not demonstrate reduced human intervention on this risk-weighted suite.

External API cost was $0 because inference used the local Ollama model. Local hardware time and electricity were not measured.

Raw evidence: `final-results.json` and `day-4-challenge-after.json`.

## Evaluation integrity changes

- The final evaluator now checks required reply content, forbidden behavior, sensitive-value echo, unsupported action claims, and approval rationale in addition to category, urgency, policy, approval, and output structure.
- The result does not label generated review notes as independent human review. Deterministic semantic review and disclosed candidate sign-off are complete; independent target-user review remains pending.
- The original frozen test cases were not edited.

## Remaining limitations

- Both suites are synthetic and English-only.
- The challenge suite is regression evidence, not unseen external validation.
- Keyword and phrase rules can still miss novel language or complex multi-intent cases.
- No live order, inventory, carrier, payment, or email system is connected.
- A non-candidate proxy user has not yet completed the feedback exercise.
- Performance depends on local model warm-up and hardware.

## Proxy feedback record

The project candidate completed the visible five-case workflow and supplied timestamped screenshots. UX findings and responsive changes are recorded in `day-4-proxy-feedback-form.md`, and sign-off provenance is stored in `candidate-signoff.json`. This is disclosed candidate-proxy evidence, not independent target-user research.
