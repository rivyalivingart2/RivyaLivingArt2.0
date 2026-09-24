import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {parseEnv} from 'node:util';
import {chromium} from '@playwright/test';

// This suite is deliberately bound to the existing isolated resources.
const qa=parseEnv(fs.readFileSync('.env.qa.local','utf8'));
assert.equal(new URL(qa.DATABASE_URL).pathname,'/rivya_qa_20260924');
assert.equal(qa.RIVYA_DATA_MODE,'isolated');
const base='http://localhost:4187',out=path.resolve('test-results/midnight');
fs.mkdirSync(out,{recursive:true});
const results=[],errors=[];
const pass=name=>{results.push(name);console.log('PASS',name)};
const browser=await chromium.launch({executablePath:process.env.RIVYA_BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 const visit=async route=>{await page.goto(base+route);await page.waitForLoadState('networkidle');};
 const fits=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'No page-level horizontal overflow: '+page.url()+' at '+page.viewportSize().width);
 await visit('/');
 await page.screenshot({path:out+'/hero-desktop.png'});
 for(const section of await page.locator('main section').all()){await section.scrollIntoViewIfNeeded();await page.waitForLoadState('networkidle');}
 await page.locator('h1').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/home-desktop.png',fullPage:true});
 assert.ok(await page.getByRole('heading',{name:'Art for the way you live.'}).isVisible());
 assert.equal(await page.locator('section').filter({hasText:'Find your language.'}).locator('a[href^="/search?category="]').count()>0,true);
 pass('Editorial home uses current published category links');
 await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.textContent),'Skip to content');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement?.id),'main-content');
 pass('Keyboard skip link reaches the main landmark');
 const search=page.getByRole('button',{name:'Search pieces',exact:true});await search.click();
 const dialog=page.getByRole('dialog');await dialog.waitFor();await page.getByRole('searchbox').focus();await page.keyboard.press('Shift+Tab');assert.ok(await dialog.evaluate(el=>el.contains(document.activeElement)));await page.evaluate(()=>document.getElementById('main-content').focus());assert.ok(await dialog.evaluate(el=>el.contains(document.activeElement)));
 await page.keyboard.press('Escape');assert.ok(await search.evaluate(el=>el===document.activeElement));
 pass('Search dialog contains focus and restores its opener on Escape');
 await search.click();await page.getByRole('searchbox').fill('river');await page.getByRole('button',{name:'Explore results'}).click();await page.waitForURL('**/search?q=river');await page.getByRole('status').waitFor();
 pass('Search opens the database-backed filtered catalogue');
 await visit('/search?q=zzzz-unmatched-atelier');await page.getByRole('heading',{name:'A different starting point.'}).waitFor();await fits();pass('Empty search state remains readable');
 await visit('/pieces/river-channel');await page.screenshot({path:out+'/product-desktop.png',fullPage:true});
 const zoom=page.getByRole('button',{name:/enlarge|zoom|view larger/i}).first();await zoom.click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');assert.ok(await zoom.evaluate(el=>el===document.activeElement));pass('Product gallery enlargement closes with focus return');
 await page.setViewportSize({width:390,height:844});await visit('/');const menu=page.getByRole('button',{name:'Open navigation'});await menu.click();await page.getByRole('dialog').waitFor();await page.keyboard.press('Escape');assert.ok(await menu.evaluate(el=>el===document.activeElement));
 pass('Mobile menu preserves Escape and opener focus');
 await page.emulateMedia({reducedMotion:'reduce'});await visit('/');
 assert.equal(await page.locator('h1').evaluate(el=>getComputedStyle(el.parentElement).animationName),'none');await page.screenshot({path:out+'/home-mobile.png',fullPage:true});pass('Reduced motion leaves hero immediately visible');
 const publicRoutes=['/memory-art','/personal-art','/preserve','/personalize','/portfolio','/journal','/our-story','/process','/materials-care','/architects','/contact','/faq','/privacy','/terms','/accessibility','/shipping-delivery','/returns-cancellations','/commission/customize','/not-an-atelier-page'];
 for(const route of publicRoutes){await visit(route);await fits();assert.ok(await page.locator('h1').count(),route);const bg=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);assert.equal(bg,'rgb(8, 17, 29)',route);}
 pass('All public page groups and 404 reflow on mobile with the dark canvas');
 // Browser zoom halves the effective CSS viewport; unlike CSS zoom, it also
 // changes media-query evaluation. Emulate that 1440px-at-200% geometry here.
 await page.setViewportSize({width:720,height:500});await visit('/');await fits();await page.screenshot({path:out+'/home-200-percent-reflow.png',fullPage:true});pass('200 percent equivalent viewport reflows home without page overflow');
 await context.route('**/_next/image*',route=>route.abort());await visit('/pieces/river-channel');await page.getByText('Image unavailable',{exact:true}).first().waitFor();await fits();await context.unroute('**/_next/image*');pass('Image request failures show the existing accessible fallback');
 await visit('/studio/login');await page.getByLabel('Staff ID',{exact:true}).fill(qa.STUDIO_ADMIN_ID);await page.getByLabel('Password',{exact:true}).fill(qa.STUDIO_ADMIN_PASSWORD);await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.waitForURL(base+'/studio');
 const studioRoutes=['/studio','/studio/inquiries','/studio/follow-ups','/studio/products','/studio/content','/studio/media','/studio/activity','/studio/staff','/studio/settings'];
 for(const width of [1440,1200,1024,768,390,320]){
  await page.setViewportSize({width,height:1000});
  for(const route of studioRoutes){await visit(route);await fits();assert.equal(await page.getByRole('heading',{level:1}).count(),1,route);}
  await visit('/studio');await page.screenshot({path:out+'/studio-'+width+'.png',fullPage:true});
 }
 pass('All nine authenticated Studio routes reflow at six viewport sizes');
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['/studio/products','/studio/content','/studio/media']){
   await visit(route);await page.locator('main button[aria-pressed],main [class*="mediaGrid"] button').first().click();await page.waitForLoadState('networkidle');await fits();await page.screenshot({path:out+'/editor-'+route.split('/').pop()+'-'+width+'.png',fullPage:true});
  }
 }
 pass('Catalogue, content and media editors open and reflow without changing records');
 await context.clearCookies();await visit('/studio/settings');assert.match(page.url(),/\/studio\/login/);pass('Expired session returns to the existing sign-in boundary');
 assert.deepEqual(errors,[]);pass('No browser page errors during redesigned UI interactions');
}finally{
 fs.writeFileSync(out+'/results.json',JSON.stringify({at:new Date().toISOString(),results,errors,scope:'isolated QA only',limitations:'Zoom geometry is emulated, not a physical browser zoom check; assistive-technology and owner visual review remain separate.'},null,2));
 await browser.close();
}
