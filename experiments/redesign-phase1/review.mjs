import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const out='output/playwright/redesign-phase1';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={scope:'Standalone Phase 1 prototype only; browser emulation, no production writes',at:new Date().toISOString(),pages:[],interactions:[],errors:[],externalRequests:[]};
try{
for(const width of [1440,390]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:1000},isMobile:width===390,hasTouch:width===390,reducedMotion:'reduce'});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4178'))report.externalRequests.push(r.url());});
 for(const view of ['home','product','journal','studio']){
  await page.goto('http://127.0.0.1:4178/?view='+view);await page.waitForFunction(()=>window.previewReady===true);await page.evaluate(()=>document.fonts.ready);
  await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode().catch(()=>{}))));
  const findings=await page.evaluate(()=>({h1:document.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),bodyWidth:document.documentElement.scrollWidth,contentHeight:document.documentElement.scrollHeight,logoFilter:getComputedStyle(document.querySelector('.logo img')).filter}));
  await page.screenshot({path:`${out}/${view}-${width}.png`,fullPage:true});await page.screenshot({path:`${out}/${view}-${width}-opening.png`});
  report.pages.push({view,width,...findings});
  if(view==='product'){
   await page.getByRole('button',{name:'Show River Channel room visualization'}).click();report.interactions.push({width,test:'product gallery switches image',pass:(await page.locator('.selected-image').getAttribute('src'))==='/assets/room'});
   await page.locator('#save-preview').click();report.interactions.push({width,test:'preview save toggle',pass:await page.locator('#save-preview').getAttribute('aria-pressed')==='true'});
   await page.getByRole('button',{name:'Customize this piece'}).click();report.interactions.push({width,test:'safe prototype notice',pass:await page.locator('dialog').isVisible()});await page.keyboard.press('Escape');
   await page.getByText('Ordering & delivery',{exact:true}).click();report.interactions.push({width,test:'ordering explanation expands',pass:await page.locator('details').last().getAttribute('open')!==null});
  }
  if(view==='studio'){
   for(const stage of ['NEW','COMPLETED','CLOSED']){await page.locator(`[data-stage="${stage}"]`).click();report.interactions.push({width,test:`studio ${stage} shows three examples`,pass:await page.locator('[data-order]').count()===3});}
   await page.locator('#order-search').fill('not-a-record');report.interactions.push({width,test:'search empty state',pass:await page.locator('.empty-result').isVisible()});
   await page.locator('#order-search').fill('');await page.locator('[data-detail="History"]').click();report.interactions.push({width,test:'history does not invent events',pass:await page.getByText('This specimen does not invent events or dates.',{exact:false}).isVisible()});
  }
  if(view==='home'){
   await page.getByRole('link',{name:'Shallow Basin Coffee Table'}).click();report.interactions.push({width,test:'Shallow Basin does not open wrong product',pass:await page.locator('dialog').isVisible()&&(await page.locator('#dialog-message').textContent()).includes('Shallow Basin')});await page.keyboard.press('Escape');
   const separation=await page.locator('.film').evaluate(f=>{const a=f.querySelector('.film-control').getBoundingClientRect(),b=f.querySelector('figcaption').getBoundingClientRect();return a.bottom<=b.top;});report.interactions.push({width,test:'film control clears caption',pass:separation});
   await page.locator('#film-toggle').click();await page.waitForTimeout(400);report.interactions.push({width,test:'film starts on request',pass:await page.locator('video').evaluate(v=>!v.paused&&v.currentTime>0)});
   await page.locator('#film-toggle').click();report.interactions.push({width,test:'film pauses',pass:await page.locator('video').evaluate(v=>v.paused)});
  }
 }
 await context.close();
}
}finally{await browser.close();writeFileSync(out+'/review.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({pages:report.pages,interactions:report.interactions,errors:report.errors,externalRequests:report.externalRequests}));
