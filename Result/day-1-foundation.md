# SupportFlow — Day 1 Foundation

Date: 2026-09-05
Sprint: 5-Day Remote AI OS Sprint
Status: Day 1 complete; scope locked for v1

## 1. Target user and job to be done

**Target user:** A non-technical customer-support operator at a small e-commerce store handling 20–50 English-language email tickets per day.

**Job to be done:** When a customer message arrives, the operator needs to identify the issue, judge urgency and risk, find the relevant policy, prepare a safe response, and decide whether a human must approve the action.

**Proxy-user disclosure:** We do not currently have access to a real support team. The workflow and data are synthetic but modeled on common e-commerce support patterns. The candidate will act as the proxy operator. This assumption must remain visible in the case study and demo.

## 2. Recurring bottleneck

The operator repeats the same six steps for every ticket:

1. Read and understand an unstructured message.
2. Assign a category and urgency.
3. Search store policies.
4. Draft a response.
5. Identify promises or actions that need approval.
6. Record the result.

This creates avoidable lookup time, inconsistent classification, unsafe promises, and repeated rewriting.

## 3. Current workflow map

| Stage     | Current manual/simple-ChatGPT workflow             | Main risk                                         |
| --------- | -------------------------------------------------- | ------------------------------------------------- |
| Trigger   | A support message arrives                          | Tickets can be missed or delayed                  |
| Input     | Free-text message and optional order number        | Important details may be incomplete               |
| Judgment  | Operator infers intent and urgency                 | Inconsistent labels and prioritization            |
| Tool      | Inbox, policy document, and a blank reply composer | Context is scattered                              |
| Approval  | Operator informally decides what needs review      | Refunds or promises may be sent without authority |
| Output    | Reply plus internal note                           | Rationale and source policy are often absent      |
| Exception | Operator asks a manager or improvises              | Slow handling and inconsistent outcomes           |

## 4. Evidence of pain

Because a real operator is unavailable, these are **pre-registered proxy hypotheses**, not claimed observations:

- Frequent: the workflow repeats for every ticket.
- Time-consuming: policy lookup and response drafting are repeated even for known issue types.
- Rework-prone: a draft may need rewriting when the wrong policy or tone is used.
- Risky: refunds, replacements, legal threats, account-security issues, and delivery promises require clear approval boundaries.
- Hard to audit: a normal email reply does not explain which policy was used or why a case was escalated.

The 12-case baseline run tested these hypotheses and produced measurable evidence:

| Pain signal           | Measured baseline evidence                                  |
| --------------------- | ----------------------------------------------------------- |
| Rework                | Only 1 of 11 generated replies was send-ready without edits |
| Errors                | 3 critical and 7 major failures were found                  |
| Inconsistent judgment | Category, urgency, and approval accuracy were each 75%      |
| Reliability           | Only 1 of 12 cases passed the complete rubric               |
| Time                  | Median model-processing time was 1.60 seconds per case      |

Frequency remains a disclosed proxy assumption because no real operator or production inbox was available.

## 5. Baseline definition

The baseline is **one-shot generic AI assistance**:

- Input: only the raw customer message.
- Prompt: “Classify this support message and draft a helpful reply.”
- No policy retrieval.
- Minimal JSON fields requested only so results can be measured; no schema validator or repair layer.
- No confidence or escalation rules.
- No validation, logging, or human-approval gate.

### Baseline measurement protocol and result

All 12 frozen test cases were run through the baseline once. The run recorded:

- completion time per case;
- correct category;
- correct urgency;
- required escalation detected;
- unsupported promise or invented policy;
- required facts captured;
- manual edits needed before sending.

| Baseline metric            | Measured result |
| -------------------------- | --------------: |
| Cases completed            |           12/12 |
| Valid structured output    |             92% |
| Category accuracy          |             75% |
| Urgency accuracy           |             75% |
| Approval-decision accuracy |             75% |
| Automated pass rate        |             42% |
| Full-rubric pass rate      |       8% (1/12) |
| Send-ready without edits   |       9% (1/11) |
| Median processing time     |    1.60 seconds |
| Critical failures          |               3 |

The raw outputs, per-case timing, checks, and manual review are retained in Result/baseline-results.json. The same frozen test set and rubric are used for the final system.

## 6. Success metrics

| Metric                 |                              v1 target | Why it matters                                       |
| ---------------------- | -------------------------------------: | ---------------------------------------------------- |
| Category accuracy      |                          ≥ 83% (10/12) | Reduces routing errors                               |
| Escalation recall      |      100% on required-escalation cases | Prevents risky autonomous actions                    |
| Unsupported promises   |                                      0 | Protects customer trust                              |
| Required-field capture |                                  ≥ 90% | Reduces follow-up work                               |
| Test pass rate         |                          ≥ 83% (10/12) | Demonstrates reliability across conditions           |
| Median processing time | < 15 seconds, excluding human approval | Demonstrates operational speed                       |
| Manual-touch rate      |                     ≤ 50% of all cases | Preserves automation value without removing judgment |

**Guardrail:** Safety and correct escalation take priority over automation rate.

## 7. v1 scope

The Day 5 system will:

- accept one pasted ticket in a simple web workspace;
- classify category and urgency;
- retrieve a matching policy from the supplied knowledge base;
- produce structured evidence and a reply draft;
- block or escalate high-risk actions;
- validate the result and show useful errors;
- retain an audit record;
- allow a non-developer to approve, edit, and copy a draft.

### Success-target outcome

The quality and safety targets were met on the recorded frozen suite. The manual-touch target was not: 8 of 11 non-empty cases required explicit approval (73% versus the target of 50% or less). Because the suite deliberately over-samples consequential cases, this does not estimate production workload, but it also does not demonstrate reduced manual touch. Independent usage data is required before making that business-value claim.

## 8. Explicit non-goals

- Sending real customer email automatically.
- Processing payment, refunds, or replacements.
- Looking up live order or inventory data.
- Supporting languages other than English.
- Training or fine-tuning a model.
- Handling attachments or images.
- Replacing a support manager’s judgment.

These boundaries keep the project achievable and safe within five days.

## 9. Inputs, outputs, and data contract

### Required input

- ticket_id: stable unique identifier
- message: non-empty customer message
- received_at: ISO timestamp

### Optional input

- customer_name
- order_id
- channel

### Structured output

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

## 10. Approval boundary

Human approval is mandatory for:

- refunds or credits;
- replacements and reshipments;
- delivery-date guarantees;
- legal threats or chargebacks;
- account-security or payment-data issues;
- abusive or self-harm content;
- confidence below the configured threshold;
- missing facts that could materially change the response.

The AI may classify, retrieve, summarize, and draft. A human retains consequential judgment and sending authority.

## 11. Day 1 exit check

- Realistic recurring bottleneck: yes, disclosed as a proxy workflow.
- Measurable baseline: complete across all 12 frozen cases, including timing and manual quality review.
- Evidence of pain: baseline errors, rework, inconsistent decisions, and critical failures recorded.
- Frozen evaluation set: 12 representative, edge, and failure cases in data/test-cases.json.
- Success criteria: explicit and connected to speed, safety, and reduced manual work.
- Scope: small enough for Day 5, with explicit non-goals.
