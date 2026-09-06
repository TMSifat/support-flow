# SupportFlow Architecture

## System goal

Convert one unstructured customer-support message into a policy-grounded, reviewable response without allowing the model to make consequential promises or actions.

## End-to-end flow

1. A non-technical operator pastes a ticket into the web interface.
2. The API validates message presence and length.
3. Sensitive content such as exposed passwords or full card numbers is redacted before model inference.
4. Keyword retrieval selects the most relevant policy from the versioned knowledge base.
5. Deterministic rules identify legal, security, refund, replacement, cancellation, compatibility, and delivery risks.
6. The local Ollama model produces a structured classification, rationale, facts, missing information, and reply draft.
7. The validator checks category, urgency, approval state, and unsupported-action phrases.
8. Deterministic guardrails override unsafe model decisions and replace an unsafe draft with a safe category template.
9. The interface shows the policy, confidence, approval boundary, and editable reply.
10. The operator retains approval and sending authority.

## Components

| Component                | Responsibility                                                             |
| ------------------------ | -------------------------------------------------------------------------- |
| Web workspace            | Ticket input, review result, editing, approval                             |
| Review API               | Input contract, orchestration, useful error responses                      |
| Policy retriever         | Selects a relevant policy from the supplied knowledge base                 |
| Ollama / Llama 3.1 8B    | Classification, extraction, recommended action, draft generation           |
| Deterministic guardrails | Redaction, minimum urgency, mandatory approval, unsafe-claim detection     |
| D1 audit log             | Persists minimal review metadata without storing customer messages         |
| Evaluation runner        | Executes the frozen 12-case suite and saves comparable evidence            |
| Result pack              | Stores baseline, final results, failure analysis, and submission documents |

## Integrations

1. **Ollama HTTP API** at a configurable local URL for model inference.
2. **Versioned policy knowledge base** loaded from data/knowledge-base.json for retrieval-grounded generation.
3. **D1 database** for durable, privacy-minimized audit metadata.

## Data contract

Input:

- message: required non-empty string, maximum 5,000 characters

Output:

- category
- urgency
- confidence
- facts
- missing_information
- policy_matches
- recommended_action
- requires_human_approval
- approval_reason
- draft_reply
- validation_warnings
- processing_time_ms
- model

## Human approval boundary

Approval is mandatory for refunds, replacements, delivery promises, order cancellation, legal or safety issues, account security, payment security, unknown compatibility, and other high-risk or low-confidence cases. The system never sends email or performs financial/account actions.

## Fallbacks and failure handling

- Invalid input returns a specific 400 response.
- Unavailable model returns a specific 503 response.
- Invalid model JSON triggers one retry.
- Unsafe action claims trigger a deterministic safe-draft fallback.
- Policy and rule decisions remain available independently of model wording.

## Privacy and permissions

- Passwords and card-number patterns are redacted before inference.
- The local model keeps inference on the user’s computer.
- No reply is sent automatically.
- Secrets and machine-specific endpoints are configuration, not source code.
