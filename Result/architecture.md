# SupportFlow architecture — current

## Flow and boundaries

1. The operator enters one message (required string, 1–5,000 characters after meaningful-content validation).
2. The API rejects invalid JSON, blank messages and oversized input.
3. Named password/passcode/PIN/security-code values and full card-number patterns are redacted before inference.
4. Token-aware risk rules select a primary category and policy. Injury language, address changes, tracking intervals and provided order identifiers have explicit tests. Tracking dates/calendar days require verification; item quantity does not count as delay. High-risk urgency takes precedence over a recent tracking pause.
5. Ollama receives the redacted input, policy and explicit JSON schema. Runtime validation rejects null, arrays, primitives, incomplete objects and invalid field types.
6. A failed response is retried once; a second failure returns zero model confidence, a visible warning and mandatory approval.
7. Versioned templates produce the final reply and recommended action. Recognized order IDs personalize templates without claiming an external lookup. Verification items are derived independently. Model facts survive only as exact nonempty quotes in the redacted input; a deterministically extracted order ID is also retained as a provided fact. The UI distinguishes customer-provided details from items still to verify.
8. D1 records privacy-minimized review metadata. A logging failure is visible but does not discard the review.
9. The operator can read the policy, edit the template, approve when required and copy. Draft/ticket edits invalidate approval; superseded responses cannot overwrite newer input.

## Integrations

Ollama HTTP API provides local inference. D1 provides local durable audit metadata. The versioned JSON knowledge base provides policies. There is no live order, inventory, payment, account or email integration.

## Output contract

category; urgency; confidence (uncalibrated model estimate); facts (grounded excerpts plus parsed order identifier); extracted_fields.order_number (string or null); missing_information (checks still requiring verification); policy_matches with id/title/content; recommended_action; requires_human_approval; approval_reason; draft_reply; validation_warnings; processing_time_ms; model; generation_status (model or deterministic_fallback); draft_source (policy_template); audit_status (recorded or unavailable).

Input is message only. Earlier ticket_id/received_at design fields were dropped from v1. Audit records receive their own generated ID and timestamp.

## Human decisions

Refunds, replacements, cancellations, address changes, sensitive/security/legal issues and unsupported compatibility require human approval. Safe standard-return instructions, short tracking pauses and non-threatening complaints may use a reviewed policy template without an additional approval click, even with a low model estimate. A critical model signal always disables this exception. Higher-priority legal/account/payment model proposals can upgrade a known intent; other model categories fill unmatched intents without overriding explicit requests. Unknown/unclear cases and outage fallbacks require approval.

Approval is a UI acknowledgement, not proof that verification or sending occurred; it is not durably audited. Operator checks and human sending authority remain outside the app. Missing verification items can remain visible until the operator checks external systems.

## Trade-offs and limitations

Policy templates reduce personalization and do not cover every novel issue. Redaction and intent detection are pattern-based and cannot guarantee recognition of all forms. Model proposals and estimates are not ground truth. Non-English messages and attachments are outside scope. The final evaluator is independent of production code but still incomplete; new cases and human review remain necessary. Local hosting requires the machine's Ollama service; no public hosting is claimed.
