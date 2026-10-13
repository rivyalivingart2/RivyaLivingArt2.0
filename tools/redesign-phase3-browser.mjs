import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
const out='output/playwright/redesign-phase3',origin='http://127.0.0.1:4199';
await mkdir(out,{recursive:true});
const baseline=JSON.parse(await readFile(out+'/baseline.json','utf8'));
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={checks:[],errors:[],captures:[],scope:'Local browser emulation; no production or record writes'};
const check=(name,condition)=>{assert.ok(condition,name);report.checks.push(name);};
try {
 for(const width of [1440,768,390,320]){
  const context=await browser.newContext({viewport:{width,height:width<700?844:1000},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto(origin,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  check(width+' one H1',await page.locator('h1').count()===1);
  check(width+' no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  assert.deepEqual(await page.locator('[data-home-slot]').evaluateAll(ns=>ns.map(n=>n.dataset.homeSlot)),baseline.slots);report.checks.push(width+' original slot order retained');
  assert.deepEqual(await page.locator('main a:not([href^="#"])').evaluateAll(ns=>ns.map(n=>[n.textContent,n.getAttribute('href')])),baseline.links.filter(([,href])=>!href.startsWith('#')));report.checks.push(width+' original content links and labels retained');
  check(width+' logo not recolored',await page.locator('header>a img').evaluate(i=>getComputedStyle(i).filter==='none'));
  check(width+' reduced motion static',await page.locator('[data-home-motion]').getAttribute('data-home-motion')==='static');
  check(width+' film not autoplaying',await page.locator('video').evaluateAll(ns=>ns.every(v=>v.paused&&!v.autoplay&&v.preload==='none')));
  if(width!==320){
   await page.screenshot({path:out+'/'+width+'-opening.png'});report.captures.push(width+'-opening.png');
   for(const slot of width===768?[]:['pieces','material','collections','closing']){
    await page.locator('[data-home-slot="'+slot+'"]').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-100));
    await page.waitForTimeout(350);
    await page.screenshot({path:out+'/'+width+'-'+slot+'.png'});report.captures.push(width+'-'+slot+'.png');
   }
   await page.locator('footer').evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-100));
   await page.waitForTimeout(350);await page.screenshot({path:out+'/'+width+'-footer.png'});report.captures.push(width+'-footer.png');
   if(width===1440||width===390){
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,40));}scrollTo(0,0);});
    await page.waitForTimeout(500);await page.screenshot({path:out+'/'+width+'-full.png',fullPage:true});report.captures.push(width+'-full.png');
   }
  }
  await page.evaluate(()=>scrollTo(0,0));
  const search=page.locator('header button[aria-haspopup="dialog"]').first();await search.click();
  check(width+' search dialog opens',await page.locator('dialog[open] input[name=q]').isVisible());
  await page.keyboard.press('Escape');
  check(width+' search restores focus',await search.evaluate(e=>e===document.activeElement));
  if(width<1101){
   const menu=page.locator('header button[aria-expanded]');await menu.click();
   check(width+' menu opens',await page.getByRole('navigation',{name:'Mobile navigation',exact:true}).isVisible());
   check(width+' body locked in menu',await page.evaluate(()=>getComputedStyle(document.body).overflow==='hidden'));
   if(width===390){await page.screenshot({path:out+'/390-menu.png'});report.captures.push('390-menu.png');}
   await page.keyboard.press('Escape');
   check(width+' menu restores focus',await menu.evaluate(e=>e===document.activeElement));
  }
  const contents=page.getByRole('navigation',{name:'On this page',exact:true});await contents.locator('summary').click();
  await contents.locator('a[href="#home-material"]').click();
  check(width+' native chapter anchor',new URL(page.url()).hash==='#home-material');
  if(width===1440){
   const video=page.locator('video');
   if(await video.count()){
    await page.getByRole('button',{name:'Play film',exact:false}).click();
    await page.waitForFunction(()=>{const v=document.querySelector('video');return v&&!v.paused&&v.currentTime>0},{timeout:15000});
    report.checks.push('Material film plays after deliberate click');
    await page.getByRole('button',{name:'Pause film',exact:false}).click();
    check('Material film pauses',await video.evaluate(v=>v.paused));
   }
  }
  await context.close();
 }
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
 const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(origin,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('[data-home-motion]')?.getAttribute('data-home-motion')==='active');
 report.checks.push('Eligible desktop activates deferred motion');
 await page.locator('[data-home-slot=material]').scrollIntoViewIfNeeded();
 check('Parallax is bounded image transform',await page.locator('[data-home-parallax]>:first-child').evaluate(e=>getComputedStyle(e).transform!=='none'));
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(150);
 check('Live reduced-motion change cleans transforms',await page.locator('[data-home-parallax]>:first-child').evaluate(e=>e.style.transform===''));
 check('Live reduced-motion restores anchor behavior',await page.evaluate(()=>document.documentElement.style.scrollBehavior!=='smooth'));
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(250);
 await page.locator('a[href="/commission"]').first().click();await page.waitForURL('**/commission');
 await page.waitForFunction(()=>!document.querySelector('[data-home-motion]'));
 check('Route exit restores native scrolling',await page.evaluate(()=>document.documentElement.style.scrollBehavior!=='smooth'));
 check('Commission route remains functional',await page.locator('h1').count()===1);
 check('No browser runtime errors',report.errors.length===0);
 await context.close();
}finally{
 await browser.close();await writeFile(out+'/verification.json',JSON.stringify(report,null,2));
}
console.log(JSON.stringify({checks:report.checks.length,errors:report.errors,captures:report.captures}));
