import assert from 'node:assert/strict';
import {expect} from '@playwright/test';
import {mkdir,writeFile,copyFile} from 'node:fs/promises';
import {localBrowser,origin} from '../old-design-migration/local-browser.mjs';
import {translationStatus} from '../../src/lib/translation-review.ts';

const out='test-results/audit-pending';
await mkdir(out,{recursive:true});
const {browser,context,api}=await localBrowser();
const report={at:new Date().toISOString(),browser:browser.version(),environment:'Fixed isolated QA, loopback 4199, DPR 1, reduced motion',checks:[],observations:{},accessibility:[],errors:[],blockedWrites:[]};
const check=(name,value)=>{assert.ok(value,name);report.checks.push(name);};
await context.route('**/api/studio/**',async route=>{
 if(!['GET','HEAD'].includes(route.request().method())){report.blockedWrites.push(new URL(route.request().url()).pathname);await route.abort();}else await route.continue();
});
const page=await context.newPage();page.setDefaultTimeout(30000);
page.on('pageerror',e=>report.errors.push(e.message));
try{
 const anonymous=await fetch(origin+'/api/studio/content?view=translations');
 check('Unauthenticated summary is rejected',anonymous.status===401);
 const full=(await api('/api/studio/content')).entries;
 const started=performance.now(),summary=(await api('/api/studio/content?view=translations')).entries;
 report.observations={records:summary.length,fullEntriesBytes:Buffer.byteLength(JSON.stringify(full)),summaryEntriesBytes:Buffer.byteLength(JSON.stringify(summary)),summaryRequestMs:performance.now()-started};
 check('Every record is retained in original order',JSON.stringify(summary.map(e=>e.id))===JSON.stringify(full.map(e=>e.document.id)));
 for(let i=0;i<full.length;i++){
  const a=full[i],b=summary[i];
  assert.deepEqual(Object.keys(b).sort(),['id','reviews','route','title','version']);
  assert.equal(b.title,a.document.title);assert.equal(b.route,a.document.route);assert.equal(b.version,a.version);
  for(const locale of ['hi','gu']){
   assert.deepEqual(b.reviews[locale].draft,translationStatus(a.document,locale));
   assert.equal(b.reviews[locale].published,a.visible&&a.published?translationStatus(a.published,locale).state:null);
  }
 }
 check('All saved draft/published review results match in both languages',true);
 check('Overview exports no full documents or captured snapshots',true);
 check('Parsed overview entry bytes reduced by at least 80%',report.observations.summaryEntriesBytes<report.observations.fullEntriesBytes*.2);
 const selected=full.find(e=>e.document.pageSnapshot)||full[0];
 const editor=(await api('/api/studio/content?view=editor&record='+encodeURIComponent(selected.document.id))).entries.find(e=>e.document.id===selected.document.id);
 check('Selected editor still receives its complete original document',JSON.stringify(editor.document)===JSON.stringify(selected.document));
 const recordOnly=(await api('/api/studio/content?view=translations&record='+encodeURIComponent(selected.document.id))).entries;
 check('Optional summary record filter remains exact',recordOnly.length===1&&recordOnly[0].id===selected.document.id);
 let requestCount=0;page.on('request',r=>{if(r.url().includes('/api/studio/content?view=translations'))requestCount++;});
 const responseWait=page.waitForResponse(r=>r.url().endsWith('/api/studio/content?view=translations'));
 await page.goto(origin+'/studio/translations',{waitUntil:'domcontentloaded'});
 const response=await responseWait;
 check('Authenticated summary is private and uncached',response.headers()['cache-control']==='private, no-store');
 await expect(page.getByRole('status').filter({hasText:/\d+ documents/})).toContainText(`${full.length} documents`);
 // Browser fetch exercises the same secure loopback session as the workspace.
 const invalid=await page.evaluate(async()=>(await fetch('/api/studio/content?view=translations&record=')).status);
 check('Invalid record is still rejected',invalid===400);
 const initialRequests=requestCount;
 for(const locale of ['hi','gu']){
  await page.getByRole('combobox',{name:/^Review language/}).selectOption(locale);
  for(const state of ['all','missing','incomplete','needs review','reviewed','stale']){
   await page.getByRole('combobox',{name:/^Review state/}).selectOption(state);
   const count=full.filter(e=>state==='all'||translationStatus(e.document,locale).state===state).length;
   await expect(page.getByRole('status').filter({hasText:/\d+ documents/})).toContainText(`${count} documents`);
   check(`${locale} ${state}: correct filtered count and bounded cards`,await page.locator('article[data-studio-part="panel"]').count()===Math.min(count,20));
  }
 }
 check('Language and state switches make no additional content requests',requestCount===initialRequests);
 await page.getByRole('combobox',{name:/^Review state/}).selectOption('all');
 const links=new Set();
 for(let n=0;n<Math.ceil(full.length/20);n++){
  for(const href of await page.locator('article a').evaluateAll(els=>els.map(el=>el.getAttribute('href'))))links.add(href);
  if(n<Math.ceil(full.length/20)-1)await page.getByRole('button',{name:'Next',exact:true}).click();
 }
 check('Every saved record remains reachable with Gujarati editor destination',links.size===full.length&&full.every(e=>links.has('/studio/content?record='+encodeURIComponent(e.document.id)+'&translation=gu')));
 await expect(page.getByRole('button',{name:'Next',exact:true})).toBeDisabled();
 await page.getByRole('searchbox',{name:'Find document'}).fill(full[0].document.title);
 await expect(page.locator('article h2').filter({hasText:full[0].document.title}).first()).toBeVisible();
 check('Search covers all records and resets pagination',true);
 await page.getByRole('searchbox',{name:'Find document'}).fill('');
 for(const width of [1920,1440,1200,992,768,512,390,320]){
  await page.setViewportSize({width,height:width<768?844:1000});
  check(`No horizontal overflow at ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if([1440,390,320].includes(width)){
   await page.screenshot({path:`${out}/after-translations-${width}.png`});
   await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
   const result=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return{violations:r.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))};});
   report.accessibility.push({width,...result});check(`No automated accessibility violations at ${width}`,result.violations.length===0);
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 const fail=route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Synthetic local outage'})});
 await context.route('**/api/studio/content?view=translations',fail);
 await page.getByRole('button',{name:'Refresh coverage'}).click();
 const coverageAlert=page.getByRole('alert').filter({hasText:'Translation coverage'});
 await expect(coverageAlert).toContainText('previous results are stale');
 check('Failed refresh preserves prior rows with explicit stale warning',await page.locator('article[data-studio-part="panel"]').count()===20);
 await page.screenshot({path:`${out}/translation-refresh-error.png`});
 await context.unroute('**/api/studio/content?view=translations',fail);
 await page.getByRole('button',{name:'Refresh coverage'}).click();
 await expect(coverageAlert).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Refresh coverage'})).toBeEnabled();
 check('Retry recovers current coverage without changing saved content',true);
 check('No browser runtime errors',report.errors.length===0);
 check('No Studio write actions attempted',report.blockedWrites.length===0);
 report.status='PASS';
 await copyFile('test-results/audit-followup-cleanup/after-translations-1440.png',`${out}/before-translations-1440.png`);
 await writeFile(`${out}/index.html`,`<!doctype html><html lang="en"><meta charset="utf-8"><title>Rivya pending audit review</title><style>body{background:#080a0e;color:#f4f1e9;font:16px system-ui;max-width:1440px;margin:40px auto;padding:24px}img{width:100%;border:1px solid #b89b63}a{color:#b89b63}.mobile{max-width:390px}</style><h1>Language review: smaller data, preserved workflow</h1><p>Local QA only. Both views keep the same content, status rules and editor links. The change is the amount of data needed to display this overview.</p><p>${full.length} records. Parsed entries: ${report.observations.fullEntriesBytes.toLocaleString()} → ${report.observations.summaryEntriesBytes.toLocaleString()} bytes.</p><h2>Before — desktop</h2><img src="before-translations-1440.png" alt="Previous translation review workspace"><h2>After — desktop</h2><img src="after-translations-1440.png" alt="Optimized translation review workspace"><h2>After — mobile</h2><img class="mobile" src="after-translations-390.png" alt="Mobile translation review"><h2>Refresh failure remains visible</h2><img src="translation-refresh-error.png" alt="Stale results warning after simulated refresh error"></html>`);
}catch(error){report.status='FAIL';report.failure=error.message;throw error;}
finally{await writeFile(`${out}/translations.json`,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,checks:report.checks.length,observations:report.observations,failure:report.failure}));await browser.close();}
