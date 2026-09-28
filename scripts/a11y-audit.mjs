import { chromium } from 'playwright';

async function run() {
  console.log('Starting basic accessibility audit...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const url = 'http://127.0.0.1:3000/';
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    
    // Inject a basic check for missing alts
    const missingAlts = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.filter(img => !img.hasAttribute('alt')).map(img => img.src);
    });
    
    if (missingAlts.length > 0) {
      console.warn('WARNING: Found images missing alt attributes:', missingAlts);
    } else {
      console.log('PASS: All images have alt attributes on homepage.');
    }
    
    // Check for skip link
    const hasSkipLink = await page.evaluate(() => {
      const link = document.querySelector('.skipLink');
      return !!link;
    });
    console.log(hasSkipLink ? 'PASS: Skip link is present.' : 'WARNING: Missing skip link.');
    
  } catch(e) {
    console.error('Audit failed:', e);
  }
  
  await browser.close();
  console.log('A11y audit complete.');
}

run().catch(console.error);
