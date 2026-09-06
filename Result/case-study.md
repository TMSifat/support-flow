# SupportFlow — Case Study

## Summary

SupportFlow is a local-first support review system for a non-technical e-commerce operator. It turns an unstructured ticket into a policy-grounded classification, urgency decision, approval boundary, and editable reply. On a frozen synthetic 12-case suite, the generic-prompt baseline passed the complete rubric in 1 case; SupportFlow passed all 12.

## User and problem

The proxy user is an operator at a small e-commerce store handling 20–50 English-language email tickets per day. For every message, the operator must interpret the request, assign priority, find a policy, draft a reply, identify risk, and record the result.

The repeated work is slow and inconsistent. A generic AI reply may sound helpful while inventing an order check, refund, replacement, account action, or delivery promise.

No real support team was available during the sprint. The workflow, store, policies, and tickets are synthetic. This limitation is explicit rather than presented as real user research.

## Existing workflow and baseline

The baseline used one generic support prompt with the same local Llama 3.1 8B model. It had no policy retrieval, deterministic approval rules, sensitive-data redaction, validator, retry, or audit log.

Baseline results:

- Category accuracy: 75%
- Urgency accuracy: 75%
- Approval accuracy: 75%
- Automated pass rate: 42%
- Full-rubric pass rate: 8% (1/12)
- Critical failures: 3
- Median processing time: 1.60 seconds

## Scope and non-goals

The v1 system accepts one pasted ticket, retrieves one policy, produces one structured review and draft, and records privacy-minimized audit metadata.

It does not send email, process a refund or replacement, query live orders or inventory, support attachments, or replace human judgment.

## Architecture and trade-offs

The workflow combines three layers:

1. Local Llama 3.1 8B generates classification, extracted facts, missing information, recommended action, and reply.
2. A versioned policy knowledge base grounds the response.
3. Deterministic rules redact sensitive data, enforce minimum urgency and approval, validate required content, detect unsupported claims, and replace unsafe drafts.

A local model avoids API cost and keeps inference on the sprint computer. The trade-off is that a public hosted version cannot use the computer’s Ollama service. The accepted reproducible-local-project format is therefore the primary delivery path.

## Work delegated to AI and judgment retained by humans

AI work:

- Ticket classification
- Fact and missing-information extraction
- Policy-informed draft generation
- Recommended next action

Human work:

- Refund, replacement, cancellation, security, legal, compatibility, and delivery decisions
- Verification against live order or account systems
- Editing and final approval
- Sending the response

## Failures and changes

The baseline promised Friday delivery, invented account-lock and reset-link actions, and used risky legal wording. During hardening, final-model drafts also omitted policy details, claimed unavailable checks, and over-escalated safe cases.

The system added policy retrieval, capability boundaries, sensitive-data redaction, deterministic risk decisions, required-content checks, one retry for invalid JSON, and safe-draft fallback. A separate 12-case paraphrase and multi-intent challenge suite initially passed only 2/12; after root-cause fixes it passed 12/12 while the original frozen suite remained 12/12.

## Final results

- Structured output: 100%
- Category accuracy: 100%
- Urgency accuracy: 100%
- Approval accuracy: 100%
- Policy retrieval accuracy: 100%
- Full-rubric pass rate: 100% (12/12)
- Critical failures after correction: 0
- Median processing time: 2.38 seconds

The system added about 0.78 seconds of median latency while eliminating the three critical baseline failures. Four unsafe or incomplete model drafts in the final run were corrected by deterministic guardrails before operator review.

## Limitations

- Only 12 synthetic English-language cases were tested.
- Keyword retrieval can fail on novel or multi-intent tickets.
- Results may change with a different model or prompt.
- No live order, inventory, carrier, payment, or email system is connected.
- The candidate completed the visible workflow as a disclosed proxy operator; independent target-user usability testing has not been performed.

## Next two-week iteration

Week 1:

- Ask two proxy operators to complete five tickets each without assistance.
- Measure time-to-draft, correction count, approval clarity, and task completion.
- Add multi-intent and ambiguous tickets to the frozen regression set.
- Improve retrieval using weighted phrase and semantic similarity tests.

Week 2:

- Add a read-only sandbox order lookup.
- Add CSV export for audit review.
- Measure real operator acceptance and correction rates.
- Set release gates for zero critical failures and at least 95% escalation recall on an expanded 50-case set.
