import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const appUrl = process.env.SUPPORTFLOW_URL || 'http://localhost:3000';
const outputPath = path.join(process.cwd(), 'Result', 'day-2-v0-evidence.json');
const representativeMessage =
  'My order #4821 arrived in red, but I ordered blue. I need it before Friday for a birthday. Send the replacement today.';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function post(body) {
  const started = performance.now();
  const response = await fetch(`${appUrl}/api/review`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return {
    status: response.status,
    elapsed_ms: Math.round(performance.now() - started),
    payload: await response.json(),
  };
}

async function main() {
  const happyPath = await post({ message: representativeMessage });
  assert(
    happyPath.status === 200,
    `Expected 200, received ${happyPath.status}`,
  );
  assert(
    happyPath.payload.category === 'wrong_item',
    'Expected wrong_item category',
  );
  assert(happyPath.payload.urgency === 'high', 'Expected high urgency');
  assert(
    happyPath.payload.policy_matches?.[0]?.id === 'FUL-02',
    'Expected FUL-02 policy',
  );
  assert(
    happyPath.payload.requires_human_approval === true,
    'Expected human approval',
  );
  assert(
    typeof happyPath.payload.draft_reply === 'string',
    'Expected a reply draft',
  );

  const invalidInput = await post({ message: '' });
  assert(
    invalidInput.status === 400,
    `Expected 400, received ${invalidInput.status}`,
  );
  assert(
    invalidInput.payload.code === 'MESSAGE_REQUIRED',
    'Expected MESSAGE_REQUIRED code',
  );

  const unmatchedRequest = await post({
    message: 'Where can I find your store opening hours?',
  });
  assert(
    unmatchedRequest.status === 200,
    `Expected 200, received ${unmatchedRequest.status}`,
  );
  assert(
    unmatchedRequest.payload.policy_matches?.[0]?.id === 'GEN-00',
    'Expected GEN-00 fallback policy',
  );

  const evidence = {
    run_status: 'complete',
    completed_at: new Date().toISOString(),
    system: 'SupportFlow Day 2 v0',
    environment: 'local',
    representative_flow: {
      input: representativeMessage,
      http_status: happyPath.status,
      elapsed_ms: happyPath.elapsed_ms,
      output: happyPath.payload,
      checks: {
        category: 'pass',
        urgency: 'pass',
        policy_retrieval: 'pass',
        human_approval: 'pass',
        structured_draft: 'pass',
      },
    },
    boundary_checks: {
      empty_input: {
        http_status: invalidInput.status,
        error_code: invalidInput.payload.code,
        result: 'pass',
      },
      unmatched_policy: {
        http_status: unmatchedRequest.status,
        policy_id: unmatchedRequest.payload.policy_matches?.[0]?.id,
        result: 'pass',
      },
    },
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  console.log(`Day 2 v0 verified. Evidence saved to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
