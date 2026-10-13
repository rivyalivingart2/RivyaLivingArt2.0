import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const out='output/playwright/redesign-phase3',report={checks:[],captures:[],scope:'Static synthetic fixtures; no database writes'};
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 for(const width of [1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:width<700?844:1000},reducedMotion:'reduce'});
  for(const variant of ['all','classic','editorial','empty']){
   await page.goto('http://127.0.0.1:4180/'+variant,{waitUntil:'networkidle'});
   assert.equal(await page.locator('h1').count(),1);report.checks.push(variant+' '+width+' one H1');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));report.checks.push(variant+' '+width+' no overflow');
   if(variant==='all'){
    assert.equal(await page.locator('[data-home-slot]').count(),18);report.checks.push(width+' all 18 conditional slots render');
    assert.ok(await page.getByText('Concept project · not a completed commission',{exact:true}).count());assert.ok(await page.getByText('Fictional sample · not customer feedback',{exact:true}).count());report.checks.push(width+' truthful disclosures remain');
    if(width===1440||width===390)for(const slot of ['work','words','workshops','journal']){
     await page.locator('[data-home-slot="'+slot+'"]').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY));
     await page.waitForFunction(()=>[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0}).every(i=>i.complete&&i.naturalWidth>0));
     const name=width+'-fixture-'+slot+'.png';await page.screenshot({path:out+'/'+name});report.captures.push(name);
    }
   }
  }
  await page.close();
 }
}finally{await browser.close();await writeFile(out+'/fixtures-verification.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify(report));
