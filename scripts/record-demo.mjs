// Records the real local app plus evidence cards. No customer data is used.
// Optional dependency: playwright. NODE_PATH may select an existing installation.
import { createRequire } from 'node:module';
import { readFile, mkdir } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)('playwright');
const final = JSON.parse(
  await readFile('Result/final-results.json', 'utf8'),
).summary;
const baseline = JSON.parse(
  await readFile('Result/baseline-results.json', 'utf8'),
).summary;
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE,
});
await mkdir('outputs/demo-raw', { recursive: true });
const ctx = await browser.newContext({
  viewport: { width: 1360, height: 980 },
  recordVideo: { dir: 'outputs/demo-raw', size: { width: 1360, height: 980 } },
});
await ctx.addInitScript(() => {
  Object.defineProperty(document, 'modelContext', {
    value: {
      registerTool(t) {
        window.demoTool = t;
      },
    },
  });
});
const page = await ctx.newPage();
const started = Date.now();
async function until(seconds) {
  const remaining = seconds * 1000 - (Date.now() - started);
  if (remaining > 0) await page.waitForTimeout(remaining);
}
async function card(title, paragraphs) {
  // Isolate evidence cards from the app's live-reload connection.
  await page.goto('about:blank');
  await page.setContent(
    '<html><body style="margin:0;background:#f5f6f8;color:#172033;font-family:Arial,sans-serif;padding:75px 90px"><div style="font-size:22px;color:#2463eb;margin-bottom:30px">SupportFlow · Five-minute walkthrough</div><h1 style="font-size:44px;line-height:1.2"></h1><div id="copy" style="font-size:27px;line-height:1.55;max-width:1120px"></div><footer style="position:fixed;bottom:30px;font-size:17px;color:#536074">Automated screen recording · Synthetic tickets · No real customer actions</footer></body></html>',
  );
  await page.locator('h1').textContent();
  await page.evaluate(
    ({ title, paragraphs }) => {
      document.querySelector('h1').textContent = title;
      for (const text of paragraphs) {
        const p = document.createElement('p');
        p.textContent = text;
        document.querySelector('#copy').append(p);
      }
    },
    { title, paragraphs },
  );
}
async function caption(text) {
  await page.evaluate((text) => {
    let e = document.getElementById('demo-caption');
    if (!e) {
      e = document.createElement('div');
      e.id = 'demo-caption';
      document.body.append(e);
    }
    e.style.cssText =
      'position:fixed;bottom:0;left:0;right:0;z-index:99999;padding:18px 40px;background:#172033;color:white;font:20px/1.45 Arial;box-shadow:0 -2px 10px #0002';
    e.textContent = text;
  }, text);
}
async function run(message) {
  await page.locator('#ticket-message').fill(message);
  await page
    .getByRole('button', { name: 'Review ticket', exact: true })
    .click();
  await page.locator('#reply-draft').waitFor({ timeout: 65000 });
}
await card('The recurring problem', [
  'A small-store support operator repeatedly reads messages, searches policy, drafts replies and decides when approval is needed.',
  'This sprint uses a synthetic store and tickets. The assumed 20–50 daily messages and actual human time savings have not been independently measured.',
  'The previous approach is a generic local-model prompt. SupportFlow adds policies, validation, priority rules, operator review and a metadata audit log.',
  'This recording uses on-screen explanations and real local app responses; it is an automated demonstration, not independent user testing.',
]);
console.log('Demo 0:00 — problem');
await until(35);
await page.goto('http://localhost:3000');
await page.waitForFunction(() => !!window.demoTool);
await caption(
  'Normal flow: paste one synthetic return request. The local model classifies it; the final reply comes from a versioned policy template.',
);
await run(
  'I received order #5102 ten days ago and the unused shirt does not fit. How can I return it?',
);
await page.getByText('Read matched policy', { exact: true }).click();
console.log('Demo 0:35 — live return and policy');
await until(90);
await caption(
  'The operator reads the policy and checks the details. Drafts are editable. The model estimate is uncalibrated; it is not proof that any fact has been verified.',
);
await page
  .locator('#reply-draft')
  .fill(
    'Thanks for getting in touch. ' +
      (await page.locator('#reply-draft').inputValue()),
  );
console.log('Demo 1:30 — editable draft');
await until(115);
await caption(
  'Mixed-intent regression: a legal/injury concern plus a recent tracking pause. Priority must remain critical. Copy stays blocked until operator approval.',
);
await run(
  'Your product injured me. My lawyer will contact you. Tracking has not changed since yesterday.',
);
console.log('Demo 1:55 — critical priority');
await until(155);
await caption(
  'Synthetic approval demonstration: Approve unlocks Copy. Editing afterwards resets approval. In real use, complete all required external checks first. No message is sent by this app.',
);
await page.getByRole('button', { name: 'Approve draft', exact: true }).click();
await until(169);
await page
  .locator('#reply-draft')
  .fill('A manager must review this concern before responding.');
console.log('Demo 2:35 — approval and reset');
await until(190);
await caption(
  'Input validation: an empty message cannot be submitted. Invalid model JSON is retried; a second failure returns a labelled zero-confidence fallback requiring approval. Fault-injection results are shown next.',
);
await page.locator('#ticket-message').fill('');
console.log('Demo 3:10 — validation');
await until(220);
await card('Measured results and failure handling', [
  `Same evaluator, 11 non-empty tickets: baseline ${baseline.common_passes}/11 common quality passes; final ${final.common_passes}/11. Final input-validation case is reported separately.`,
  `Median HTTP request time: ${(baseline.median_request_time_ms / 1000).toFixed(2)} seconds baseline; ${(final.median_request_time_ms / 1000).toFixed(2)} seconds final. This is not human handling time.`,
  'Live regression: original 12/12, challenge 12/12, new mixed-intent/privacy suite 8/8. Controlled model fault tests improved from 3/20 on the old code to 20/20.',
  'Known-bad replies test the evaluator itself. Raw results, source/evaluator hashes and previous failed runs are retained. Automated passing does not certify general safety or human sign-off.',
]);
console.log('Demo 3:40 — results');
await until(263);
await card('Handoff and the most important limitation', [
  'Final drafts are policy templates: predictable and editable, but less personalized. There is no live order, inventory, payment, account or email connection.',
  'Another person can follow the Windows README: install dependencies, pull the Ollama model, and launch Start-SupportFlow.cmd. Independent first-time operation still needs a real participant.',
  'Actual manual touches, human time savings and adoption are unmeasured. The next two weeks focus on two independent operators, observed corrections and an expanded regression suite.',
  'Deliverables: runnable repository, raw evaluation evidence, case study, AI collaboration note, runbook and this recording. Public online deployment is optional.',
]);
console.log('Demo 4:23 — limitations and handoff');
await until(300);
await ctx.close();
await page.video().saveAs('Result/supportflow-demo.webm');
await browser.close();
console.log('Demo saved: Result/supportflow-demo.webm');
