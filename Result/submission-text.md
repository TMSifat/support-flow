# SupportFlow submission text

Use the links and summary below in the quest portal. This document is prepared submission content; it is not a portal submission receipt.

Presentation updated 8 September 2026. The links below use the main branch, including the reorganized submission guide and requirement evidence map. Earlier publication verification remains scoped to its recorded 7 September commit.

## Links

- Repository: https://github.com/TMSifat/support-flow
- Reviewer starting point: https://github.com/TMSifat/support-flow/blob/main/Result/START-HERE.md
- Five-minute demo: candidate recording pending separate delivery
- Case study: https://github.com/TMSifat/support-flow/blob/main/Result/case-study.md
- Evaluation package: https://github.com/TMSifat/support-flow/blob/main/Result/system-comparison.md
- AI collaboration note: https://github.com/TMSifat/support-flow/blob/main/Result/ai-collaboration-note.md

## Project summary

**Included artifacts:** runnable working system, evaluation package, case study and AI collaboration note. The candidate-recorded five-minute demo is pending separate delivery. Technical evaluation is complete for the recorded synthetic scope; independent human acceptance and candidate review remain pending.

SupportFlow is a runnable local support-review workspace for a small e-commerce operator. It takes one English support message through classification, urgency, policy matching, provided order details, remaining checks and an editable reply. Consequential cases require acknowledgement before copying; editing the draft resets approval. It integrates local Ollama inference and a D1 audit store with versioned synthetic store policies.

The current system passes all 50 synthetic regression cases. On the same 11 non-empty original messages, the common evaluator gives a generic prompt 0/11 passes, a policy-aware prompt 2/11 and SupportFlow 11/11. Median HTTP times were 1.62, 1.77 and 2.46 seconds respectively on the recorded machine. Controlled behavioral regression checks improved from 4/18 before the fixes to 18/18 after them. Raw outputs, failed runs, the evaluator and provenance hashes are included.

The repository includes sample data, example configuration, a three-step Windows setup, an operator runbook, architecture, failure analysis and a two-week iteration plan. AI implementation and documentation contributions are disclosed.

## Evidence limitations

The store and tickets are synthetic. The 50 cases were used for development and regression, so their pass rate does not establish unseen accuracy. Rules and templates alone pass the original suite; model contribution appears in three added semantic paraphrases. The system drafts reviews only: it does not send messages or access or change live orders, payments or accounts.

No independent operator is currently available. Human task time, edits, adoption, unassisted setup and current-version user feedback are unmeasured. A version-bound five-ticket study kit is ready. The candidate will record and provide the demo separately; personal review of the current results remains pending. HTTP latency is not a claim of human time saved.
