# SupportFlow — Day 2 System Design and v0

Date: 2026-09-05
Sprint: 5-Day Remote AI OS Sprint
Status: Day 2 complete; local v0 verified

## 1. Architecture and end-to-end data flow

SupportFlow is a local-first review system for one support ticket at a time.

1. A non-technical operator pastes a customer message into the web workspace.
2. `POST /api/review` rejects invalid JSON, empty messages, and messages over 5,000 characters.
3. Password and full-card-number patterns are redacted before model inference.
4. Deterministic keyword retrieval selects a versioned store policy. An unmatched request receives the general triage policy instead of an unrelated policy.
5. Deterministic rules calculate minimum urgency, mandatory approval, and safety reasons.
6. The local Llama 3.1 8B model returns classification, extracted facts, missing information, a recommended action, and a reply draft as JSON.
7. Invalid model JSON receives one retry. Output coercion and validators then enforce the contract.
8. Unsafe claims or missing required content replace the model draft with a category-specific safe draft.
9. The API returns a structured review and writes privacy-minimized metadata to D1 when the database is available.
10. The operator reviews or edits the draft, explicitly approves it, and may copy it. Sending and consequential actions remain outside SupportFlow.

## 2. Interface and data contracts

The executable TypeScript contract is in `lib/support-contract.ts`.

### Request

`POST /api/review`

| Field     | Type   | Rules                                             |
| --------- | ------ | ------------------------------------------------- |
| `message` | string | Required after trimming; maximum 5,000 characters |

### Successful response

| Field                     | Type           | Contract                                                                                                                                                                |
| ------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `category`                | enum           | `wrong_item`, `return_refund`, `shipping_delay`, `order_change`, `payment_security`, `account_security`, `product_information`, `legal_safety`, `complaint`, or `other` |
| `urgency`                 | enum           | `normal`, `high`, or `critical`                                                                                                                                         |
| `confidence`              | integer        | 0–100                                                                                                                                                                   |
| `facts`                   | string[]       | Maximum eight normalized model facts                                                                                                                                    |
| `missing_information`     | string[]       | Maximum eight missing items                                                                                                                                             |
| `policy_matches`          | object[]       | At least one `{ id, title }` policy match, including `GEN-00` for unmatched requests                                                                                    |
| `recommended_action`      | string         | Suggested next step; never proof that an action occurred                                                                                                                |
| `requires_human_approval` | boolean        | Deterministic safety boundary combined with the model signal                                                                                                            |
| `approval_reason`         | string or null | Human-readable reason for the approval decision                                                                                                                         |
| `draft_reply`             | string         | Editable response draft                                                                                                                                                 |
| `validation_warnings`     | string[]       | Unsafe or incomplete model-output findings                                                                                                                              |
| `processing_time_ms`      | integer        | Server-side review duration                                                                                                                                             |
| `model`                   | string         | Model identifier used for the review                                                                                                                                    |
| `generation_status`       | string         | `model` or the clearly labelled `deterministic_fallback` recovery path                                                                                                  |
| `audit_status`            | string         | `recorded` or `unavailable`; review output is preserved if metadata logging fails                                                                                       |

### Error responses

| HTTP | Code               | Meaning                                                     |
| ---: | ------------------ | ----------------------------------------------------------- |
|  400 | `INVALID_JSON`     | Request body could not be parsed                            |
|  400 | `MESSAGE_REQUIRED` | Message is absent or empty                                  |
|  400 | `MESSAGE_TOO_LONG` | Message exceeds 5,000 characters                            |
|  500 | `REVIEW_FAILED`    | An unexpected review-engine error prevented a safe response |

Errors return `{ "error": "human-readable message", "code": "STABLE_CODE" }`.

## 3. Technical choices, rationale, and trade-offs

| Boundary      | Choice                                                             | Why this choice                                                                                                 | Trade-off retained                                                                |
| ------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Interface     | Single-screen React workspace                                      | A non-developer can paste, review, edit, approve, and copy without command-line knowledge                       | It is not a full inbox or multi-ticket queue                                      |
| Orchestration | Server-side review API                                             | Keeps validation, policy context, and safety rules out of the browser and provides one reproducible entry point | The API depends on a reachable model runtime                                      |
| Model         | Local Ollama with Llama 3.1 8B, temperature 0 and fixed seed       | No API secret, local processing, low cost, and repeatable evaluation                                            | Requires local installation and is not reachable from a hosted Cloudflare Worker  |
| Retrieval     | Versioned JSON policies plus deterministic keyword scoring         | Transparent, inspectable, fast, and sufficient for the seven-policy v0 corpus                                   | Keyword matching will not scale to a large or semantically complex knowledge base |
| Safety        | Deterministic rules around model output                            | High-risk approval and forbidden actions must not depend only on generative judgment                            | Rules require maintenance and can over-escalate unusual wording                   |
| Output        | Structured JSON plus deterministic coercion and fallback templates | Makes behavior measurable and gives the UI a stable contract                                                    | A safe fallback can be less personalized than the original draft                  |
| Storage       | D1 metadata-only audit record                                      | Preserves operational evidence without retaining customer-message content                                       | Draft text and approval state are not durably stored in v0                        |
| Integration   | WebMCP tool stages a review in the visible workspace               | Lets an agent initiate the same visible, human-reviewed flow                                                    | It does not bypass the operator or perform external actions                       |

## 4. Human approval, fallback, privacy, and permissions

Human approval is mandatory for refunds, credits, replacements, delivery promises, cancellations, legal or safety concerns, account or payment security, unknown compatibility, and other consequential or low-confidence cases.

The system may classify, retrieve, summarize, recommend, and draft. It may not send email, issue money, replace goods, change orders, access accounts, inspect tracking, or guarantee outcomes.

Failure handling:

- malformed requests return stable 400 errors;
- an invalid model response receives one JSON-only retry;
- invalid or unavailable model output is retried once, then returns a clearly labelled deterministic fallback that requires approval;
- unsafe or incomplete drafts are replaced with a deterministic safe response;
- an unmatched request uses `GEN-00` general triage rather than an unrelated policy;
- an unavailable audit database does not discard an otherwise valid review.

Privacy boundaries:

- exposed passwords and full-card-number patterns are redacted before inference;
- customer-message and reply text are not stored in D1;
- only review metadata is logged;
- the local runtime requires no secret by default;
- all consequential authority remains with a human operator.

## 5. Evaluation contract

The frozen 12-case suite and case-level pass rules remain in `data/test-cases.json` and `Result/evaluation-rubric.md`. The final system must be measured against the same cases and rules used for the baseline. A critical safety failure blocks release.

## 6. Verified v0 happy path

The reproducible `npm run day2:verify` check ran one representative wrong-item ticket through the live local API.

| Check                  | Observed result                     |
| ---------------------- | ----------------------------------- |
| HTTP result            | 200                                 |
| Category               | `wrong_item`                        |
| Urgency                | `high`                              |
| Policy                 | `FUL-02`                            |
| Human approval         | Required                            |
| Structured reply draft | Present                             |
| Server processing time | Under 3 seconds in the recorded run |

The same run confirmed the `MESSAGE_REQUIRED` validation contract and the `GEN-00` unmatched-policy fallback. Raw evidence is stored in `Result/day-2-v0-evidence.json`.

## 7. Runtime decision and v0 limitations

Day 2 is intentionally a **reproducible local v0**. The configured model URL defaults to `http://127.0.0.1:11434`; a Cloudflare-hosted worker cannot call the operator's localhost. A hosted version therefore requires a separately authorized remotely accessible model endpoint and a documented privacy/cost review. No live URL should be claimed until that change is made.

The input and evidence remain synthetic because no real support team was available. Approval is explicit and functional in the current browser session, but approval state and edited drafts are not persisted. Those are disclosed v0 boundaries rather than claims of production readiness.
