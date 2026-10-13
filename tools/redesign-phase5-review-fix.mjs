import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {localBrowser,origin} from './old-design-migration/local-browser.mjs';
const {browser,context}=await localBrowser();const report={scope:'F1 design-comparison first-column readability only',checks:[],captures:[]};
try{
 for(const width of [1440,390,320]){
  const page=await context.newPage();await page.setViewportSize({width,height:width===1440?1000:844});await page.goto(origin+'/studio/sections',{waitUntil:'networkidle'});
  const table=page.locator('[aria-label="Design comparison"] table'),wrap=table.locator('..');
  const metrics=await table.evaluate(e=>({width:e.getBoundingClientRect().width,headers:[...e.querySelectorAll('th:first-child')].map(h=>({width:h.getBoundingClientRect().width,wrap:getComputedStyle(h).overflowWrap,break:getComputedStyle(h).wordBreak})),overflow:document.documentElement.scrollWidth>innerWidth+1}));
  assert.ok(metrics.width>=560);assert.ok(metrics.headers.every(h=>h.width>=148&&h.wrap==='normal'&&h.break==='normal'));assert.equal(metrics.overflow,false);
  report.checks.push(width+' readable minimum widths',width+' normal header word wrapping',width+' no document overflow');
  if(width<700){const scrolled=await wrap.evaluate(e=>{e.scrollLeft=100;return e.scrollLeft>0;});assert.ok(scrolled);await wrap.evaluate(e=>{e.scrollLeft=0;});report.checks.push(width+' comparison still scrolls');}
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,0);});await page.waitForTimeout(250);let file=width+'-full-sections.png';await page.screenshot({path:'output/playwright/redesign-phase5/'+file,fullPage:true});report.captures.push(file);
  await table.scrollIntoViewIfNeeded();await page.waitForTimeout(200);file=width+'-comparison-fixed.png';await page.screenshot({path:'output/playwright/redesign-phase5/'+file});report.captures.push(file);
  await page.getByRole('button',{name:'Check latest saved version',exact:true}).click();await page.getByText('Latest saved design loaded for comparison. Your edits are retained.',{exact:true}).waitFor();
  assert.equal(await table.locator('thead th').count(),4);assert.ok(await table.locator('th:first-child').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().width>=148&&getComputedStyle(e).overflowWrap==='normal')));
  await wrap.evaluate(e=>{e.scrollLeft=e.scrollWidth;});assert.ok(await table.locator('thead th').last().evaluate(e=>{const a=e.getBoundingClientRect(),b=e.closest('[data-studio-part=tableWrap]').getBoundingClientRect();return a.right<=b.right+1;}));
  report.checks.push(width+' Latest saved fourth column accessible');await wrap.evaluate(e=>{e.scrollLeft=0;});await table.scrollIntoViewIfNeeded();await page.waitForTimeout(200);file=width+'-comparison-latest-fixed.png';await page.screenshot({path:'output/playwright/redesign-phase5/'+file});report.captures.push(file);await page.close();
 }
}finally{await browser.close();await writeFile('output/playwright/redesign-phase5/review-fix.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({checks:report.checks.length,captures:report.captures.length}));
