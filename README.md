# SupportFlow

SupportFlow reviews e-commerce support tickets with a local language model, retrieves a relevant policy, applies deterministic safety rules, and keeps consequential actions under human approval.

## Run locally

Prerequisites: Node.js 22+, Ollama, and the llama3.1:8b model.

1. Install dependencies:

       npm install

2. Start the app:

       powershell -ExecutionPolicy Bypass -File scripts/start-supportflow.ps1

3. Open http://localhost:3000 and select Review ticket.

On the prepared sprint computer, dependencies and the model are already installed, so only step 2 is required.

## Core workflow

1. Paste a customer message.
2. Select Review ticket.
3. Check category, urgency, policy, confidence, and approval status.
4. Edit the draft if needed.
5. A human approves any refund, replacement, cancellation, security, legal, compatibility, or delivery-promise case.

The app does not send email or perform refunds, replacements, account changes, or carrier actions.

## Configuration

Copy .env.example to .env only when the Ollama URL or model needs to change.

- OLLAMA_BASE_URL defaults to http://127.0.0.1:11434
- OLLAMA_MODEL defaults to llama3.1:8b

No secret is required for local operation.

## Verification

Run the frozen evaluation:

    npm run day2:verify
    npm run day3:verify
    npm run day4:challenge
    npm run baseline
    npm run baseline:review
    npm run evaluate
    npm run evaluate:review
    npm run build

All generated evidence is stored in the Result folder.

## Troubleshooting

- Local model unavailable: confirm Ollama is running and llama3.1:8b appears in ollama list.
- Audit history unavailable: apply the generated D1 migration or continue using review mode; model output remains available.
- Invalid message: provide non-empty text under 5,000 characters.

## Privacy

Passwords and full card-number patterns are redacted before inference. Customer-message text is not stored in the audit database. Only review metadata such as category, policy, timing, warnings, and approval status is logged.
