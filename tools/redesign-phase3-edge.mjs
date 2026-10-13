import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
const out='output/playwright/redesign-phase3',baseline=JSON.parse(await readFile(out+'/baseline.json','utf8'));
const report={checks:[],scope:'Local browser checks; locale cookie and saved-piece localStorage only; no business writes'};
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const origin='http://127.0.0.1:4199';
const check=(name,value)=>{assert.ok(value,name);report.checks.push(name);};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await page.goto(origin,{waitUntil:'networkidle'});
 check('Shared header copy unchanged',await page.locator('header').first().textContent()===baseline.header);
 check('Shared footer copy unchanged',await page.locator('footer').textContent()===baseline.footer);
 const normalize=rows=>rows.map(([alt,style,src])=>[alt,style,new URL(src,origin).searchParams.get('url')||src]);
 assert.deepEqual(normalize(await page.locator('main img').evaluateAll(ns=>ns.map(i=>[i.alt,i.getAttribute('style'),i.getAttribute('src')]))),normalize(baseline.media));report.checks.push('All original main image associations, alt text and inline crops retained');
 const firstDoor=page.locator('[data-collection-door]').first();await firstDoor.scrollIntoViewIfNeeded();const before=await firstDoor.boundingBox();await firstDoor.focus();const after=await firstDoor.boundingBox();check('Category keyboard focus preserves stable target size',Math.abs(before.width-after.width)<1);
 const save=page.getByRole('button',{name:/^Save to saved pieces:/}).first();await save.click();check('Save-piece local shortlist works',await page.getByRole('button',{name:/^Remove from saved pieces:/}).count()>0);
 const search=page.locator('header button[aria-haspopup=dialog]').first();await search.click();await page.locator('dialog[open] input[name=q]').fill('River');await page.locator('dialog[open] button[type=submit]').click();await page.waitForURL('**/search?q=River');await page.waitForLoadState('networkidle');check('Search GET reaches real results',await page.locator('main').textContent().then(t=>t.includes('River')));
 for(const locale of ['hi','gu','en']){
  await page.goto(origin,{waitUntil:'networkidle'});
  await Promise.all([page.waitForResponse(r=>r.url().endsWith('/api/locale')&&r.status()===200),page.locator('header select').selectOption(locale)]);
  await page.waitForTimeout(400);
  check(locale+' locale selector persists',await page.locator('header select').inputValue()===locale);
  check(locale+' retains homepage with no overflow',await page.locator('h1').count()===1&&await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }
 await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}});
 await page.waitForTimeout(1000);
 const broken=await page.locator('img').evaluateAll(ns=>ns.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.alt));check('Every image loads after scrolling',broken.length===0);
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const staticPage=await nojs.newPage();await staticPage.goto(origin,{waitUntil:'networkidle'});
 check('JavaScript-disabled homepage keeps original heading',await staticPage.locator('h1').textContent()==='Art for the way you live.');
 check('JavaScript-disabled navigation fallback remains available',await staticPage.locator('header noscript details summary').isVisible());
 check('JavaScript-disabled chapter navigation works',await staticPage.getByRole('navigation',{name:'On this page',exact:true}).locator('summary').isVisible());
 await nojs.close();
}finally{await browser.close();await writeFile(out+'/edge-verification.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify(report));
