# AI Collaboration Note

## Tools used and their roles

- Codex: proposed the initial project direction, implemented the application, created synthetic policies and tests, ran checks, and drafted documentation.
- Ollama with Llama 3.1 8B: generated baseline replies and powered the final ticket-review workflow.
- Deterministic JavaScript evaluation scripts: executed the frozen test suite and calculated repeatable metrics.
- Human collaborator: rejected the first over-designed interface, approved a simpler operational direction, and retained responsibility for the project and final presentation.

## Work delegated to AI

- Drafting the initial workflow and scope
- Generating synthetic test data
- Implementing the web interface, API, retrieval, guardrails, and logging
- Producing ticket classifications and reply drafts
- Preparing evaluation and handoff documents

## Verification

Verification uses evaluator v3 with common baseline/final checks, negative safety fixtures, controlled model fault injection and automated browser tests. Final replies/actions are versioned policy templates. Raw runs have hashes, and earlier runs are retained for comparison. Automated verification and human review are reported separately; candidate review of the current results and independent user acceptance remain pending.

- The current common comparison uses the same 11 non-empty original messages for both prompt baselines and the final system; the twelfth, blank-input case checks final-system validation separately.
- The same Llama 3.1 8B model was used in both conditions.
- Outputs were checked against expected category, urgency, approval, policy, required content, and forbidden behavior.
- Raw outputs and processing times were retained.
- The application completed a production build.
- The review API and local audit log were exercised directly.

## Results rejected or corrected

- Tests exposed errors in mixed-intent priority, model-response validation, sensitive-data redaction and evaluation checks. The implementation and evaluator were corrected, and regression cases were added to verify those fixes. [Technical findings and corrections](remediation-status.md) document the evidence.
- The candidate requested a simpler interface. Decorative elements and unnecessary status text were replaced with a compact workspace focused on reviewing the ticket, policy, draft and approval requirements.
- A baseline reply promised Friday delivery without carrier confirmation. The final workflow requires verification and human approval before a delivery commitment.
- A baseline reply claimed it would lock an account and send a reset link despite having no account-management integration. Those claims were replaced with policy-based guidance and human escalation.
- Baseline legal/injury wording treated an allegation as established fact and promised follow-up actions. The final policy template uses neutral language and requires escalation.
- Model drafts that omitted policy details or claimed unavailable checks were replaced with versioned policy templates. The operator retains responsibility for personalization and verification.

## Decisions personally owned by the candidate

- Use a small, recurring support workflow rather than a broad autonomous assistant.
- Use synthetic data and disclose the absence of a real user.
- Keep refunds, replacements, cancellations, security, legal issues, compatibility, and delivery promises under human approval.
- Prefer a local model to avoid API cost and protect ticket data.
- Optimize for measurable safety and reproducibility rather than maximum automation.

## Transparency note

AI contributed substantial implementation and writing. The candidate is responsible for understanding the architecture, validating the evidence, explaining trade-offs, presenting limitations honestly, and making the final submission.

## Measured improvements

The additional 18-case regression suite covers injury/approval handling, unintended keyword matches, address changes, secret redaction, tracking durations, order identifiers and prohibited claims. Controlled shared behavioral checks improved from 4/18 before the corrections to 18/18 after them. All 50 saved final-system development/regression cases pass. Earlier failing runs are retained.

Policy-aware and no-inference comparisons show where rules, templates and model proposals contribute. These synthetic results establish bounded regression coverage; human handling-time savings and adoption remain unmeasured. The next validation step is the prepared operator study, followed by unseen examples.
