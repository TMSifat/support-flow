# SupportFlow Operator Runbook

## Start

On the prepared sprint computer, run:

    powershell -ExecutionPolicy Bypass -File scripts/start-supportflow.ps1

Then open http://localhost:3000.

## Review a ticket

1. Paste the customer message.
2. Select Review ticket.
3. Check category, priority, matched policy, and confidence.
4. Read the approval reason when present.
5. Edit the reply if needed.
6. Approve only after completing any required order, stock, payment, account, carrier, or legal check.

## Never do from SupportFlow alone

- Confirm a refund, credit, replacement, cancellation, or delivery date.
- Claim an order, account, payment, or carrier action occurred.
- Request a password or full card number.
- Send a legal or safety-sensitive reply without manager review.

## Errors

- Message is required: paste non-empty ticket text.
- Message too long: reduce it below 5,000 characters.
- Safe fallback shown: the model failed twice. Verify the matched policy and draft carefully; explicit approval is mandatory.
- Audit history unavailable: the database migration is missing; reviews can still run, but the operator should notify the maintainer.

## Quality check before sending

- Is the reply grounded in the displayed policy?
- Does it avoid claims about actions that have not occurred?
- Are missing order details requested?
- Is human approval shown for consequential cases?
- Does the tone remain calm and neutral?
