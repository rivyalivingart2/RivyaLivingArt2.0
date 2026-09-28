import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const AUDIT_DIR = '.local-audit/after';
fs.mkdirSync(AUDIT_DIR, { recursive: true });

const ROUTES = [
  { name: 'homepage', path: '/' },
  { name: 'category-tables', path: '/collectible-design' },
  { name: 'product', path: '/commission' },
  { name: 'studio', path: '/studio' }
];

const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080 },
  { name: '768', width: 768, height: 1024 },
  { name: '320', width: 320, height: 568 }
];

async function run() {
  console.log('Starting visual screenshot audit...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const url = `http://127.0.0.1:3000${route.path}`;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        const filePath = path.join(AUDIT_DIR, `${route.name}-${vp.name}.png`);
        await page.screenshot({ path: filePath, fullPage: true });
        console.log(`Saved screenshot: ${filePath}`);
      } catch (e) {
        console.error(`Failed to capture ${url} at ${vp.width}x${vp.height}: ${e.message}`);
      }
    }
  }
  
  await browser.close();
  console.log('Visual audit complete.');
}

run().catch(console.error);
