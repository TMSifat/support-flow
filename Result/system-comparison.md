# What the system improves — evaluator v3

## Same original inputs and common scorer

The three live conditions use the same model, seed, temperature, token limit and 11 non-empty messages. The policy-aware baseline also receives the supplied knowledge base and operating boundary. Blank validation is separate. The scorer applies the same eight-point common checks; enriched fields do not lower either prompt baseline score.

| Condition | Common passes | Category accuracy | Critical check failures | Median HTTP time |
|---|---:|---:|---:|---:|
| Generic prompt | 0/11 | 82% | 8 | 1.62 s |
| Policy-aware prompt | 2/11 | 73% | 4 | 1.77 s |
| SupportFlow | 11/11 | 100% | 0 | 2.46 s |

## Final system versus no-inference ablation

A constant neutral model response is fed to the actual rule/template engine. This isolates reliance on model proposals; it is not an optimized independent rules implementation. In-process timing is excluded from the HTTP comparison.

| Suite | Model-backed common passes | No-inference common passes | Final release checks |
|---|---:|---:|---:|
| original | 11/11 | 11/11 | 12/12 |
| challenge | 12/12 | 12/12 | 12/12 |
| hardening | 8/8 | 8/8 | 8/8 |
| remediation | 18/18 | 15/18 | 18/18 |

Narrow extraction on the 18 remediation cases: order_number accuracy 100%; required identifier facts on two cases 100%. Both the parsed order field and facts must agree with supplied text. This does not measure every useful fact.

The original suite can be handled by rules and templates alone. The added semantic paraphrases test model contribution; they were used during development and are not unseen generalization evidence. Templates remain the final drafting method, with operator personalization and consequential judgment.

Human task time, actual edits/touches, installation by another person and adoption are unmeasured. The supplied handoff kit measures these when a real participant is available. No real-world time-saving percentage is claimed.

## Reproduction and provenance

Run npm run evaluate:all with SupportFlow and Ollama running. Failed final suites stop the command. Prior raw runs are retained. Each raw file includes source/evaluator/suite/knowledge/runner hashes and the result hash. The two earlier incomplete remediation runs are retained as failure evidence.

- baseline: result SHA-256 5abecc6b246fc72166502cbd6c99dfaecfa1ecd742c414e52f08c3167c3be4a3
- policy-baseline: result SHA-256 032d5dabd61f3043bcb476d28af31989222916f842ae09fe321725168661c9e6
- final: result SHA-256 9af0469df788e9800edeb171bf6aa172ac05fb7896bf6d929c3c07556f6e4baa
- challenge: result SHA-256 6d1c589e0f95a4cd69adbf18552bdd9b1b0491367f7141bed219c98a59421e60
- hardening: result SHA-256 d52c41ba6dc13e78492594603187b138a5e3be3ce3e3b04516957e2b4c53b092
- remediation: result SHA-256 3e5752160355ebd718e982478fed18a4f235ec5a3922348f1cc67729a418fe5b
