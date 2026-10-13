import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin='http://127.0.0.1:4199',out='output/playwright/redesign-phase4';
const report={checks:[],captures:[],contrast:[],scope:'Local browser emulation. Browser shortlist/locale and normal application session bookkeeping may change. No inquiry is submitted.'};
const check=(name,value)=>{assert.ok(value,name);report.checks.push(name);};
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});
  const page=await context.newPage();
  const capture=async name=>{const file=width+'-'+name+'.png';await page.screenshot({path:out+'/'+file});report.captures.push(file);};
  await page.goto(origin+'/search',{waitUntil:'networkidle'});
  await page.getByRole('searchbox',{name:'Find your piece',exact:true}).fill('phase4-no-such-piece');await page.getByRole('button',{name:'Apply filters',exact:true}).click();
  await page.getByRole('heading',{name:'A different starting point.'}).waitFor();check(width+' search empty state',await page.getByRole('link',{name:'Clear filters',exact:true}).isVisible());await capture('search-empty');
  await page.getByRole('link',{name:'Clear filters',exact:true}).click();await page.locator('[data-public-part="card"]').first().waitFor();
  const initial=await page.locator('[data-public-part="card"]').count();await page.getByRole('link',{name:/Show .*more pieces/}).click();
  await page.waitForFunction(n=>document.querySelectorAll('[data-public-part="card"]').length>n,initial);check(width+' catalogue load more',true);
  await page.locator('[data-public-part="card"]').first().click();await page.waitForURL('**/pieces/*');await page.locator('[data-public-part="detail"]').waitFor();await page.waitForLoadState('networkidle');
  const productUrl=page.url(),gallery=page.locator('[data-public-part="gallery"]');
  await page.locator('[data-public-part="detail"]').getByRole('button',{name:/^Save to saved pieces:/}).click();check(width+' saves shortlist',await page.getByRole('button',{name:/^Remove from saved pieces:/}).count()>0);
  const oldImage=await gallery.locator('img').first().getAttribute('src');
  if(await page.getByRole('button',{name:'Next image',exact:true}).count()){await page.getByRole('button',{name:'Next image',exact:true}).click();check(width+' gallery next',await gallery.locator('img').first().getAttribute('src')!==oldImage);}
  await page.getByRole('button',{name:/Enlarge image of/}).click();await page.locator('dialog[open]').waitFor();check(width+' native gallery dialog opens',true);await capture('gallery-enlarged');await page.keyboard.press('Escape');check(width+' gallery Escape restores focus',await page.getByRole('button',{name:/Enlarge image of/}).evaluate(e=>e===document.activeElement));
  await page.goto(origin+'/saved-pieces',{waitUntil:'networkidle'});check(width+' saved page contains selected product',await page.locator('main a[href="'+new URL(productUrl).pathname+'"]').count()===1);
  await page.getByRole('button',{name:'Clear saved pieces',exact:true}).click();check(width+' shortlist clear',await page.getByRole('heading',{name:'No saved pieces yet.'}).count()===1);
  await page.goto(origin+'/commission/customize',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Your details →',exact:true}).click();check(width+' required fields validation',await page.locator('[aria-invalid=true]').count()>0);await capture('brief-errors');
  await page.locator('#answer-piece_type').selectOption({index:1});await page.locator('#answer-purpose').fill('LOCAL UNSAVED LAYOUT TEST');await page.locator('#answer-city').fill('Local test');await page.getByRole('button',{name:'Your details →',exact:true}).click();
  await page.locator('#contact-name').fill('Local preview only');await page.locator('#contact-phone').fill('9999999999');await page.locator('#contact-consent').check();await capture('brief-contact');
  await page.getByRole('button',{name:'Review your brief →',exact:true}).click();check(width+' unsaved review retains answers',await page.locator('main').textContent().then(t=>t.includes('LOCAL UNSAVED LAYOUT TEST')));await capture('brief-review');
  check(width+' no automatic handoff',!page.url().includes('wa.me')&&!page.url().includes('/received'));
  await page.goto(origin+'/journal',{waitUntil:'networkidle'});
  if(width===390)await page.getByRole('button',{name:'Filter journal',exact:true}).click();
  const search=width===390?page.locator('dialog[open] input[name=q]'):page.locator('main form input[name=q]').first();await search.fill('phase4-no-such-article');
  await (width===390?page.locator('dialog[open]'):page.locator('main')).getByRole('button',{name:'Apply filters',exact:true}).click();await page.getByRole('heading',{name:'No stories match this view.'}).waitFor();check(width+' journal filters update',true);await capture('journal-empty');
  await page.getByRole('button',{name:'Clear filters',exact:true}).click();await page.getByRole('button',{name:'Next page',exact:true}).click();check(width+' editorial pagination',new URL(page.url()).searchParams.get('page')==='2');
  await page.goto(origin+'/faq',{waitUntil:'networkidle'});await page.locator('main details').filter({has:page.locator('summary')}).first().locator('summary').click();check(width+' FAQ expands',await page.locator('main details[open]').count()>0);await capture('faq-expanded');
  for(const route of ['/journal','/faq','/privacy','/contact','/commission/customize']){
   await page.goto(origin+route,{waitUntil:'networkidle'});
   const contrast=await page.evaluate(()=>{
    const rgba=s=>(s.match(/[\d.]+/g)||[]).map(Number);
    const lum=rgb=>rgb.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    return [...document.querySelectorAll('[data-public-part=intro]>span,[data-public-part=intro] h1,[data-public-part=intro]>p,[data-public-part=reading] p,[data-public-part=reading] a,[data-public-part=filter] label')].filter(e=>e.getClientRects().length&&e.textContent.trim()).slice(0,40).map(e=>{const style=getComputedStyle(e);let parent=e,bg=[8,10,14];while(parent){const color=rgba(getComputedStyle(parent).backgroundColor);if(color.length===3||color[3]===1){bg=color;break;}parent=parent.parentElement;}const fg=rgba(style.color),a=lum(fg),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05),large=parseFloat(style.fontSize)>=24||parseFloat(style.fontSize)>=18.66&&+style.fontWeight>=700;return {text:e.textContent.trim().slice(0,50),ratio:Number(ratio.toFixed(2)),minimum:large?3:4.5};});
   });report.contrast.push({width,route,samples:contrast});check(width+' '+route+' computed flat-surface text contrast',contrast.every(c=>c.ratio>=c.minimum));
  }
  for(const locale of ['hi','gu']){await context.addCookies([{name:'NEXT_LOCALE',value:locale,url:origin}]);for(const route of ['/our-story','/journal','/commission/customize']){await page.goto(origin+route,{waitUntil:'networkidle'});check(width+' '+locale+' '+route+' no overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await capture(locale+'-'+route.slice(1).replaceAll('/','-'));}}
  await context.clearCookies();
  if(width===1440)for(const route of ['/privacy','/terms','/shipping-delivery','/returns-cancellations','/accessibility','/imprint']){await page.goto(origin+route,{waitUntil:'networkidle'});await page.emulateMedia({media:'print'});check(route+' print black on white',await page.locator('[data-public-part=reading]').evaluate(e=>getComputedStyle(e).backgroundColor==='rgb(255, 255, 255)'));await page.pdf({path:out+'/'+route.slice(1)+'.pdf',format:'A4',printBackground:true,margin:{top:'15mm',bottom:'15mm',left:'15mm',right:'15mm'}});await capture('print-'+route.slice(1));await page.emulateMedia({media:'screen'});}
  for(const route of ['/collectible-design','/journal',new URL(productUrl).pathname,'/our-story']){await page.goto(origin+route,{waitUntil:'networkidle'});await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,45));}});await page.waitForTimeout(700);check(width+' '+route+' images load after scrolling',await page.locator('img').evaluateAll(ns=>ns.every(i=>i.complete&&i.naturalWidth>0)));}
  await context.close();
 }
}finally{await browser.close();await writeFile(out+'/interaction-verification.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,contrastSamples:report.contrast.reduce((n,c)=>n+c.samples.length,0),captures:report.captures.length}));
