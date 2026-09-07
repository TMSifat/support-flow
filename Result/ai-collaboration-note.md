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

Current verification uses evaluator v3 with common baseline/final checks, negative safety fixtures, controlled model fault injection and automated browser tests. Final replies/actions are versioned policy templates. Raw runs have hashes; older results are retained. Current human review and independent user acceptance are explicitly unperformed. The earlier case-ID-based review/sign-off generators were rejected and replaced.

- The current common comparison uses the same 11 non-empty original messages for both prompt baselines and the final system; the twelfth, blank-input case checks final-system validation separately.
- The same Llama 3.1 8B model was used in both conditions.
- Outputs were checked against expected category, urgency, approval, policy, required content, and forbidden behavior.
- Raw outputs and processing times were retained.
- The application completed a production build.
- The review API and local audit log were exercised directly.

## Results rejected or corrected

- The earlier “only the video remains” completion assessment was rejected after deeper testing found mixed-intent priority, schema, redaction and evaluation defects. Current status is recorded in remediation-status.md.
- Automated checks are no longer labelled full human semantic review. Old candidate-proxy sign-off does not approve current outputs.

- The first UI was rejected because it contained unnecessary status text, decorative effects, and an obvious AI-template appearance. It was replaced with a compact support workspace.
- The baseline Friday-delivery promise was rejected.
- The baseline account-lock and reset-link claim was rejected.
- The baseline legal/injury wording was rejected.
- Final-model drafts missing policy details or claiming unavailable checks were replaced by validated safe responses.

## Decisions personally owned by the candidate

- Use a small, recurring support workflow rather than a broad autonomous assistant.
- Use synthetic data and disclose the absence of a real user.
- Keep refunds, replacements, cancellations, security, legal issues, compatibility, and delivery promises under human approval.
- Prefer a local model to avoid API cost and protect ticket data.
- Optimize for measurable safety and reproducibility rather than maximum automation.

## Transparency note

AI contributed substantial implementation and writing. The candidate is responsible for understanding the architecture, validating the evidence, explaining trade-offs, presenting limitations honestly, and making the final submission.

## Second audit response

Codex fixed the newly demonstrated injury/approval, substring, address-change, secret-suffix, quantity/duration, missing-order and scorer-prohibition defects. Live failures during remediation were rejected and retained before another correction. It added 18 regression cases, narrow extraction checks, policy-aware and no-inference comparisons, a current-result-bound demo and a human test kit. The candidate reported that an independent operator is unavailable; no human result was invented. Customer-provided facts now include exact model excerpts and a deterministically parsed order identifier.
