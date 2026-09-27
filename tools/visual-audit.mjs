import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { chromium } from '@playwright/test';

async function reservePort() {
  const socket = createServer();
  await new Promise((res, rej) => {
    socket.once('error', rej);
    socket.listen(0, '127.0.0.1', res);
  });
  const port = socket.address().port;
  await new Promise(res => socket.close(res));
  return port;
}

const root = process.cwd();
const port = await reservePort();
const base = `http://127.0.0.1:${port}`;
console.log(`Starting server on ${base}...`);

// Start next server with current env
const server = spawn('npx', ['next', 'start', '--port', String(port)], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: 'pipe',
  shell: true,
});

server.stdout.on('data', d => {
  const str = d.toString();
  if (str.includes('Ready in') || str.includes('started server') || str.includes('Listening on')) {
    console.log('[Server ready]', str.trim());
  }
});
server.stderr.on('data', d => console.error('[Server err]', d.toString()));

// Wait for server to respond
let ready = false;
for (let i = 0; i < 30; i++) {
  try {
    const res = await fetch(`${base}/`);
    if (res.status === 200 || res.status === 307 || res.status === 308) {
      ready = true;
      break;
    }
  } catch (e) {}
  await new Promise(r => setTimeout(r, 1000));
}

if (!ready) {
  console.error('Server failed to start in time.');
  server.kill();
  process.exit(1);
}

console.log('Server verified ready. Launching Chromium...');

const browser = await chromium.launch({
  executablePath: process.env.RIVYA_BROWSER_EXECUTABLE || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});

const report = {
  timestamp: new Date().toISOString(),
  pagesAudited: 0,
  overflowIssues: [],
  consoleErrors: [],
  pageErrors: [],
  brokenImages: [],
  accessibilityIssues: [],
  smallTouchTargets: [],
};

const viewports = [
  { name: 'Desktop Large', width: 1440, height: 900 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Mobile Standard', width: 390, height: 844 },
  { name: 'Mobile Compact', width: 320, height: 640 },
];

const storefrontRoutes = [
  '/',
  '/collectible-design',
  '/memory-art',
  '/personal-art',
  '/pieces/river-channel',
  '/pieces/river-channel/customize',
  '/commission',
  '/commission/customize',
  '/preserve',
  '/personalize',
  '/about',
  '/our-story',
  '/process',
  '/materials',
  '/materials-care',
  '/portfolio',
  '/journal',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/accessibility',
  '/shipping-delivery',
  '/returns-cancellations',
  '/search',
  '/not-found-test-page-404',
];

const studioRoutes = [
  '/studio/login',
  '/studio',
  '/studio/inquiries',
  '/studio/follow-ups',
  '/studio/products',
  '/studio/content',
  '/studio/media',
  '/studio/activity',
  '/studio/staff',
  '/studio/settings',
];

try {
  // 1. Audit Storefront
  console.log('\n--- Auditing Storefront Pages ---');
  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        report.consoleErrors.push({ url: page.url(), viewport: vp.name, text: msg.text() });
      }
    });
    page.on('pageerror', err => {
      report.pageErrors.push({ url: page.url(), viewport: vp.name, message: err.message });
    });

    for (const route of storefrontRoutes) {
      report.pagesAudited++;
      try {
        await page.goto(base + route, { waitUntil: 'networkidle', timeout: 15000 });
      } catch (err) {
        // Fallback wait
        await page.waitForTimeout(2000);
      }

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        if (docWidth > winWidth + 1) {
          // Find the offending elements
          const culprits = [];
          for (const el of document.querySelectorAll('*')) {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1 || rect.left < -1) {
              const tag = el.tagName.toLowerCase();
              const id = el.id ? `#${el.id}` : '';
              const cls = el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : '';
              culprits.push(`${tag}${id}${cls} (right: ${Math.round(rect.right)}px, left: ${Math.round(rect.left)}px, width: ${Math.round(rect.width)}px)`);
            }
          }
          return { docWidth, winWidth, culprits: culprits.slice(0, 5) };
        }
        return null;
      });

      if (overflow) {
        report.overflowIssues.push({ route, viewport: vp.name, ...overflow });
        console.warn(`[Overflow] ${route} on ${vp.name}: docWidth=${overflow.docWidth} vs winWidth=${overflow.winWidth}`);
      }

      // Check broken images
      const brokenImgs = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
          .filter(img => img.complete && img.naturalWidth === 0 && img.src && !img.src.includes('data:'))
          .map(img => ({ src: img.src, alt: img.alt || '(no alt)' }));
      });
      if (brokenImgs.length) {
        report.brokenImages.push({ route, viewport: vp.name, images: brokenImgs });
      }

      // Check small touch targets on mobile
      if (vp.width <= 390) {
        const smallTargets = await page.evaluate(() => {
          const targets = [];
          const interactives = document.querySelectorAll('button, a, input, select, textarea');
          for (const el of interactives) {
            const rect = el.getBoundingClientRect();
            // Visible only
            if (rect.width > 0 && rect.height > 0 && (rect.width < 32 || rect.height < 32)) {
              // Ignore hidden or skip links
              const style = window.getComputedStyle(el);
              if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                targets.push({
                  tag: el.tagName.toLowerCase(),
                  text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30),
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                });
              }
            }
          }
          return targets.slice(0, 6);
        });
        if (smallTargets.length) {
          report.smallTouchTargets.push({ route, viewport: vp.name, targets: smallTargets });
        }
      }

      // Check interactive modal/menu focus trap if on home
      if (route === '/' && vp.width <= 768) {
        const menuBtn = page.getByRole('button', { name: /open navigation|menu/i });
        if (await menuBtn.isVisible().catch(() => false)) {
          await menuBtn.click();
          await page.waitForTimeout(400);
          const dialog = page.getByRole('dialog');
          if (await dialog.isVisible().catch(() => false)) {
            // Test Escape
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);
            const stillVisible = await dialog.isVisible().catch(() => false);
            if (stillVisible) {
              report.accessibilityIssues.push({ route: '/', issue: 'Mobile navigation dialog does not close on Escape' });
            }
          }
        }
      }
    }
    await context.close();
  }

  // 2. Audit Studio Pages
  console.log('\n--- Auditing Studio Pages ---');
  const studioContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const studioPage = await studioContext.newPage();

  studioPage.on('console', msg => {
    if (msg.type() === 'error') {
      report.consoleErrors.push({ url: studioPage.url(), viewport: 'Studio Desktop', text: msg.text() });
    }
  });

  // Login
  await studioPage.goto(`${base}/studio/login`, { waitUntil: 'networkidle' });
  const adminId = process.env.STUDIO_ADMIN_ID || 'local-review';
  const adminPass = process.env.STUDIO_ADMIN_PASSWORD || '8JFqmUGo6m1I4DwTKDP0kkt7pQS2RDkhKeIZmw';

  await studioPage.getByLabel(/staff id/i).fill(adminId);
  await studioPage.getByLabel(/password/i).fill(adminPass);
  await studioPage.getByRole('button', { name: /sign in/i }).click();
  await studioPage.waitForURL('**/studio', { timeout: 15000 });
  console.log('Logged into Studio successfully.');

  for (const vp of [viewports[0], viewports[3]]) {
    await studioPage.setViewportSize({ width: vp.width, height: vp.height });
    for (const route of studioRoutes) {
      report.pagesAudited++;
      try {
        await studioPage.goto(base + route, { waitUntil: 'networkidle', timeout: 15000 });
      } catch (e) {
        await studioPage.waitForTimeout(2000);
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
              const cls = el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : '';
              culprits.push(`${tag}${id}${cls} (right: ${Math.round(rect.right)}px, left: ${Math.round(rect.left)}px, width: ${Math.round(rect.width)}px)`);
            }
          }
          return { docWidth, winWidth, culprits: culprits.slice(0, 5) };
        }
        return null;
      });

      if (overflow) {
        report.overflowIssues.push({ route, viewport: `Studio ${vp.name}`, ...overflow });
        console.warn(`[Studio Overflow] ${route} on ${vp.name}: docWidth=${overflow.docWidth} vs winWidth=${overflow.winWidth}`);
      }
    }
  }

  await studioContext.close();

} finally {
  await browser.close();
  server.kill('SIGTERM');
}

fs.writeFileSync('test-results/visual-audit-report.json', JSON.stringify(report, null, 2));
console.log('\n--- Visual Audit Summary ---');
console.log(`Total Page/Viewport Audits: ${report.pagesAudited}`);
console.log(`Horizontal Overflows: ${report.overflowIssues.length}`);
console.log(`Console Errors: ${report.consoleErrors.length}`);
console.log(`Page JS Errors: ${report.pageErrors.length}`);
console.log(`Broken Images: ${report.brokenImages.length}`);
console.log(`Accessibility / Dialog Issues: ${report.accessibilityIssues.length}`);
console.log(`Small Touch Targets (<32px): ${report.smallTouchTargets.length}`);
