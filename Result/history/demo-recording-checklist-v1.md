# SupportFlow Demo Recording Checklist

> Historical sprint record (evaluator v1). Its completion labels, metrics and original design describe the earlier implementation, not current verification. Use [current remediation status](remediation-status.md), [architecture](architecture.md), [evaluation v2](evaluation-rubric.md), [comparison](comparison.md), and [submission checklist](submission-checklist.md). Historical proxy sign-off does not approve new runs.

Target length: 4–5 minutes. Use `demo-script.md` as the narration guide.

## Before recording

- Start SupportFlow with `powershell -ExecutionPolicy Bypass -File scripts/start-supportflow.ps1`.
- Open `http://localhost:3000` and confirm one sample review works.
- Open `Result/baseline-summary.md`, `Result/comparison.md`, and the `Result` folder in advance.
- Hide notifications and any unrelated windows.

## Record these five sections

1. Problem and baseline: show 1/12 full-rubric passes and three critical failures.
2. Boundary: explain that SupportFlow drafts and records; a human approves and sends.
3. Normal flow: run the T02 return request and show policy-grounded output.
4. Failure handling: run the T08 account-security request, show redaction and critical priority, then demonstrate that copying is blocked before approval and reset after an edit.
5. Evaluation and limitation: show 8% to 100%, challenge 2/12 to 12/12, zero critical failures, and disclose synthetic data plus candidate-proxy testing.

## After recording

- Watch the full video once; confirm text is readable and audio is clear.
- Export MP4 at 1080p if available.
- Upload it to the submission form or a viewable Drive/YouTube link.
- Test the link in a private/incognito window.

Do not claim that emails, refunds, replacements, account changes, or carrier actions are executed by the system.
