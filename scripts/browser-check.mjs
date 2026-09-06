// Optional maintainer QA. Install playwright separately or set PLAYWRIGHT_MODULE.
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import assert from 'node:assert/strict';
import { writeFile, mkdir } from 'node:fs/promises';
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE,
});
const context = await browser.newContext({
  viewport: { width: 1360, height: 1000 },
});
await context.addInitScript(() => {
  Object.defineProperty(document, 'modelContext', {
    value: {
      registerTool(tool) {
        window.supportFlowTestTool = tool;
      },
    },
  });
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://localhost:3000');
await page.waitForFunction(() => !!window.supportFlowTestTool);
const field = page.locator('#ticket-message');
async function run(message) {
  await field.fill(message);
  await page
    .getByRole('button', { name: 'Review ticket', exact: true })
    .click();
  await page.locator('#reply-draft').waitFor({ timeout: 65000 });
}
await run(
  'I received order #5102 ten days ago and the unused shirt does not fit. How can I return it?',
);
assert.match(await page.locator('#reply-draft').inputValue(), /30 days/);
await page.getByText('Read matched policy', { exact: true }).click();
assert(
  await page
    .getByText(
      'Unused items may be returned within 30 days of delivery. Refunds require proof of purchase and human approval. Never promise that a refund has been issued until the payment system confirms it.',
      { exact: true },
    )
    .isVisible(),
);
await run(
  'Your product injured me. My lawyer will contact you. Tracking has not changed since yesterday.',
);
assert(await page.getByText('critical', { exact: true }).isVisible());
assert(
  await page.getByRole('button', { name: 'Approve before copy' }).isDisabled(),
);
await page.getByRole('button', { name: 'Approve draft', exact: true }).click();
assert(
  await page
    .getByRole('button', { name: 'Copy draft', exact: true })
    .isEnabled(),
);
await page
  .locator('#reply-draft')
  .fill('A manager must review this concern before responding.');
assert(
  await page.getByRole('button', { name: 'Approve before copy' }).isDisabled(),
);
await page.getByRole('button', { name: 'Approve draft', exact: true }).click();
await page.evaluate(() => {
  Object.defineProperty(navigator.clipboard, 'writeText', {
    value: async () => {
      throw new Error('simulated clipboard denial');
    },
    configurable: true,
  });
});
await page.getByRole('button', { name: 'Copy draft', exact: true }).click();
await page.getByRole('alert').waitFor();
assert.match(await page.getByRole('alert').innerText(), /Could not copy/);
let release;
const blocked = new Promise((resolve) => {
  release = resolve;
});
let intercepted;
const intercept = new Promise((resolve) => {
  intercepted = resolve;
});
await page.route(
  '**/api/review',
  async (route) => {
    intercepted();
    await blocked;
    await route.continue();
  },
  { times: 1 },
);
await field.fill('I want to return an unused item.');
await page.getByRole('button', { name: 'Review ticket', exact: true }).click();
await intercept;
await field.fill('A different ticket is now being entered.');
const response = page.waitForResponse('**/api/review');
release();
await response;
await page.waitForTimeout(300);
assert.equal(
  await page.locator('#reply-draft').count(),
  0,
  'Stale response replaced edited input',
);
const invalid = await page.evaluate(async () => {
  try {
    await window.supportFlowTestTool.execute({ message: '' });
    return false;
  } catch {
    return true;
  }
});
assert(invalid);
const tool = await page.evaluate(() =>
  window.supportFlowTestTool.execute({
    message:
      'Someone accessed my account. Tracking has not changed since yesterday.',
  }),
);
assert.equal(tool.urgency, 'critical');
assert(await page.getByText('critical', { exact: true }).isVisible());
await page.setViewportSize({ width: 390, height: 844 });
assert(
  await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  ),
);
await mkdir('outputs', { recursive: true });
await page.screenshot({ path: 'outputs/browser-mobile.png', fullPage: true });
await page.setViewportSize({ width: 1360, height: 1000 });
await page.screenshot({ path: 'outputs/browser-desktop.png', fullPage: true });
assert.deepEqual(errors, []);
await writeFile(
  'Result/browser-verification.json',
  JSON.stringify(
    {
      completed_at: new Date().toISOString(),
      actor:
        'Automated Playwright browser test, not independent human research',
      checks: {
        normal_flow: true,
        policy_visible: true,
        critical_priority: true,
        approval_copy_gate: true,
        edit_resets_approval: true,
        clipboard_failure_message: true,
        stale_response_discarded: true,
        webmcp_valid_and_invalid: true,
        mobile_no_overflow: true,
        no_page_errors: true,
      },
    },
    null,
    2,
  ) + '\n',
);
await browser.close();
console.log('Browser checks passed.');
