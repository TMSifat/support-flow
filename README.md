# SupportFlow

A local support-review workspace for a small e-commerce operator. Paste a customer message, review the classification and matched policy, personalize the policy-template reply, complete required checks, approve and copy.

The store, policies and tickets are synthetic. The candidate-proxy workflow is disclosed; independent adoption and handling-time savings are not claimed.

## Start on Windows

Prerequisites: Node.js 22.13 or newer, Git, and Ollama. Model download size and required resources depend on the selected model; confirm your machine can run it before the handoff. This project has not been independently tested on macOS or Linux.

Tested here with Node.js 24.11.0, an AMD Ryzen 5 5600X and about 16 GB RAM. The installed llama3.1:8b model is about 4.9 GB on disk. These describe the tested machine, not a guaranteed minimum specification; request latency on other hardware may differ.

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

Start with [the current submission index](Result/START-HERE.md). Current authoritative results use evaluator v3:

- [Comparison](Result/comparison.md) and [final results](Result/final-summary.md)
- [Policy-aware prompt and no-inference comparison](Result/system-comparison.md)
- [New audit regressions](Result/remediation-regression.json) and [18 new live cases](Result/remediation-results.json)
- [Evaluation rubric](Result/evaluation-rubric.md)
- [Hardening before/after evidence](Result/hardening-regression.json)
- [Case study](Result/case-study.md), [architecture](Result/architecture.md), [operator runbook](Result/operator-runbook.md)
- [AI collaboration note](Result/ai-collaboration-note.md), [submission checklist](Result/submission-checklist.md)
- [Two-week adoption plan](Result/adoption-plan.md)
- [Five-minute screen-recorded demo](Result/demo.md)

Run `npm test` for model fault injection, audit regressions, field extraction and all declared prohibition negative tests. With the app and Ollama running, run `npm run evaluate:all` for all 50 final-system cases, both prompt baselines, the no-inference comparison and reports. Failed final-system cases stop that command. Prior raw runs are archived in Result/history before replacement. Review commands rescore output; they never certify human review.

For engineering checks run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

Optional maintainer browser QA and recording use Playwright (not required to run SupportFlow). Install Playwright in a separate tooling folder and set NODE_PATH to its node_modules, or install it locally without changing the app dependencies. Run scripts/browser-check.mjs or scripts/record-demo.mjs. PLAYWRIGHT_EXECUTABLE can select an already-installed Chromium. The recording uses real local API responses with on-screen explanations; it is silent and automated.

## Limitations and handoff

The original suite contains 12 synthetic cases; challenge, hardening and remediation suites bring the total to 50. These provide regression coverage, not an unseen generalization benchmark. Automated text checks remain incomplete and do not replace human review. Order-number extraction and two required identifier facts are measured on the remediation suite; this is not broad extraction accuracy. Actual manual touches, real operator time savings, independent installation and adoption are unmeasured. External model API cost is zero; hardware/electricity cost is unmeasured.

The runnable local repository is the delivery format accepted by the brief. Online hosting and JSON export are not required. No independent operator is currently available. The [human test kit](Result/human-test-kit.md) and version-bound observation form are ready; run `npm run handoff:summarize` after collecting actual observations. The separate [candidate review](Result/current-candidate-review.json) must be completed by the candidate after watching the current video and reviewing its exact result hash.
