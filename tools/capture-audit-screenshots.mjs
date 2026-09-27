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

// Start Next server with current env
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

const screenshotsDir = path.resolve('screenshots');
fs.mkdirSync(screenshotsDir, { recursive: true });

const findings = {
  timestamp: new Date().toISOString(),
  viewportsAudited: 0,
  screenshotsCaptured: 0,
  horizontalOverflows: [],
  brokenImages: [],
  smallTouchTargets: [],
  consoleErrors: [],
  pageErrors: [],
};

// Exact viewports requested by user:
// Desktop: 1920px, 1440px, 1200px, 992px
// Mobile / Tablet: 768px, 512px, 320px
const viewports = [
  { name: 'desktop-1920px', width: 1920, height: 1080 },
  { name: 'desktop-1440px', width: 1440, height: 900 },
  { name: 'desktop-1200px', width: 1200, height: 800 },
  { name: 'desktop-992px',  width: 992,  height: 800 },
  { name: 'mobile-768px',   width: 768,  height: 1024 },
  { name: 'mobile-512px',   width: 512,  height: 900 },
  { name: 'mobile-320px',   width: 320,  height: 640 },
];

const storefrontPages = [
  { slug: 'home', path: '/' },
  { slug: 'collection-furniture', path: '/collectible-design' },
  { slug: 'collection-memory', path: '/memory-art' },
  { slug: 'collection-personal', path: '/personal-art' },
  { slug: 'product-detail-representative', path: '/pieces/river-channel' },
  { slug: 'product-customize-form', path: '/pieces/river-channel/customize' },
  { slug: 'commission', path: '/commission' },
  { slug: 'commission-customize-form', path: '/commission/customize' },
  { slug: 'preserve', path: '/preserve' },
  { slug: 'personalize', path: '/personalize' },
  { slug: 'our-story', path: '/our-story' },
  { slug: 'process', path: '/process' },
  { slug: 'materials-care', path: '/materials-care' },
  { slug: 'portfolio', path: '/portfolio' },
  { slug: 'portfolio-project-study', path: '/portfolio/quiet-dining-room' },
  { slug: 'journal', path: '/journal' },
  { slug: 'journal-article-representative', path: '/journal/a-room-begins-with-a-statement-table' },
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
  { slug: 'studio-login', path: '/studio/login', auth: false },
  { slug: 'studio-overview', path: '/studio', auth: true },
  { slug: 'studio-inquiries', path: '/studio/inquiries', auth: true },
  { slug: 'studio-follow-ups', path: '/studio/follow-ups', auth: true },
  { slug: 'studio-products', path: '/studio/products', auth: true },
  { slug: 'studio-content', path: '/studio/content', auth: true },
  { slug: 'studio-media', path: '/studio/media', auth: true },
  { slug: 'studio-activity', path: '/studio/activity', auth: true },
  { slug: 'studio-staff', path: '/studio/staff', auth: true },
  { slug: 'studio-settings', path: '/studio/settings', auth: true },
];

try {
  findings.viewportsAudited = viewports.length;

  for (const vp of viewports) {
    console.log(`\n=== Processing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const vpDir = path.join(screenshotsDir, vp.name);
    fs.mkdirSync(vpDir, { recursive: true });

    // 1. Audit Storefront Pages
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        findings.consoleErrors.push({ url: page.url(), viewport: vp.name, text: msg.text() });
      }
    });
    page.on('pageerror', err => {
      findings.pageErrors.push({ url: page.url(), viewport: vp.name, message: err.message });
    });

    for (const item of storefrontPages) {
      try {
        await page.goto(base + item.path, { waitUntil: 'networkidle', timeout: 15000 });
      } catch (err) {
        await page.waitForTimeout(2000);
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
              const cls = el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : '';
              culprits.push({
                element: `${tag}${id}${cls}`,
                rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
              });
            }
          }
          return { docWidth, winWidth, culprits: culprits.slice(0, 5) };
        }
        return null;
      });

      if (overflow) {
        findings.horizontalOverflows.push({
          page: item.slug,
          path: item.path,
          viewport: vp.name,
          ...overflow,
        });
        console.warn(`[Overflow Alert] ${item.slug} on ${vp.name}: width ${overflow.docWidth}px > window ${overflow.winWidth}px`);
      }

      // Check broken images
      const broken = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
          .filter(img => img.complete && img.naturalWidth === 0 && img.src && !img.src.includes('data:'))
          .map(img => ({ src: img.src, alt: img.alt || '' }));
      });
      if (broken.length) {
        findings.brokenImages.push({ page: item.slug, viewport: vp.name, images: broken });
      }

      // Check touch targets on mobile
      if (vp.width <= 768) {
        const smallTargets = await page.evaluate(() => {
          const res = [];
          const interactives = document.querySelectorAll('button, a, input, select, textarea');
          for (const el of interactives) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && (rect.width < 36 || rect.height < 36)) {
              const style = window.getComputedStyle(el);
              if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                res.push({
                  tag: el.tagName.toLowerCase(),
                  text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30),
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                });
              }
            }
          }
          return res.slice(0, 5);
        });
        if (smallTargets.length) {
          findings.smallTouchTargets.push({ page: item.slug, viewport: vp.name, targets: smallTargets });
        }
      }

      // Capture screenshot
      const shotPath = path.join(vpDir, `${item.slug}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });
      findings.screenshotsCaptured++;
    }

    await context.close();

    // 2. Audit Studio Pages
    const studioContext = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const studioPage = await studioContext.newPage();

    studioPage.on('console', msg => {
      if (msg.type() === 'error') {
        findings.consoleErrors.push({ url: studioPage.url(), viewport: `Studio ${vp.name}`, text: msg.text() });
      }
    });

    // Login for Studio
    await studioPage.goto(`${base}/studio/login`, { waitUntil: 'networkidle' });
    const shotLogin = path.join(vpDir, `studio-login.png`);
    await studioPage.screenshot({ path: shotLogin, fullPage: true });
    findings.screenshotsCaptured++;

    const adminId = process.env.STUDIO_ADMIN_ID || 'local-review';
    const adminPass = process.env.STUDIO_ADMIN_PASSWORD || '8JFqmUGo6m1I4DwTKDP0kkt7pQS2RDkhKeIZmw';

    await studioPage.getByLabel(/staff id/i).fill(adminId);
    await studioPage.getByLabel(/password/i).fill(adminPass);
    await studioPage.getByRole('button', { name: /sign in/i }).click();
    await studioPage.waitForURL('**/studio', { timeout: 15000 });

    for (const item of studioPages.filter(p => p.auth)) {
      try {
        await studioPage.goto(base + item.path, { waitUntil: 'networkidle', timeout: 15000 });
      } catch (err) {
        await studioPage.waitForTimeout(2000);
      }

      // Check overflow in studio
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
              culprits.push({
                element: `${tag}${id}${cls}`,
                rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
              });
            }
          }
          return { docWidth, winWidth, culprits: culprits.slice(0, 5) };
        }
        return null;
      });

      if (overflow) {
        findings.horizontalOverflows.push({
          page: item.slug,
          path: item.path,
          viewport: `Studio ${vp.name}`,
          ...overflow,
        });
        console.warn(`[Studio Overflow Alert] ${item.slug} on ${vp.name}: width ${overflow.docWidth}px > window ${overflow.winWidth}px`);
      }

      const shotPath = path.join(vpDir, `${item.slug}.png`);
      await studioPage.screenshot({ path: shotPath, fullPage: true });
      findings.screenshotsCaptured++;
    }

    await studioContext.close();
  }

} finally {
  await browser.close();
  server.kill('SIGTERM');
}

fs.writeFileSync('test-results/audit-findings.json', JSON.stringify(findings, null, 2));

console.log('\n========================================');
console.log('       AUDIT & SCREENSHOT SUMMARY       ');
console.log('========================================');
console.log(`Total Viewports Audited: ${findings.viewportsAudited}`);
console.log(`Total Screenshots Captured: ${findings.screenshotsCaptured}`);
console.log(`Horizontal Overflows: ${findings.horizontalOverflows.length}`);
console.log(`Broken Images: ${findings.brokenImages.length}`);
console.log(`Small Touch Targets (<36px): ${findings.smallTouchTargets.length}`);
console.log(`Console Errors: ${findings.consoleErrors.length}`);
console.log(`Page JS Errors: ${findings.pageErrors.length}`);
console.log('========================================\n');
