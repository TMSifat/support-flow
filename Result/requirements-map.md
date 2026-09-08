# Sprint requirements — evidence map

Prepared 8 September 2026 against the five supplied sprint screenshots. **Included** means an artifact or implementation is present. **Partial/unverified** identifies requirements the evidence does not fully demonstrate. Inclusion of all five deliverable artifacts is not a claim that every assessment criterion has been satisfied.

## Day 1 — discover, map and baseline

| Requirement | Status | Evidence |
|---|---|---|
| Target user, job-to-be-done and recurring bottleneck | Included with synthetic assumptions | [Case study](case-study.md), [foundation](day-1-foundation.md) |
| Workflow map: trigger, input, judgment, tool, approval, output, exception | Included | Foundation workflow table |
| Evidence of pain | Partial | Synthetic baseline errors demonstrate a quality problem on these cases; actual volume, interviews and real-team time/rework are unavailable. |
| Baseline time and quality | Included for simple-AI baseline | [Common comparison](system-comparison.md): generic and policy-aware prompts, quality and request timing. Human baseline time is unmeasured. |
| Business-linked success metrics, explicit non-goals and five-day scope | Included | Foundation and current case study; the manual-touch target remains unproven. |
| 8–12 representative, edge and failure cases | Included | [12 original cases and expected behavior](../data/test-cases.json); 38 additional regression cases |

## Day 2 — design and working v0

| Requirement | Status | Evidence |
|---|---|---|
| Architecture and end-to-end data flow | Included | [Current architecture](architecture.md) |
| Input/output schemas and contracts | Included | [Runtime contract](../lib/support-contract.ts), [review API](../app/api/review/route.ts) |
| Model, tool, storage and interface choices with rationale | Included | Architecture, [design record](day-2-design-v0.md), case study |
| Approval, fallback, privacy and permission boundaries | Included | Architecture, [engine](../lib/support-engine.ts), [runbook](operator-runbook.md) |
| Evaluation rubric and pass/fail criteria | Included | [Evaluator-v3 rubric](evaluation-rubric.md), [executable evaluator](../scripts/evaluation-core.mjs) |
| One input through the complete flow | Included for synthetic input | [Historical v0 evidence](day-2-v0-evidence.json), [current results](final-results.json), demo. No production customer input is claimed. |

## Day 3 — working core

| Requirement | Status | Evidence |
|---|---|---|
| Working core from trigger to final output | Included | Review API, engine, [browser verification](browser-verification.json), demo |
| At least two real data-source/tool integrations | Included | Ollama HTTP inference and D1 audit storage, plus versioned JSON policy context |
| Validation, structured outputs, logs and useful errors | Included | API, runtime schema, audit status, retries/fallback and regression checks |
| Configuration and secrets separated from code | Included | [Example environment](../.env.example), [launcher](../scripts/start-supportflow.ps1) |
| One non-developer interface | Included; human usability unverified | Web workspace and runbook |
| First execution by target/proxy user | Historical evidence only | [Earlier candidate-proxy record](day-4-proxy-feedback-form.md). Original screenshots are not included; current non-builder acceptance remains unverified. |

## Day 4 — evaluation and hardening

| Requirement | Status | Evidence |
|---|---|---|
| Full test-set results and baseline comparison | Included | System comparison and four raw result suites: 50/50 saved final cases |
| Quality, latency, cost and human-intervention metrics | Partial | Automated quality, HTTP latency, approval rate and external model API cost are measured. Actual human time and touches are not; approval rate is not manual-touch rate. Hardware/electricity cost is excluded. |
| At least three failures with root-cause analysis | Included | Case study, [remediation analysis](remediation-status.md), [failure history](failure-analysis.md) |
| Appropriate retries, fallbacks, validation, confidence or approval | Included | Engine, fault injection, browser checks; confidence is disclosed as uncalibrated. |
| Before/after regression results | Included | [Remediation regression](remediation-regression.json), [hardening regression](hardening-regression.json), challenge before/after files |
| Target/proxy-user feedback and changes in response | Partial | Historical candidate/UI feedback and corrections exist; [current human observations](human-observations.json) remain empty. |

## Day 5 — handoff and presentation

| Requirement | Status | Evidence |
|---|---|---|
| Live demo, runnable repository or exported workflow | Included | Runnable local source is the selected delivery format; the brief does not require online hosting. |
| One-command or three-step setup | Included | [README](../README.md), Windows launcher, [agent-run clean bootstrap](clean-bootstrap-verification.json) on the existing machine |
| User README and operator runbook | Included | README and runbook |
| Architecture, flow, evaluation, results and limitations documentation | Included | [Submission guide](START-HERE.md) indexes current documents. |
| Five-minute screen-recorded demo | Included | [300-second video](supportflow-demo.webm), [manifest](demo-manifest.json); silent automated local demonstration using synthetic inputs. Candidate viewing is pending. |
| Portfolio-ready case study | Included | Case study covers all seven requested topics, including the next iteration. |
| First-two-week adoption/quality metrics and iteration plan | Plan included; observations pending | [Adoption plan](adoption-plan.md) defines targets, methods and next work. Two weeks of adoption have not been observed. |
| Another person can understand, run and operate the system without the builder | Partial/unverified | Handoff materials are prepared; [independent acceptance](handoff-acceptance.md) is pending. |

## Required deliverables and evaluation categories

The [submission guide](START-HERE.md) indexes all five required artifacts: working system, evaluation package, case study, AI collaboration note and demo. The [AI note](ai-collaboration-note.md) covers tools, delegation, verification, rejected/corrected outputs and candidate decisions. The [demo details](demo.md) document the input-to-output flow, interface, failure handling, measured results and limitations.

| Weight | Evaluation category | Evidence and remaining qualification |
|---|---|---|
| 15% | Problem leverage and scope | Defined workflow, scope and synthetic baseline; real-user pain and savings are unverified. |
| 20% | Architecture and engineering | Explicit boundaries, contracts, integrations, exceptions and trade-offs. |
| 20% | Working product and reliability | Saved live runs, automated checks and clean bootstrap; independent reproduction is untested. |
| 20% | Evaluation and learning loop | Common baselines, failure analysis and before/after evidence; actual human intervention is unmeasured. |
| 15% | Non-developer UX and adoption | UI, approval controls, README and runbook; current non-builder operation and adoption remain unverified. |
| 10% | Ownership and communication | AI note, case study, demo and explanation brief; personal understanding and [current result/video review](current-candidate-review.json) require the candidate. |

These are evidence assessments, not awarded scores. The actual Monday–Friday participation schedule is not verified; eight hours daily is a recommendation in the brief. Portal submission has no recorded confirmation. Historical completed labels do not replace current evidence.
