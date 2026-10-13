import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {localBrowser,origin} from './old-design-migration/local-browser.mjs';
const {browser,context,api}=await localBrowser(),out='output/playwright/redesign-phase5';
const report={scope:'Reviewer-requested full-page desktop/mobile captures from document top and preview gallery smoke check',checks:[],captures:[]};
const rows=(await api('/api/studio/content?view=editor')).entries;
const article=rows.find(e=>e.document.kind==='article'&&e.visible&&e.version>0);
try{
 for(const width of [1440,390]){
  const page=await context.newPage();await page.setViewportSize({width,height:width===390?844:1000});
  for(const surface of ['products','journal','article','sections','media','gujarati']){
   const path=surface==='article'||surface==='gujarati'?'/studio/journal?record='+encodeURIComponent(article.document.id):'/studio/'+surface;
   await page.goto(origin+path,{waitUntil:'domcontentloaded'});await page.waitForLoadState('networkidle',{timeout:8000}).catch(()=>{});await page.locator('#main-content h1').first().waitFor();
   if(surface==='products'){await page.getByRole('searchbox',{name:'Find a piece',exact:true}).fill('River Channel');await page.getByRole('button',{name:/River Channel.*Published/}).first().click();await page.getByRole('button',{name:'Open existing product editing controls',exact:true}).click();}
   if(surface==='gujarati'){await page.locator('summary').filter({hasText:'Translations and review'}).click();await page.getByLabel(/^Translation language/).selectOption('gu');}
   await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,0);});await page.waitForTimeout(400);
   assert.equal(await page.evaluate(()=>scrollY),0);const file=width+'-full-'+surface+'.png';await page.screenshot({path:out+'/'+file,fullPage:true});report.captures.push(file);report.checks.push(width+' '+surface+' full page from top');
  }
  await page.goto('http://127.0.0.1:4182/review',{waitUntil:'networkidle'});
  const targets=await page.locator('a[href^="/images/"],img').evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href')||e.getAttribute('src')))]);
  for(const target of targets){const response=await page.request.get('http://127.0.0.1:4182'+target);assert.equal(response.status(),200,target);}
  assert.ok(await page.locator('img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));report.checks.push(width+' gallery images and links resolve; no overflow');await page.close();
 }
}finally{await browser.close();await writeFile(out+'/review-captures.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({checks:report.checks.length,captures:report.captures.length}));
