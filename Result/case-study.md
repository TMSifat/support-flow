# SupportFlow — case study

## User, problem and scope

The intended user is a non-technical operator at a small e-commerce store. They repeatedly classify a ticket, judge urgency, look up policy, draft a reply, identify actions needing approval and record the review. A synthetic store assumes 20–50 English messages daily; actual volume and pain have not been observed in a real team. Synthetic inputs are allowed by the brief and are disclosed.

The five-day scope is one pasted message through a reviewable reply. Non-goals: sending messages, refunds, replacements, cancellation execution, account changes, live order/inventory/payment lookup, attachments and other languages. The workflow ends with an operator reviewing, editing, approving where required and copying a draft. Consequential actions remain external human responsibilities.

## Architecture and trade-offs

A compact web UI calls a validated API. The engine redacts named secrets, recognizes risk and retrieves a versioned policy. Ollama returns a schema-validated proposal; one invalid attempt retries and a second failure yields a zero-confidence, approval-required fallback. D1 stores review metadata without customer text.

Final replies/actions are policy templates. Parsed order IDs personalize them without claiming an order lookup. The operator sees provided excerpts/identifiers separately from remaining verification. Model text is not sent as an unrestricted final reply. This favors predictable wording over personalization. The local model avoids external API charges but introduces installation/resource costs and latency.

Recognized requests remain stable against ordinary model category errors. Legal/account/payment model signals may raise priority, and a critical result always requires review. Novel wording with no deterministic category can use the model category. Estimates are uncalibrated. Approval is a UI acknowledgement, not a durable approval/sending record.

## Baseline and measurements

Evaluator v3 uses a common eight-point quality score across a generic prompt, a policy-aware prompt and SupportFlow on 11 nonempty original cases. Blank validation is separate. Four final-system suites total 50 synthetic development/regression cases. All current final release checks pass, but these are not unseen generalization results. Raw runs, source/evaluator/knowledge hashes and failed earlier runs are retained.

The original suite passes even with a neutral model stub: rules/templates explain that gain. A no-inference ablation on new semantic paraphrases measures where the model helps. This is reported directly in [system comparison](system-comparison.md), alongside the policy-aware baseline. No human-time saving is inferred from HTTP latency.

Order-number extraction is measured on 18 new cases (100% in the current run); two cases also assert required identifier facts. This is narrow field coverage, not broad fact-extraction accuracy.

## Failures, causes and changes

- “issue” and “suede” matched an unbounded “sue” regex. Token boundaries fixed the false legal escalation.
- An injury plus a routine return bypassed approval. Expanded injury recognition and critical-model precedence close the tested escape.
- Address changes were classified as tracking delays. Address-edit intents now use order/fulfillment verification and mandatory approval.
- A password suffix survived punctuation and an order number containing “is” was missed. Complete-token redaction and shared identifier parsing fix both tested failures.
- “Five items” counted as tracking duration. Duration recognition now requires tracking context; ambiguous calendar intervals require verification.
- The scorer accepted a forbidden lost-parcel claim. V3 explicitly maps every original prohibition and tests known-bad examples.
- During these fixes, live inference misclassified an explicit refund and a benign tracking case; ordinary model proposals no longer overwrite recognized requests. Additional injury-category definitions corrected another semantic failure. Failed runs were kept, not erased.

Controlled shared behavioral tests improved from 4/18 to 18/18; new schema capabilities were excluded from that comparison. The earlier 20-case fault suite still passes. See the raw regression and current live files.

## AI collaboration and human judgment

AI performed substantial implementation, test creation, automated execution and documentation. The candidate historically rejected an over-designed interface and chose a compact operational presentation. The collaboration note discloses AI work, rejected results and decisions requiring human ownership. Current outputs are not automatically signed off. The candidate must understand and explain the architecture, evaluation and trade-offs personally.

## Remaining limitations and next two weeks

An independent participant is currently unavailable. Historical candidate-proxy activity is distinct from current-version independent operation; original screenshot files are not included as fresh evidence. Human task time, touches, adoption, setup and feedback remain unmeasured. The ready five-ticket handoff kit records observed outcomes and ties them to this version when a person is available.

Week 1: two independent operators if available, unassisted setup, five tickets each, observed times/edits/approval understanding and feedback-driven changes. Week 2: new unseen examples beyond the existing 50 regression cases, a read-only sandbox order lookup and another operator comparison. The 50% manual-touch target remains unproven. See adoption-plan.md and human-test-kit.md.
