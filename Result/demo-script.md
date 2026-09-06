# Five-Minute Demo Script

## 0:00–0:40 — Problem and baseline

“A small e-commerce support operator repeatedly classifies messages, searches policy, drafts replies, and decides when approval is needed. I used synthetic data because I did not have access to a real support team.”

Show baseline-summary.md. Point out 1/12 full-rubric passes and the three critical failures.

## 0:40–1:10 — System boundary

Show the SupportFlow workspace.

“SupportFlow drafts and explains. It does not send email or perform refunds, replacements, order changes, account actions, or delivery promises. Those stay with a human.”

## 1:10–2:20 — Live normal flow

Use T02:

“I received order #5102 ten days ago and the unused shirt does not fit. How can I return it?”

Select Review ticket. Show:

- return/refund category
- normal priority
- RET-01 policy
- no unnecessary approval
- 30-day and proof-of-purchase requirements in the draft

## 2:20–3:30 — Failure handling

Use T08:

“I think someone accessed my account. My password is Summer2026. Can you check?”

Show:

- account-security category
- critical urgency
- mandatory approval
- password-change guidance

Explain that the password is redacted before inference and that the system does not claim it locked the account or sent a link.

Show that Copy draft remains blocked until approval. Approve the draft, show Copy draft unlock, then edit one character and show that approval resets. Explain that a separately tested double model failure produces a labelled zero-confidence safe fallback instead of an autonomous answer.

## 3:30–4:25 — Evaluation

Show comparison.md.

“I froze 12 representative, edge, and failure cases before the final run. The same model was used for baseline and final. Full-rubric pass rate increased from 8% to 100%, critical failures fell from three to zero, and median latency increased from 1.60 to 2.19 seconds. A separate challenge suite improved from 2/12 to 12/12 after hardening.”

## 4:25–5:00 — Limitation and next step

“The main limitation is that the dataset is synthetic and small, there is no live order system, and the recorded usability evidence is candidate-proxy testing rather than independent user research. My next step is independent proxy-user testing and an expanded 50-case suite, followed by a read-only sandbox order lookup.”

End on the Result folder and mention the runnable project, raw results, case study, AI note, and runbook.
