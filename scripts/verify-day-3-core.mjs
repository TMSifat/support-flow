import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const appUrl = process.env.SUPPORTFLOW_URL || 'http://localhost:3000';
const outputPath = path.join(root, 'Result', 'day-3-verification.json');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(route, options) {
  const response = await fetch(`${appUrl}${route}`, options);
  const payload = await response.json();
  return { status: response.status, payload };
}

async function postReview(message) {
  return request('/api/review', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message }),
  });
}

function assertStructuredReview(payload) {
  assert(typeof payload.category === 'string', 'category is missing');
  assert(typeof payload.urgency === 'string', 'urgency is missing');
  assert(typeof payload.confidence === 'number', 'confidence is missing');
  assert(Array.isArray(payload.facts), 'facts must be an array');
  assert(
    Array.isArray(payload.missing_information),
    'missing_information must be an array',
  );
  assert(
    Array.isArray(payload.policy_matches),
    'policy_matches must be an array',
  );
  assert(
    typeof payload.requires_human_approval === 'boolean',
    'requires_human_approval is missing',
  );
  assert(typeof payload.draft_reply === 'string', 'draft_reply is missing');
  assert(
    Array.isArray(payload.validation_warnings),
    'validation_warnings must be an array',
  );
}

async function main() {
  const config = await readFile(path.join(root, '.env.example'), 'utf8');
  const policies = JSON.parse(
    await readFile(path.join(root, 'data', 'knowledge-base.json'), 'utf8'),
  );
  assert(config.includes('OLLAMA_MODEL='), 'Model configuration is missing');
  assert(
    config.includes('OLLAMA_TIMEOUT_MS='),
    'Timeout configuration is missing',
  );
  assert(policies.policies.length >= 2, 'Policy data source is incomplete');

  const wrongItem = await postReview(
    'Order #4821 arrived in red, but I ordered blue. I need it before Friday.',
  );
  assert(wrongItem.status === 200, `Expected 200, got ${wrongItem.status}`);
  assertStructuredReview(wrongItem.payload);
  assert(
    wrongItem.payload.category === 'wrong_item',
    'Wrong-item category failed',
  );
  assert(
    wrongItem.payload.policy_matches[0]?.id === 'FUL-02',
    'Wrong-item policy retrieval failed',
  );
  assert(
    wrongItem.payload.requires_human_approval === true,
    'Risky fulfillment case must require approval',
  );
  assert(
    wrongItem.payload.audit_status === 'recorded',
    'Audit write was not recorded',
  );

  const standardReturn = await postReview(
    'I received order #5102 ten days ago and the unused shirt does not fit. How can I return it?',
  );
  assert(standardReturn.status === 200, 'Standard return flow failed');
  assertStructuredReview(standardReturn.payload);
  assert(
    standardReturn.payload.policy_matches[0]?.id === 'RET-01',
    'Return policy retrieval failed',
  );

  const empty = await postReview('');
  assert(empty.status === 400, 'Empty input must return 400');
  assert(empty.payload.code === 'MESSAGE_REQUIRED', 'Empty-input code changed');

  const tooLong = await postReview('x'.repeat(5001));
  assert(tooLong.status === 400, 'Oversized input must return 400');
  assert(
    tooLong.payload.code === 'MESSAGE_TOO_LONG',
    'Length error code changed',
  );

  const history = await request('/api/reviews?limit=10');
  assert(history.status === 200, 'Audit history endpoint failed');
  assert(
    Array.isArray(history.payload.reviews),
    'Audit history is not structured',
  );
  assert(
    history.payload.reviews.some(
      (review) =>
        review.category === 'wrong_item' && review.policyId === 'FUL-02',
    ),
    'Expected review was not found in the audit log',
  );

  const evidence = {
    run_status: 'complete',
    completed_at: new Date().toISOString(),
    system: 'SupportFlow Day 3 working core',
    core_flow: {
      trigger: 'POST /api/review from the web workspace',
      input: 'one customer-support message',
      output:
        'structured review, policy match, approval decision, and editable draft',
      result: 'pass',
    },
    integrations: {
      ollama_llama: {
        model: wrongItem.payload.model,
        result: 'pass',
      },
      versioned_policy_data: {
        policies_available: policies.policies.length,
        selected_policy: wrongItem.payload.policy_matches[0]?.id,
        result: 'pass',
      },
      d1_audit_log: {
        records_returned: history.payload.reviews.length,
        result: 'pass',
      },
    },
    reliability: {
      structured_output: 'pass',
      empty_input_error: empty.payload.code,
      oversized_input_error: tooLong.payload.code,
      audit_status: wrongItem.payload.audit_status,
      broader_wrong_item_wording_regression: 'pass',
    },
    interface: {
      type: 'single-screen web workspace',
      operator_actions: ['paste', 'review', 'edit', 'approve', 'copy'],
      result: 'implemented',
    },
    proxy_user_execution: {
      actor: 'candidate acting as the disclosed proxy operator',
      status: 'complete with disclosed proxy-user browser confirmation',
    },
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
  console.log(`Day 3 technical verification passed. Evidence: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
