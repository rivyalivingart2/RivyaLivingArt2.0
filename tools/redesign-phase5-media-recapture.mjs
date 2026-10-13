import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {localBrowser,origin} from './old-design-migration/local-browser.mjs';
const {browser,context}=await localBrowser();
try{
 const page=await context.newPage();await page.goto(origin+'/studio/media',{waitUntil:'networkidle'});
 await page.locator('[data-studio-part=mediaGrid] img').first().waitFor();
 // Screenshot preparation only: decode the existing lazy sources without
 // changing application code, image selection, crop or database associations.
 const images=await page.locator('[data-studio-part=mediaGrid] img').evaluateAll(async es=>{
  es.forEach(e=>{e.loading='eager';});await Promise.all(es.map(e=>e.decode().catch(()=>{})));
  return es.map(e=>({loaded:e.complete&&e.naturalWidth>0}));
 });
 assert.ok(images.every(e=>e.loaded));await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,0);});await page.waitForTimeout(400);
 await page.screenshot({path:'output/playwright/redesign-phase5/1440-full-media.png',fullPage:true});
 await writeFile('output/playwright/redesign-phase5/media-recapture.json',JSON.stringify({scope:'Reviewer-requested replacement of desktop media capture after existing lazy images decode',images:images.length,allDecoded:true,documentTop:await page.evaluate(()=>scrollY===0),sourceChanged:false},null,2)+'\n');
 console.log(JSON.stringify({images:images.length,allDecoded:true}));
}finally{await browser.close();}
