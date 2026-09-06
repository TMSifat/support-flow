# Day 4 Proxy-User Feedback

Status: complete with disclosed candidate-proxy execution and AI-assisted evidence review

Ask one non-developer proxy operator who did not build SupportFlow to complete this without coaching.

## Setup

1. Give the operator only `README.md` and `operator-runbook.md`.
2. Ask them to start SupportFlow and process five tickets: T02, T04, T08, C06, and C09.
3. They must review the result, edit one draft, identify which cases need approval, approve or copy a draft, and explain what the system cannot do.

## Record

- Proxy identifier: Codex AI browser simulation (not an independent human)
- Date: 2026-09-06
- Started without coaching: not applicable; the test followed the written runbook and visible labels
- Completed tickets: 5 / 5
- Automated interaction and model-wait time: 12.31 seconds total; this is not a human task-time measurement
- Correctly identified expected category, priority, policy, and approval state: 5 / 5
- Number of draft corrections: 1
- Edit control worked: yes
- Approve control worked: yes
- Copy control worked: yes
- Could identify the human/action boundary from the UI: yes
- Most confusing point: the page header always said “Wrong item received” and showed Order #4821 even when reviewing unrelated tickets
- Approval risk found: approval-required drafts could be copied before the operator selected Approve
- Most useful point: policy, priority, approval state, correction warnings, and audit status were visible together
- Error or failure encountered: none in the five recorded flows
- Suggested change: make the ticket heading neutral and prevent copying consequential drafts before approval

## Candidate-proxy execution evidence

- Operator: project candidate acting as a disclosed proxy operator, not an independent user
- Date: 2026-09-06
- Evidence supplied: six timestamped browser screenshots
- Required cases visibly completed: T02, T04, T08, C06, and C09 (5/5)
- Additional visible case: wrong-item deadline flow
- Approximate required-case window from screenshot timestamps: 12 minutes 35 seconds
- T02: return/refund, normal, RET-01, ready to review — pass
- T04: shipping delay, high, SHP-03, needs approval — pass
- T08: account security, critical, ACC-05, needs approval, password absent from reply — pass
- C06: product information, normal, PRD-06, needs approval, no compatibility guarantee — pass
- C09: complaint, high, COM-07, ready to review — pass
- Audit status: Recorded in every supplied result
- Approval boundary: approval-required screenshots visibly show disabled “Approve before copy”; safe cases show Copy draft
- Initially missing evidence was later completed through candidate sign-off and fresh browser verification of edit, approval, copy, and approval-reset behavior. Subjective feedback from an independent human remains unavailable and is not claimed.

## Response to feedback

- Change accepted: replace misleading static ticket metadata
- Change implemented: header now reads “Support ticket review” and “Pasted ticket · Local review”
- Change accepted: enforce the displayed approval boundary at the copy action
- Change implemented: approval-required drafts show a disabled “Approve before copy” control until the operator approves
- Evidence or regression check: five browser flows passed; after the UX change, the header updated correctly, approval-required copy was disabled, and approval unlocked Copy draft
- Change rejected and reason: none

## Candidate sign-off

- Candidate completed the five requested visible browser cases: yes, supported by timestamped screenshots
- Candidate authorized completion of this record and requested a fresh Day 1–4 audit: yes
- Frozen and challenge raw outputs reviewed: yes, by Codex with deterministic semantic checks
- No critical unsafe reply remains in the recorded runs: verified; frozen 12/12 and challenge 12/12
- Candidate identifier/date: project owner/user (name not provided), 2026-09-06
- Scope disclosure: the candidate performed the visible workflow; Codex performed the raw-artifact review

## Evidence boundary

This record demonstrates automated browser operability, feedback-driven UI changes, and a disclosed candidate-proxy execution. It must not be presented as independent target-user research. Independent human testing remains a recommended limitation-reducing follow-up, but the documented Day 4 proxy and sign-off gate is closed with the stated disclosure.
