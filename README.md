# SupportFlow

A local support-review workspace for a small e-commerce operator. Paste a customer message, review the classification and matched policy, personalize the policy-template reply, complete required checks, approve and copy.

The store, policies and tickets are synthetic. The candidate-proxy workflow is disclosed; independent adoption and handling-time savings are not claimed.

## Start on Windows

Prerequisites: Node.js 22.13 or newer, Git, and Ollama. Model download size and required resources depend on the selected model; confirm your machine can run it before the handoff. This project has not been independently tested on macOS or Linux.

1. Download/clone this repository and run `npm ci` in its folder.
2. Install/start Ollama and run `ollama pull llama3.1:8b`.
3. Double-click `Start-SupportFlow.cmd`, then open http://localhost:3000.

On subsequent runs, only step 3 is needed. The launcher checks prerequisites, verifies the configured model and creates the local D1 schema idempotently. Keep its terminal open while using the app.

Defaults need no API key. Optional settings are documented in [.env.example](.env.example): OLLAMA_BASE_URL, OLLAMA_MODEL and OLLAMA_TIMEOUT_MS. Copy to an ignored `.env` only when needed. Use the launcher so these settings are applied consistently.

## Operating boundary

Ollama supplies schema-validated classification and extraction proposals. Deterministic risk rules set minimum urgency and mandatory approval. Final replies and recommended actions come from versioned policy templates; extracted facts are retained only when present verbatim in the redacted input. This reduces personalization but prevents unrestricted model action claims from reaching the operator.

The app does not access orders, inventory, payments, accounts or email. No refund, replacement, cancellation, account change or sending action is performed. Approval is an operator acknowledgement and resets when the draft or ticket changes. It is not a durable approval record. D1 stores only classification/audit metadata.

Read the matched policy in the workspace. Treat the model estimate as uncalibrated. Safe self-service policy templates can be reviewed and copied without an extra approval click even when the estimate is low; consequential cases and model-outage fallbacks always require approval.

## Evidence and checks

Current authoritative results use evaluator v2:

- [Comparison](Result/comparison.md) and [final results](Result/final-summary.md)
- [Evaluation rubric](Result/evaluation-rubric.md)
- [Hardening before/after evidence](Result/hardening-regression.json)
- [Case study](Result/case-study.md), [architecture](Result/architecture.md), [operator runbook](Result/operator-runbook.md)
- [AI collaboration note](Result/ai-collaboration-note.md), [submission checklist](Result/submission-checklist.md)
- [Two-week adoption plan](Result/adoption-plan.md)
- [Five-minute screen-recorded demo](Result/demo.md)

Run `npm test` for model fault-injection and evaluator negative tests. With the app and Ollama running, run `npm run baseline`, `npm run evaluate`, `npm run day4:challenge`, `npm run evaluate:hardening`, then `npm run evaluate:report`. Failed final/challenge/hardening cases produce a nonzero exit code. Prior raw runs are archived in Result/history before replacement. Review commands rescore output; they never certify human review.

For engineering checks run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

Optional maintainer browser QA and recording use Playwright (not required to run SupportFlow). Install Playwright in a separate tooling folder and set NODE_PATH to its node_modules, or install it locally without changing the app dependencies. Run scripts/browser-check.mjs or scripts/record-demo.mjs. PLAYWRIGHT_EXECUTABLE can select an already-installed Chromium. The recording uses real local API responses with on-screen explanations; it is silent and automated.

## Limitations and handoff

The original suite contains 12 synthetic cases; challenge and hardening suites provide additional regression coverage, not an unseen generalization benchmark. Automated text checks remain incomplete and do not replace human review. Actual manual touches, field-extraction accuracy, real operator time savings, independent installation and adoption are unmeasured. External model API cost is zero; hardware/electricity cost is unmeasured.

The runnable local repository is the delivery format accepted by the brief. Online hosting and JSON export are not required. Follow [handoff acceptance](Result/handoff-acceptance.md) to collect independent evidence without inventing it.
