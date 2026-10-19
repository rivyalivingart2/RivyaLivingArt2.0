import { chromium } from '@playwright/test';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Public visual comparison only. A fresh profile has no administrator cookies.
// No form action, external message, asset copying, or non-GET request is allowed.
const output = path.resolve('test-results/rivya-master-audit/visual-reference');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const eraOnly = process.argv.includes('--era-only');
const prior = eraOnly ? JSON.parse(await readFile(path.join(output, 'reference-evidence.json'), 'utf8')) : null;
const results = { at: new Date().toISOString(), browser: browser.version(), profiles: 'new isolated contexts, DPR 1, no saved cookies', method: 'public GET/HEAD only; screenshots do not certify interactions', pages: prior ? prior.pages.filter((page) => page.name !== 'era-reference') : [] };
const targets = [
  { name: 'current-production', url: 'https://www.rivyalivingart.com/', kind: 'home' },
  { name: 'current-local', url: 'http://127.0.0.1:4199/', kind: 'home' },
  { name: 'legacy', url: 'https://oldwebsite-one.vercel.app/', kind: 'home' },
  { name: 'era-reference', url: 'https://www.era-residence.com/', kind: 'home' },
  { name: 'current-login', url: 'https://www.rivyalivingart.com/studio/login', kind: 'login' },
  { name: 'legacy-login', url: 'https://oldwebsite-one.vercel.app/studio/', kind: 'login' },
];
for (const target of targets) {
  if (eraOnly && target.name !== 'era-reference') continue;
  for (const size of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    const record = { name: target.name, url: target.url, viewport: size, dpr: 1, touch: size.width === 390, nonGetBlocked: 0, runtimeErrors: [], failedRequests: [], screenshots: [] };
    const context = await browser.newContext({ viewport: size, deviceScaleFactor: 1, isMobile: size.width === 390, hasTouch: size.width === 390, reducedMotion: 'no-preference' });
    await context.route('**/*', async (route) => {
      if (!['GET', 'HEAD'].includes(route.request().method())) { record.nonGetBlocked++; return route.abort(); }
      return route.continue();
    });
    const page = await context.newPage();
    page.on('pageerror', (error) => record.runtimeErrors.push(String(error).slice(0, 600)));
    page.on('requestfailed', (request) => {
      if (record.failedRequests.length < 30) record.failedRequests.push({ url: request.url().split('?')[0], reason: request.failure()?.errorText });
    });
    const prefix = `${target.name}-${size.width}`;
    async function capture(label, fullPage = false) {
      const file = `${prefix}-${label}.png`;
      await page.screenshot({ path: path.join(output, file), fullPage, timeout: 20000 });
      record.screenshots.push(file);
    }
    try {
      const response = await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      record.httpStatus = response?.status();
      await page.waitForTimeout(target.name === 'era-reference' ? 6500 : 2500);
      await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 3500))]));
      record.finalUrl = page.url();
      record.title = await page.title();
      record.initial = await page.evaluate(() => ({
        width: innerWidth, documentWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
        h1: [...document.querySelectorAll('h1')].map((item) => item.textContent?.trim()),
        headings: [...document.querySelectorAll('h2,h3')].map((item) => item.textContent?.trim()).slice(0, 60),
        loadedImages: [...document.images].filter((image) => image.complete && image.naturalWidth > 0).length,
        brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0 && image.currentSrc).map((image) => image.currentSrc.split('?')[0]).slice(0, 15),
        text: document.body.innerText.slice(0, 16000),
      }));
      await capture('top');
      if (target.name === 'era-reference') {
        await page.waitForTimeout(12000);
        await capture('settled-top');
      }
      if (target.kind === 'home' && record.httpStatus < 400) {
        await page.mouse.wheel(0, size.height * 0.88);
        await page.waitForTimeout(1700);
        await capture('transition');
        if (target.name.startsWith('current-')) {
          const resin = page.getByRole('heading', { name: 'Resin in motion', exact: true }).last();
          if (await resin.count()) {
            await resin.scrollIntoViewIfNeeded();
            await page.waitForTimeout(1000);
            await capture('resin');
          }
        } else {
          await page.mouse.wheel(0, target.name === 'era-reference' ? size.height * 3.6 : size.height * 1.2);
          await page.waitForTimeout(1600);
          await capture('editorial');
        }
        // Full-page rendering is a composition reference, not proof that every lazy item was visited.
        await capture('overview', true);
      }
      record.status = record.httpStatus >= 400 ? 'http-unavailable' : 'captured';
    } catch (error) {
      record.status = 'capture-error';
      record.error = String(error).slice(0, 600);
      await capture('error').catch(() => {});
    }
    results.pages.push(record);
    await writeFile(path.join(output, 'reference-evidence.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ name: target.name, width: size.width, status: record.status, httpStatus: record.httpStatus, screenshots: record.screenshots.length }));
    await context.close();
  }
}
await browser.close();
await writeFile(path.join(output, 'reference-evidence.json'), JSON.stringify(results, null, 2));
