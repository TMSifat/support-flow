# Operator runbook

## Start

Complete the three-step first-time setup in the root README. Afterwards double-click `Start-SupportFlow.cmd` and open http://localhost:3000. Keep the terminal open. If the app is already running, the launcher tells you.

## Process a ticket

1. Paste one English-language message and choose Review ticket.
2. Check category and priority, then expand Read matched policy.
3. Read “Provided in the message”, “Still to verify” and the recommended action. A displayed order ID is supplied by the customer, not verified in an order system. Perform necessary checks in your actual order/account systems; SupportFlow cannot do them.
4. Personalize the policy-template draft. The model estimate is uncalibrated and is not evidence that a fact is verified.
5. Approve consequential replies only after the required checks. Copy unlocks after approval; editing resets approval.
6. Copy the reply and send it using the authorized external channel. SupportFlow does not send it.

Safe self-service templates do not require an extra approval click. They still require your review. If the model is unavailable, the clearly labelled fallback always requires approval. Neither a green status nor clicking Approve proves that a real action occurred.

## Recover from a problem

- Blank or oversized message: enter between 1 and 5,000 characters.
- Safe fallback: inspect the policy carefully. Check Ollama and the selected model before the next request.
- Review failed: retry once and report the time and error code to the maintainer; avoid attaching customer secrets to logs.
- Audit unavailable: run `npm run db:local:setup`; if it continues, ask the maintainer to inspect database access. Do not assume migration is the only possible cause.
- Copy failed: select the draft text and copy manually.
- Missing Node/npm or model: follow the README prerequisite steps.
- Port 3000 occupied: stop the other application before starting SupportFlow.

## Boundaries

Never claim a refund, replacement, cancellation, carrier action or account change was performed by SupportFlow. Never request passwords/full card numbers. Route legal, safety and security issues to the appropriate person. Approval is not saved as a durable audit event. Independent first-time operation should be recorded using handoff-acceptance.md.

The human-test-kit.md file contains five synthetic tickets and measurement instructions. Actual observations belong in human-observations.json; blank values remain unmeasured. The candidate must separately complete current-candidate-review.json after reviewing the exact version and recording.
