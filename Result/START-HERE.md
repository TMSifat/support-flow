# SupportFlow — submission guide

SupportFlow turns a pasted customer message into a policy-grounded, editable reply with classification, urgency, verification prompts and approval controls. It serves a non-technical e-commerce support operator using a disclosed synthetic store and English-language tickets.

**Package status:** all five required deliverable artifacts are included. Technical evaluation is complete for the recorded scope; independent human acceptance and candidate review remain pending.

## Five required deliverables

| Deliverable | Included work | Evidence |
|---|---|---|
| Working system | Runnable source, sample inputs, example configuration, three-step Windows setup, Ollama inference and D1 audit integration | [Setup guide](../README.md) |
| Evaluation package | 12 original cases plus 38 additional regression cases, expected behavior, two prompt baselines, common rubric, failure analysis and before/after results | [Comparison](system-comparison.md) · [Rubric](evaluation-rubric.md) |
| Case study | User, workflow, scope, architecture, trade-offs, AI/human responsibilities, failures, results, limitations and next iteration | [Case study](case-study.md) |
| AI collaboration note | Tools, delegation, verification, corrected/rejected outputs and candidate decisions | [AI note](ai-collaboration-note.md) |
| Five-minute demo | Recorded local input-to-output flow, policy review, editing, approval, validation, evaluation and limitations | [Video](supportflow-demo.webm) · [Details](demo.md) |

## Measured outcomes

- **50/50** saved final-system synthetic development/regression cases pass.
- On the same 11 valid original inputs, common checks pass **0/11** for the generic prompt, **2/11** for the policy-aware prompt and **11/11** for SupportFlow.
- SupportFlow median HTTP processing time is **2.46 seconds**, versus 1.62 and 1.77 seconds for the baselines. This measures request latency, not human time saved.
- Controlled shared behavioral checks improved from **4/18 to 18/18** after remediation.
- The 8 September local audit passed lint, TypeScript checks, 20 hardening regressions and 18 remediation cases; saved result and engine/evaluator hashes matched current files.

## Review and handoff

Use the [requirement evidence map](requirements-map.md) to check each sprint stage and scoring category. Follow the [root README](../README.md) to run the system and the [operator runbook](operator-runbook.md) to use it.

1. [Five-minute demo](demo.md)
2. [Case study](case-study.md) and [architecture](architecture.md)
3. [System comparison](system-comparison.md), [evaluation rubric v3](evaluation-rubric.md) and [raw final results](final-results.json)
4. [Audit fixes and remaining limitations](remediation-status.md)
5. [Operator runbook](operator-runbook.md), [AI collaboration note](ai-collaboration-note.md) and [two-week plan](adoption-plan.md)
6. [Human test kit](human-test-kit.md) and [current candidate review form](current-candidate-review.json)
7. [Submission links and summary](submission-text.md) and [candidate explanation brief](candidate-brief.md)

Current automated release: 50/50 synthetic cases. Engine SHA-256: d35c9c0bbfee0944aa451a7cfc5289dee5c9d9363df2d6306d16feb1aa31d294. Original final result SHA-256: 9af0469df788e9800edeb171bf6aa172ac05fb7896bf6d929c3c07556f6e4baa.

## Evidence boundaries and release status

The store and tickets are synthetic, as permitted by the brief. The 50 cases were used during development and do not establish unseen accuracy. Rules/templates alone pass the original suite; added semantic cases show a narrower model contribution. The workflow ends at reviewing and copying a draft; sending and consequential order/payment/account actions remain human responsibilities.

The previous source/evidence/demo release was published to [GitHub](https://github.com/TMSifat/support-flow/commit/42a902d09d1cbb42d7fec68f4b03ade6171765eb). [Publication verification](publication-verification.json) records checks from 7 September. The reorganized 8 September documentation is included in this source release; see [GitHub history](https://github.com/TMSifat/support-flow/commits/main/) for the documentation update. The earlier verification record applies to its named commit. Portal submission is not confirmed.

Independent human operation and observed business savings are pending because a participant is unavailable. Actual human task time, edits/touches, adoption, unassisted setup and current-version feedback remain unmeasured; the manual-touch target is unproven. The human test kit and two-week measurement plan are prepared. The demo is a silent automated screen recording; candidate viewing and review of the current results remain pending.

Earlier Day 1–5 documents, candidate-signoff.json and v1/v2 scores are historical. They do not supersede this index or approve this revision.
