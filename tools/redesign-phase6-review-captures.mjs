import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {localBrowser,origin} from './redesign-phase6-session.mjs';
const {browser,context}=await localBrowser(),out='output/playwright/redesign-phase6';
const checks=[];const check=(name,pass)=>{assert.ok(pass,name);checks.push(name);};
try{
 const p=await context.newPage();await p.setViewportSize({width:390,height:844});
 const training=JSON.parse(await readFile('experiments/redesign-phase1/preview-data.json','utf8')).orders;
 await p.route('**/api/studio/orders?*',route=>route.request().method()==='GET'?route.fulfill({json:{orders:training.map((o,i)=>({id:'phase6-training-'+i,client:o.client,title:o.title,status:o.stage,version:1,source:'manual'})),hasMore:false}}):route.abort());
 await p.goto(origin+'/studio/inquiries?mode=board',{waitUntil:'networkidle'});await p.locator('.order-card').first().waitFor();await p.getByLabel(/^Visible board stage/).selectOption('CLOSED');
 await p.locator('main').evaluate(e=>{const b=document.createElement('p');b.textContent='LOCAL TRAINING PREVIEW — 24 fictional examples. No database writes or customer messages.';e.prepend(b);});
 check('Closed stage visible',await p.locator('[data-order-stage="CLOSED"]').isVisible());check('Three closed training records visible',await p.locator('[data-order-stage="CLOSED"] .order-card:visible').count()===3);
 await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,0);});await p.screenshot({path:out+'/390-training-closed.png',fullPage:true});
 await p.close();const gallery=await context.newPage();for(const width of [1440,390]){
  await gallery.setViewportSize({width,height:900});const response=await gallery.goto('http://127.0.0.1:4183/review',{waitUntil:'networkidle'});check(width+' gallery opens',response.status()===200);
  check(width+' all gallery images decode',await gallery.locator('img').evaluateAll(async images=>{await Promise.all(images.map(img=>img.decode()));return images.every(img=>img.naturalWidth>0);}));
  check(width+' no gallery document overflow',await gallery.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }
 const urls=await gallery.locator('a[href^="/images/"]').evaluateAll(links=>[...new Set(links.map(a=>a.href))]);for(const url of urls){check('Gallery linked capture resolves '+new URL(url).pathname,(await fetch(url)).status===200);}
 const pdf=await fetch('http://127.0.0.1:4183/saved-inquiry-card.pdf');check('Saved card PDF resolves',pdf.status===200&&Buffer.from(await pdf.arrayBuffer()).subarray(0,4).toString()==='%PDF');
}finally{await browser.close();await writeFile(out+'/review-captures.json',JSON.stringify({checks,scope:'Reviewer requested Closed-stage full-page recapture plus local gallery link/image/PDF validation; no database writes'},null,2)+'\n');}
console.log(JSON.stringify({checks:checks.length}));
