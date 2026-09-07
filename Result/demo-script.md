# Current five-minute candidate presentation guide

Use this with the current recording/results. Speak in your own words; do not claim an independent operator session or time savings that were not measured.

## 0:00–0:35 — User and baseline

A small-store operator repeats classification, policy lookup, drafting and approval decisions. The store and tickets are synthetic; assumed daily volume is not observed. Explain the generic prompt baseline and why review boundaries matter.

## 0:35–1:55 — Live flow

Paste T02, run Review ticket and expand the policy. Show the provided order ID, remaining verification and policy-template reply. Scroll the whole draft into view and edit it. Explain that customer-provided facts are not externally verified.

## 1:55–3:10 — Failure, correction and approval

Paste: Your charger burned my hand. I want to return the unused accessories. Explain how the earlier self-service rule suppressed approval. Show the corrected critical safety policy and blocked copy. Approve, edit, then show approval reset. No real action or message is sent.

## 3:10–3:40 — Validation and fallback

Clear the input and show the disabled review action. Explain that invalid model output retries once, then returns a visibly labelled zero-confidence fallback requiring approval. The controlled tests exercise this; the recording does not pretend to be an independent human trial.

## 3:40–4:23 — Measured results

Current common evaluator: generic prompt 0/11; final 11/11. Median HTTP times 1.62 s and 2.46 s. All 50 final regression cases pass. New controlled behavioral checks improved 4/18 to 18/18. Explain the policy-aware baseline and no-inference comparison: existing rules cover the original cases, while the model helps on three new semantic paraphrases.

## 4:23–5:00 — Ownership, limitations and next step

Explain one personally rejected AI result and one architectural trade-off. Be precise: templates trade personalization for predictable wording; no live order/action integration exists; the set was used in development. A non-builder is currently unavailable, so human setup/time/edits/adoption remain pending. Show the ready human test kit and next-two-week plan.

Current result SHA-256: 9af0469df788e9800edeb171bf6aa172ac05fb7896bf6d929c3c07556f6e4baa.
