import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const base = process.env.BASE_URL || 'http://localhost:3000';
console.log(`Auditing target: ${base}...`);

// Viewport matrix required:
// Desktop/Tablet: 1920px, 1440px, 1200px, 992px, 768px
// Mobile: 512px, 320px
const viewports = [
  { name: '1920', width: 1920, height: 1080 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1200', width: 1200, height: 800 },
  { name: '992',  width: 992,  height: 800 },
  { name: '768',  width: 768,  height: 1024 },
  { name: '512',  width: 512,  height: 900 },
  { name: '320',  width: 320,  height: 640 },
];

const storefrontPages = [
  { slug: 'home', path: '/' },
  { slug: 'collection-furniture', path: '/collectible-design' },
  { slug: 'collection-memory', path: '/memory-art' },
  { slug: 'collection-personal', path: '/personal-art' },
  { slug: 'product-detail-river-channel', path: '/pieces/river-channel' },
  { slug: 'product-customize-river-channel', path: '/pieces/river-channel/customize' },
  { slug: 'commission', path: '/commission' },
  { slug: 'commission-customize', path: '/commission/customize' },
  { slug: 'preserve', path: '/preserve' },
  { slug: 'personalize', path: '/personalize' },
  { slug: 'our-story', path: '/our-story' },
  { slug: 'process', path: '/process' },
  { slug: 'materials-care', path: '/materials-care' },
  { slug: 'portfolio', path: '/portfolio' },
  { slug: 'portfolio-project', path: '/portfolio/quiet-dining-room' },
  { slug: 'journal', path: '/journal' },
  { slug: 'journal-article', path: '/journal/a-room-begins-with-a-statement-table' },
  { slug: 'architects', path: '/architects' },
  { slug: 'contact', path: '/contact' },
  { slug: 'faq', path: '/faq' },
  { slug: 'privacy', path: '/privacy' },
  { slug: 'terms', path: '/terms' },
  { slug: 'accessibility', path: '/accessibility' },
  { slug: 'shipping-delivery', path: '/shipping-delivery' },
  { slug: 'returns-cancellations', path: '/returns-cancellations' },
  { slug: 'search', path: '/search' },
  { slug: 'not-found', path: '/not-found-page-404' },
];

const studioPages = [
  { slug: 'login', path: '/studio/login', auth: false },
  { slug: 'overview', path: '/studio', auth: true },
  { slug: 'inquiries', path: '/studio/inquiries', auth: true },
  { slug: 'follow-ups', path: '/studio/follow-ups', auth: true },
  { slug: 'products', path: '/studio/products', auth: true },
  { slug: 'content', path: '/studio/content', auth: true },
  { slug: 'media', path: '/studio/media', auth: true },
  { slug: 'activity', path: '/studio/activity', auth: true },
  { slug: 'staff', path: '/studio/staff', auth: true },
  { slug: 'settings', path: '/studio/settings', auth: true },
];

const baseAuditDir = path.resolve('visual-audit');
fs.mkdirSync(path.join(baseAuditDir, 'main-site'), { recursive: true });
fs.mkdirSync(path.join(baseAuditDir, 'studio'), { recursive: true });
fs.mkdirSync(path.resolve('test-results'), { recursive: true });

const report = {
  timestamp: new Date().toISOString(),
  target: base,
  viewports: viewports.map(v => `${v.width}px`),
  mainPagesAudited: storefrontPages.length,
  studioPagesAudited: studioPages.length,
  screenshotsCaptured: 0,
  horizontalOverflows: [],
  brokenImages: [],
  smallTouchTargets: [],
  consoleErrors: [],
  pageErrors: [],
};

const browser = await chromium.launch({
  executablePath: process.env.RIVYA_BROWSER_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});

try {
  // 1. Audit Main Website Pages
  for (const vp of viewports) {
    console.log(`\n--- [Main Site] Auditing Viewport: ${vp.width}px (${vp.name}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore expected 404 on the deliberate 404 test page
        if (text.includes('404') && page.url().includes('not-found-page-404')) return;
        report.consoleErrors.push({ url: page.url(), viewport: `${vp.width}px`, text });
      }
    });

    page.on('pageerror', err => {
      report.pageErrors.push({ url: page.url(), viewport: `${vp.width}px`, message: err.message });
    });

    for (const item of storefrontPages) {
      const pageDir = path.join(baseAuditDir, 'main-site', item.slug);
      fs.mkdirSync(pageDir, { recursive: true });

      try {
        await page.goto(base + item.path, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(600); // let layout settle
      } catch (err) {
        console.warn(`Timeout loading ${item.path}, continuing...`);
      }

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        if (docWidth > winWidth + 1) {
          const culprits = [];
          for (const el of document.querySelectorAll('*')) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1 || rect.left < -1) {
              const tag = el.tagName.toLowerCase();
              const id = el.id ? `#${el.id}` : '';
              const cls = el.className && typeof el.className === 'string'
                ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
                : '';
              culprits.push({
                selector: `${tag}${id}${cls}`,
                rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
              });
            }
          }
          return { docWidth, winWidth, diff: docWidth - winWidth, culprits: culprits.slice(0, 5) };
        }
        return null;
      });

      if (overflow) {
        report.horizontalOverflows.push({
          site: 'main',
          page: item.slug,
          path: item.path,
          viewport: `${vp.width}px`,
          ...overflow,
        });
        console.warn(`  ⚠️ Overflow on ${item.slug} (${vp.width}px): ${overflow.docWidth}px > ${overflow.winWidth}px (+${overflow.diff}px)`);
      }

      // Check broken images
      const broken = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('img'))
          .filter(img => img.complete && img.naturalWidth === 0 && img.src && !img.src.includes('data:'))
          .map(img => ({ src: img.src, alt: img.alt || '' }));
      });
      if (broken.length) {
        report.brokenImages.push({ site: 'main', page: item.slug, viewport: `${vp.width}px`, images: broken });
        console.warn(`  ⚠️ Broken images on ${item.slug}:`, broken);
      }

      // Check touch targets on mobile viewports (<= 768px)
      if (vp.width <= 768) {
        const smallTargets = await page.evaluate(() => {
          const list = [];
          const interactives = document.querySelectorAll('button:not([tabindex="-1"]), a:not([tabindex="-1"]), input:not([type="hidden"]):not([tabindex="-1"]), select, textarea');
          for (const el of interactives) {
            // Check if element or any ancestor is hidden/honeypot
            if (el.closest('.hidden, [aria-hidden="true"], [tabindex="-1"]')) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && (rect.width < 32 || rect.height < 32)) {
              const style = window.getComputedStyle(el);
              if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                const text = (el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '').trim().slice(0, 40);
                list.push({
                  tag: el.tagName.toLowerCase(),
                  text,
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                  className: typeof el.className === 'string' ? el.className.slice(0, 50) : '',
                });
              }
            }
          }
          return list.slice(0, 10);
        });

        if (smallTargets.length) {
          report.smallTouchTargets.push({ site: 'main', page: item.slug, viewport: `${vp.width}px`, targets: smallTargets });
        }
      }

      // Screenshot capture
      const shotPath = path.join(pageDir, `${vp.width}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });
      report.screenshotsCaptured++;
    }

    await context.close();
  }

  // 2. Audit Studio Website Pages
  for (const vp of viewports) {
    console.log(`\n--- [Studio] Auditing Viewport: ${vp.width}px (${vp.name}) ---`);
    const studioContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const studioPage = await studioContext.newPage();

    studioPage.on('console', msg => {
      if (msg.type() === 'error') {
        report.consoleErrors.push({ url: studioPage.url(), viewport: `Studio ${vp.width}px`, text: msg.text() });
      }
    });

    studioPage.on('pageerror', err => {
      report.pageErrors.push({ url: studioPage.url(), viewport: `Studio ${vp.width}px`, message: err.message });
    });

    // Capture login page
    const loginDir = path.join(baseAuditDir, 'studio', 'login');
    fs.mkdirSync(loginDir, { recursive: true });
    await studioPage.goto(`${base}/studio/login`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await studioPage.waitForTimeout(500);
    await studioPage.screenshot({ path: path.join(loginDir, `${vp.width}.png`), fullPage: true });
    report.screenshotsCaptured++;

    // Authenticate into Studio
    const adminId = process.env.STUDIO_ADMIN_ID || 'local-review';
    const adminPass = process.env.STUDIO_ADMIN_PASSWORD || '8JFqmUGo6m1I4DwTKDP0kkt7pQS2RDkhKeIZmw';

    await studioPage.getByLabel(/staff id/i).fill(adminId);
    await studioPage.getByLabel(/password/i).fill(adminPass);
    await studioPage.getByRole('button', { name: /sign in/i }).click();
    await studioPage.waitForURL('**/studio', { timeout: 15000 });

    for (const item of studioPages.filter(p => p.auth)) {
      const pageDir = path.join(baseAuditDir, 'studio', item.slug);
      fs.mkdirSync(pageDir, { recursive: true });

      try {
        await studioPage.goto(base + item.path, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await studioPage.waitForTimeout(600);
      } catch (err) {
        console.warn(`Timeout loading Studio ${item.path}, continuing...`);
      }

      // Check overflow
      const overflow = await studioPage.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        if (docWidth > winWidth + 1) {
          const culprits = [];
          for (const el of document.querySelectorAll('*')) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1 || rect.left < -1) {
              const tag = el.tagName.toLowerCase();
              const id = el.id ? `#${el.id}` : '';
              const cls = el.className && typeof el.className === 'string'
                ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}`
                : '';
              culprits.push({
                selector: `${tag}${id}${cls}`,
                rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
              });
            }
          }
          return { docWidth, winWidth, diff: docWidth - winWidth, culprits: culprits.slice(0, 5) };
        }
        return null;
      });

      if (overflow) {
        report.horizontalOverflows.push({
          site: 'studio',
          page: item.slug,
          path: item.path,
          viewport: `Studio ${vp.width}px`,
          ...overflow,
        });
        console.warn(`  ⚠️ Studio Overflow on ${item.slug} (${vp.width}px): ${overflow.docWidth}px > ${overflow.winWidth}px (+${overflow.diff}px)`);
      }

      // Check touch targets on mobile viewports in Studio
      if (vp.width <= 768) {
        const smallTargets = await studioPage.evaluate(() => {
          const list = [];
          const interactives = document.querySelectorAll('button:not([tabindex="-1"]), a:not([tabindex="-1"]), input:not([type="hidden"]):not([tabindex="-1"]), select, textarea');
          for (const el of interactives) {
            if (el.closest('.hidden, [aria-hidden="true"], [tabindex="-1"]')) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && (rect.width < 32 || rect.height < 32)) {
              const style = window.getComputedStyle(el);
              if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                const text = (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40);
                list.push({
                  tag: el.tagName.toLowerCase(),
                  text,
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                  className: typeof el.className === 'string' ? el.className.slice(0, 50) : '',
                });
              }
            }
          }
          return list.slice(0, 10);
        });

        if (smallTargets.length) {
          report.smallTouchTargets.push({ site: 'studio', page: item.slug, viewport: `Studio ${vp.width}px`, targets: smallTargets });
        }
      }

      const shotPath = path.join(pageDir, `${vp.width}.png`);
      await studioPage.screenshot({ path: shotPath, fullPage: true });
      report.screenshotsCaptured++;
    }

    await studioContext.close();
  }

} finally {
  await browser.close();
}

fs.writeFileSync('test-results/visual-audit-report.json', JSON.stringify(report, null, 2));

console.log('\n======================================================');
console.log('            VISUAL QA AUDIT SUITE COMPLETE            ');
console.log('======================================================');
console.log(`Target:                     ${report.target}`);
console.log(`Viewports:                  ${report.viewports.join(', ')}`);
console.log(`Screenshots Captured:       ${report.screenshotsCaptured}`);
console.log(`Horizontal Overflows:       ${report.horizontalOverflows.length}`);
console.log(`Broken Images:              ${report.brokenImages.length}`);
console.log(`Small Touch Targets (<32px):${report.smallTouchTargets.length}`);
console.log(`Console Errors:             ${report.consoleErrors.length}`);
console.log(`Page JS Errors:             ${report.pageErrors.length}`);
console.log('======================================================\n');
