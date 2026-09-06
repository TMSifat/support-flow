# SupportFlow evidence pack

Start with [current remediation status](remediation-status.md), [comparison](comparison.md), [rubric v2](evaluation-rubric.md), [case study](case-study.md) and [submission checklist](submission-checklist.md).

The [five-minute demo](demo.md) includes live flows, measured results and limitations, with explicit automated/synthetic disclosure.

Current raw evidence:

- baseline-results.json and final-results.json: same common evaluator, explicit provenance, no automatic human review.
- day-4-challenge-after.json: current live challenge regression.
- hardening-results.json: new mixed-intent/privacy live cases.
- hardening-regression.json: before/after controlled engine tests and evaluator negative checks.
- browser-verification.json: automated UI, approval, race, clipboard and WebMCP checks.
- clean-bootstrap-verification.json: fresh dependency install, tests, D1 setup and build without Git history on the current Windows machine.

Architecture, operator-runbook, AI-collaboration-note and adoption-plan explain operation and boundaries. Handoff-acceptance is an uncompleted independent-user form.

Original day-by-day documents are labelled historical. Candidate-signoff and old proxy screenshots describe earlier activity and do not approve new results. History contains previous raw results, including failed runs, and the earlier engine fixture used for reproducible regression tests. Old v1 scores are not comparable with current v2 numbers.
