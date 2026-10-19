import assert from 'node:assert/strict';
import {expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {localBrowser,origin} from '../old-design-migration/local-browser.mjs';

// Unsaved, isolated UI regressions. Reject every Studio mutation after login.
const out='test-results/rivya-master-audit';await mkdir(out,{recursive:true});
const {browser,context,api}=await localBrowser();
const report={at:new Date().toISOString(),browser:browser.version(),scope:'Isolated QA, unsaved UI, no Studio writes',checks:[],errors:[],blockedWrites:[]};
const samePage=process.argv.includes('--same-page');
const pending=new Map();
report.navigation=[];report.browserErrors=[];report.phase='starting';
const phase=name=>{report.phase=name;console.log('Studio regression: '+name);};
const check=(name,value)=>{assert.ok(value,name);report.checks.push(name);};
await context.route('**/api/studio/**',async route=>{if(!['GET','HEAD'].includes(route.request().method())){report.blockedWrites.push(new URL(route.request().url()).pathname);await route.abort();}else await route.continue();});
try{
 const dialogs=[];let decision='accept';report.dialogEvents=[];
 const newPage=async()=>{
  const p=await context.newPage();p.setDefaultTimeout(30000);p.setDefaultNavigationTimeout(30000);
  p.on('request',request=>pending.set(request,{type:request.resourceType(),path:new URL(request.url()).pathname}));
  p.on('requestfinished',request=>pending.delete(request));
  p.on('requestfailed',request=>pending.delete(request));
  p.on('pageerror',error=>report.browserErrors.push(error.message));
  p.on('requestfailed',request=>{if(request.isNavigationRequest())report.navigation.push({event:'failed',path:new URL(request.url()).pathname,error:request.failure()?.errorText});});
  p.on('response',response=>{if(response.request().isNavigationRequest())report.navigation.push({event:'response',path:new URL(response.url()).pathname,status:response.status()});});
  p.on('domcontentloaded',()=>report.navigation.push({event:'domcontentloaded',path:new URL(p.url()).pathname}));
  p.on('dialog',async d=>{report.dialogEvents.push({type:d.type(),message:d.message()});if(d.type()==='confirm')dialogs.push(d.message());await d[decision]();});
  return p;
 };
 let page=await newPage();
 phase('catalogue filters and pagination');await page.goto(origin+'/studio/products',{waitUntil:'domcontentloaded'});
 await page.getByRole('status').filter({hasText:'Drafts are shared across devices. Only published content appears on the website.'}).waitFor();
 const group=page.getByRole('group',{name:'Filter by collection'});await group.waitFor();
 const all=group.getByRole('button',{name:/^All pieces/});await all.focus();
 await page.keyboard.press('Tab');await page.keyboard.press('Space');
 await expect(group.getByRole('button',{name:/^Furniture/})).toHaveAttribute('aria-pressed','true');
 check('Keyboard selects Furniture filter as a pressed button',await group.getByRole('button',{name:/^Furniture/}).getAttribute('aria-pressed')==='true');
 check('Exactly one collection filter is pressed',await group.locator('[aria-pressed=true]').count()===1);
 await all.focus();await page.keyboard.press('Enter');
 await expect(all).toHaveAttribute('aria-pressed','true');
 check('Enter restores All pieces',await all.getAttribute('aria-pressed')==='true');
 check('Filters do not expose incomplete tab semantics',await group.getByRole('tab').count()===0);
 for(const width of [1920,1440,1200,992,768,512,390,320]){
  await page.setViewportSize({width,height:width<768?844:1000});
  const badge=page.locator('[aria-label^="Page "][aria-live=polite]');await badge.waitFor();
  check(`Pagination stays on one line and in view at ${width}`,await badge.evaluate(el=>{const r=el.getBoundingClientRect();return getComputedStyle(el).whiteSpace==='nowrap'&&r.height>=44&&el.scrollWidth<=el.clientWidth&&document.documentElement.scrollWidth<=innerWidth+1;}));
  if([1440,390].includes(width)){await badge.scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/after-pagination-${width}.png`});}
 }
 const badge=page.locator('[aria-label^="Page "][aria-live=polite]');
 const first=await badge.getAttribute('aria-label');await page.getByRole('button',{name:'Next',exact:true}).click();
 await expect(badge).not.toHaveAttribute('aria-label',first);
 check('Next changes the current page',await badge.getAttribute('aria-label')!==first);
 await page.getByRole('button',{name:'Prev',exact:true}).click();await expect(badge).toHaveAttribute('aria-label',first);check('Previous restores the current page',await badge.getAttribute('aria-label')===first);
 await page.setViewportSize({width:1440,height:1000});
 const entries=(await api('/api/studio/content?view=editor')).entries;
 const entry=entries.find(e=>e.document.kind==='article');assert.ok(entry);
 const route=origin+'/studio/journal?record='+encodeURIComponent(entry.document.id);
 phase('journal initial navigation');
 report.preJournal=await page.evaluate(()=>({readyState:document.readyState,dirty:document.querySelectorAll('[data-unsaved=true]').length,saving:document.querySelectorAll('[data-studio-saving=true]').length}));
 report.preJournalPending=[...pending.values()];
 if(!samePage){await page.close();page=await newPage();}report.independentJournalPage=!samePage;
 await page.goto(route,{waitUntil:'domcontentloaded'});const title=page.locator('#content-field-title');
 await page.getByRole('status').filter({hasText:'Drafts are shared. Public pages use only a published revision.'}).waitFor();
 check('Initial journal title matches the saved fixture',await title.inputValue()===entry.document.title);
 await title.fill(entry.document.title+' [unsaved local audit]');await page.locator('[data-unsaved=true]').waitFor();
 phase('journal regular return guard');
 decision='dismiss';
 const back=page.getByRole('link',{name:/Return to filtered records/});
 await back.click();check('Cancel shows a single discard confirmation',dialogs.length===1);
 check('Cancel preserves unsaved title',await title.inputValue()===entry.document.title+' [unsaved local audit]');
 decision='accept';await back.click();await page.waitForURL('**/studio/journal');await page.getByRole('heading',{name:'Journal',exact:true}).waitFor();
 check('Confirmed return adds exactly one confirmation',dialogs.length===2);
 phase('journal modified-click return guard');
 await page.goto(route,{waitUntil:'domcontentloaded'});
 await page.getByRole('status').filter({hasText:'Drafts are shared. Public pages use only a published revision.'}).waitFor();
 check('Reopened journal title matches the saved fixture',await title.inputValue()===entry.document.title);
 await title.fill(entry.document.title+' [unsaved local audit]');await page.locator('[data-unsaved=true]').waitFor();
 check('Second unsaved edit is present before modified click',await title.inputValue()===entry.document.title+' [unsaved local audit]');
 const popupPromise=context.waitForEvent('page');await back.click({modifiers:['Control']});const popup=await popupPromise;await popup.close();
 report.modifiedReturn={confirmations:dialogs.length,draftRetained:await title.inputValue()===entry.document.title+' [unsaved local audit]',dirty:await page.locator('[data-unsaved=true]').count(),sameRoute:page.url()===route};
 check('Opening return in a new tab does not prompt or discard the original draft',report.modifiedReturn.confirmations===2&&report.modifiedReturn.draftRetained);
 decision='dismiss';await back.click();check('Modified click did not disable the later unsaved guard',dialogs.length===3&&await title.isVisible());
 decision='accept';await back.click();await page.waitForURL('**/studio/journal');
 await page.getByRole('heading',{name:'Journal',exact:true}).waitFor();
 await expect(page.locator('[data-unsaved=true]')).toHaveCount(0);
 check('Draft leave guard still confirms once after modified click',dialogs.length===4);
 phase('keyboard comparison scroll');await page.setViewportSize({width:390,height:844});await page.goto(origin+'/studio/sections',{waitUntil:'domcontentloaded'});
 const region=page.getByRole('region',{name:'Saved and current design comparison'});await region.waitFor();await region.scrollIntoViewIfNeeded();await region.focus();
 check('Comparison scroll region receives keyboard focus',await region.evaluate(el=>document.activeElement===el));
 await page.keyboard.press('ArrowRight');await page.waitForTimeout(150);
 check('ArrowRight scrolls the overflowing comparison',await region.evaluate(el=>el.scrollWidth>el.clientWidth&&el.scrollLeft>0));
 await page.screenshot({path:out+'/after-comparison-390.png'});
 phase('related product gradients');for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:width<768?844:1000});await page.goto(origin+'/pieces/river-channel',{waitUntil:'domcontentloaded'});
  const related=page.locator('[data-public-part=related]');await related.waitFor();await related.scrollIntoViewIfNeeded();
  check(`Related grid has seamless gradient and no overflow at ${width}`,await related.evaluate(el=>getComputedStyle(el).backgroundImage.includes('gradient')&&document.documentElement.scrollWidth<=innerWidth+1));
  check(`Related products retain linked media at ${width}`,await related.locator('a[href^="/pieces/"] img').count()>0);
  if([1440,390].includes(width))await page.screenshot({path:`${out}/after-related-${width}.png`,fullPage:true});
 }
 check('No Studio write attempted',report.blockedWrites.length===0);report.status='pass';
}catch(error){report.status='fail';report.errors.push(error.message);process.exitCode=1;}
finally{report.pendingAtEnd=[...pending.values()];await browser.close();await writeFile(out+(samePage?'/studio-regressions-same-page.json':'/studio-regressions.json'),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report,null,2));
