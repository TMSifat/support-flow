# Human handoff test — ready to run, not yet performed

No independent operator is currently available (candidate confirmed 7 September 2026). This kit enables the remaining evidence; it does not claim the session happened.

Version to test: engine SHA-256 `d35c9c0bbfee0944aa451a7cfc5289dee5c9d9363df2d6306d16feb1aa31d294`; result SHA-256 `9af0469df788e9800edeb171bf6aa172ac05fb7896bf6d929c3c07556f6e4baa`.

## Instructions for the participant

Use the root README to start SupportFlow. Do not ask the builder to explain the interface. Record setup time and anything unclear. Only synthetic messages are used. Never send a reply or perform a real refund, order or account action.

For each ticket below, compare your usual policy-assisted drafting method with SupportFlow. Start timing when you begin reading and stop when you have a reviewed, edited, ready-to-copy draft. Include policy lookup, edits and approval decisions. Alternate which method you use first; repeated tickets have a learning effect, so disclose it. This five-ticket exercise is a small pilot, not a rigorous field study.

Read the matching policies in data/knowledge-base.json for the previous method. In SupportFlow, read the matched policy, check provided details and remaining verification, edit the draft if needed, approve consequential replies and copy. Edit an approved consequential draft once and verify that approval resets.

Fill Result/human-observations.json with observed seconds, edits, task completion, approval understanding, unsafe outputs and your actual feedback. Leave unknowns null. At least one concrete confusing point or “none observed” should be recorded. Run `npm run handoff:summarize` after collecting the data; a blank file stays pending.

## T02

I received order #5102 ten days ago and the unused shirt does not fit. How can I return it?

## T04

Tracking for order #9930 has not changed in six business days. Where is it?

## T08

I think someone accessed my account. My password is Summer2026. Can you check?

## T06

Please cancel my order before it ships.

## T11

You idiots sent garbage again. Fix this now.

## Observer-only acceptance checks

T02: normal return instructions, 30 days/proof of purchase, no extra approval. T04: shipping delay, verify carrier status and approve. T08: critical account concern, password absent from the result, approve. T06: order number and fulfillment verification, approve. T11: calm complaint response, no extra approval. No case performs external actions.

Record a real change requested/made after feedback. A participant repeating coached clicks is not unassisted operation. More operators, new tickets and counterbalanced order are needed before claiming general savings.
