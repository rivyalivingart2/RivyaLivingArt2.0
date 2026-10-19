import assert from 'node:assert/strict';
import {expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {localBrowser,origin} from '../old-design-migration/local-browser.mjs';
import {translationStatus} from '../../src/lib/translation-review.ts';

const before=process.argv.includes('--before'),out='test-results/audit-followup-cleanup';
await mkdir(out,{recursive:true});
const {browser,context,api}=await localBrowser();
const report={at:new Date().toISOString(),phase:before?'before':'after',browser:browser.version(),checks:[],accessibility:[],errors:[],blockedWrites:[],observations:{}};
const check=(name,value)=>{assert.ok(value,name);report.checks.push(name);};
await context.route('**/api/studio/**',async route=>{if(!['GET','HEAD'].includes(route.request().method())){report.blockedWrites.push(new URL(route.request().url()).pathname);await route.abort();}else await route.continue();});
const page=await context.newPage();page.setDefaultTimeout(30000);
page.on('pageerror',e=>report.errors.push(e.message));
async function scanAccessibility(name){
 await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
 const result=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return{violations:r.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))};});
 report.accessibility.push({name,viewport:page.viewportSize(),...result});
 check(`${name}: no automated accessibility violations`,result.violations.length===0);
}
try{
 await page.goto(origin+'/studio/translations',{waitUntil:'domcontentloaded'});
 await page.getByRole('heading',{name:'Language review.',exact:true}).waitFor();
 await expect(page.getByRole('status').filter({hasText:/\d+ documents/})).toBeVisible();
 const entries=(await api('/api/studio/content')).entries;
 report.observations.translations={records:entries.length,cards:await page.locator('article[data-studio-part="panel"]').count(),domElements:await page.locator('*').count(),parsedEntriesBytes:Buffer.byteLength(JSON.stringify(entries))};
 await page.evaluate(()=>{document.querySelector('input[type="search"]').addEventListener('input',()=>{const start=performance.now();requestAnimationFrame(()=>requestAnimationFrame(()=>{window.__filterPaintMs=performance.now()-start;}));},{once:true});});
 await page.getByRole('searchbox',{name:'Find document'}).fill(entries[0].document.title);
 await expect.poll(()=>page.evaluate(()=>typeof window.__filterPaintMs)).toBe('number');
 report.observations.translations.filterTwoFrameMs=await page.evaluate(()=>window.__filterPaintMs);
 await page.getByRole('searchbox',{name:'Find document'}).fill('');
 await page.screenshot({path:`${out}/${report.phase}-translations-1440.png`});
 if(!before){
  await scanAccessibility('Language review at 1440');
  check('Translation review cards are bounded',report.observations.translations.cards<=20);
  if(entries.length>20){
   const title=await page.locator('article h2').first().textContent();
   await page.getByRole('button',{name:'Next',exact:true}).click();
   await expect(page.locator('article h2').first()).not.toHaveText(title);
   check('Translation next page reaches different saved records',true);
   await page.getByRole('searchbox',{name:'Find document'}).fill(entries[0].document.title);
   await expect(page.locator('article h2').filter({hasText:entries[0].document.title}).first()).toBeVisible();
   check('Filtering searches all records and resets the page',true);
   await page.getByRole('searchbox',{name:'Find document'}).fill('');
  }
  await page.getByRole('combobox',{name:/^Review language/}).selectOption('gu');
  await expect(page.locator('article a').first()).toHaveAttribute('href',/translation=gu/);
  check('Gujarati review links retain the selected language',true);
  for(const locale of ['hi','gu']){
   await page.getByRole('combobox',{name:/^Review language/}).selectOption(locale);
   for(const state of ['all','missing','incomplete','needs review','reviewed','stale']){
    await page.getByRole('combobox',{name:/^Review state/}).selectOption(state);
    const count=entries.filter(e=>state==='all'||translationStatus(e.document,locale).state===state).length;
    await expect(page.getByRole('status').filter({hasText:/\d+ documents/})).toContainText(`${count} documents`);
    check(`${locale} ${state} count matches original source review semantics`,true);
   }
  }
  await page.getByRole('combobox',{name:/^Review language/}).selectOption('hi');
  await page.getByRole('combobox',{name:/^Review state/}).selectOption('all');
  const links=new Set();
  for(let n=0;n<Math.ceil(entries.length/20);n++){
   for(const href of await page.locator('article a').evaluateAll(els=>els.map(el=>el.getAttribute('href'))))links.add(href);
   if(n<Math.ceil(entries.length/20)-1)await page.getByRole('button',{name:'Next',exact:true}).click();
  }
  check('Every saved record remains reachable across pages',links.size===entries.length&&entries.every(e=>links.has('/studio/content?record='+encodeURIComponent(e.document.id)+'&translation=hi')));
  await expect(page.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
  await page.getByRole('combobox',{name:/^Review language/}).selectOption('gu');
  await expect(page.locator('[aria-label^="Page "][aria-live="polite"]')).toHaveAttribute('aria-label',/^Page 1 of/);
  check('Changing review language resets the last page',true);
  for(const width of [1920,1440,1200,992,768,512,390,320]){
   await page.setViewportSize({width,height:width<768?844:1000});
   check(`Language review has no overflow at ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  await page.locator('[data-studio-part="toolbar"]').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${out}/after-translations-320.png`});
  await scanAccessibility('Language review at 320');
  await page.setViewportSize({width:1440,height:1000});
  const navigation=page.getByRole('navigation',{name:'Studio navigation',exact:true});
  check('Desktop navigation offers 35 usable destinations',await navigation.getByRole('link').count()===35);
  check('Inactive tools absent from desktop navigation',await navigation.locator('a[href="/studio/import"],a[href="/studio/subscribers"]').count()===0);
  const finderButton=page.getByRole('button',{name:'Find a Studio page',exact:true});await finderButton.click();
  const finder=page.getByRole('dialog',{name:'Find a Studio page',exact:true});
  for(const query of ['import','subscribers']){await finder.getByRole('searchbox',{name:'Page name'}).fill(query);await expect(finder.getByText('No matching page. Try a different name.')).toBeVisible();}
  await finder.getByRole('searchbox',{name:'Page name'}).fill('orders');await expect(finder.getByRole('link',{name:/Inquiries & orders/})).toBeVisible();
  await page.keyboard.press('Escape');await expect(finderButton).toBeFocused();
  check('Finder excludes inactive tools, retains order alias and returns keyboard focus',true);
  await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Open Studio navigation'}).click();
  const mobile=page.getByRole('navigation',{name:'Mobile Studio pages'});
  check('Mobile navigation uses the same 35 destinations',await mobile.getByRole('link').count()===35);
  await page.getByRole('dialog',{name:'Studio navigation'}).screenshot({path:`${out}/after-navigation-390.png`});
  await page.keyboard.press('Escape');
  for(const [path,heading] of [['import','Bulk import.'],['subscribers','Subscribers.']]){await page.goto(origin+'/studio/'+path,{waitUntil:'domcontentloaded'});await expect(page.getByRole('heading',{name:heading,exact:true})).toBeVisible();check(`${path} authenticated bookmarked status route preserved`,true);}
  await page.setViewportSize({width:1440,height:1000});
 }
 let responseMode='error',requests=0;
 await context.route('**/api/studio/access-requests',async route=>{
  assert.equal(route.request().method(),'GET');requests++;
  if(responseMode==='pending')await new Promise(resolve=>setTimeout(resolve,600));
  await route.fulfill({status:responseMode==='error'?503:200,contentType:'application/json',body:JSON.stringify(responseMode==='error'?{error:'Access requests are unavailable.'}:{requests:responseMode==='rows'?[{id:'00000000-0000-4000-8000-000000000001',kind:'access',login:'fictional-cleanup-test',name:'Fictional QA request',contact:'qa.invalid',status:'pending',version:1,createdAt:'2026-10-19T00:00:00Z',expiresAt:null}]:[]})});
 });
 await page.goto(origin+'/studio/staff',{waitUntil:'domcontentloaded'});
 const panel=page.getByRole('region',{name:'Account & password requests'});
 await expect(panel.getByText('Access requests are unavailable.',{exact:true})).toBeVisible();
 report.observations.accessFailure={showsEmptySuccess:await panel.getByText(/No open requests/).count()};
 await panel.scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/${report.phase}-access-error-1440.png`});
 if(!before){
  await scanAccessibility('Request queue error at 1440');
  check('Failed request load does not claim the queue is empty',report.observations.accessFailure.showsEmptySuccess===0);
  responseMode='pending';await panel.getByRole('button',{name:'Refresh requests',exact:true}).click();
  await expect(panel.getByRole('button',{name:'Loading requests...'})).toBeDisabled();
  await expect(panel.getByText(/No open requests/)).toBeVisible();
  check('Read-only retry has loading feedback and restores a verified empty state',true);
  responseMode='rows';await panel.getByRole('button',{name:'Refresh requests',exact:true}).click();
  await expect(panel.getByRole('button',{name:'Review request',exact:true})).toBeEnabled();
  responseMode='error';await panel.getByRole('button',{name:'Refresh requests',exact:true}).click();
  await expect(panel.getByText('Access requests are unavailable.',{exact:true})).toBeVisible();
  await expect(panel.getByRole('button',{name:'Review request',exact:true})).toBeDisabled();
  check('A failed refresh keeps visible previous rows but blocks stale decisions',true);
  responseMode='rows';await panel.getByRole('button',{name:'Refresh requests',exact:true}).click();
  await expect(panel.getByRole('button',{name:'Review request',exact:true})).toBeEnabled();
  check('Successful retry enables request review again',true);
  for(const width of [1920,1440,1200,992,768,512,390,320]){
   await page.setViewportSize({width,height:width<768?844:1000});
   check(`Staff page has no overflow at ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  await page.setViewportSize({width:390,height:844});
  await panel.scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/after-access-390.png`});
  await scanAccessibility('Request queue recovered at 390');
 }
 report.observations.mockedReadRequests=requests;
 check('No Studio mutation attempted',report.blockedWrites.length===0);
 check('No browser runtime errors',report.errors.length===0);
 report.status='pass';
}catch(error){report.status='fail';report.failure=String(error);throw error;}
finally{await writeFile(`${out}/${report.phase}.json`,JSON.stringify(report,null,2)+'\n');await browser.close();console.log(JSON.stringify({status:report.status,phase:report.phase,checks:report.checks.length,observations:report.observations}));}
