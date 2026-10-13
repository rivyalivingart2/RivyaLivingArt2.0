import {chromium} from 'playwright';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin='http://127.0.0.1:4199',out='output/playwright/redesign-phase4',mode=process.argv[2]||'verify';
await mkdir(out,{recursive:true});
const baseline=JSON.parse(await readFile('output/redesign-phase4/before.json','utf8'));
const pick=prefix=>baseline.find(r=>r.status===200&&r.route.startsWith(prefix))?.route;
const product=pick('/pieces/'),article=pick('/journal/');
const routes=['/','/collectible-design','/memory-art','/personal-art','/commission','/preserve','/personalize','/search','/saved-pieces','/commission/customize','/inquiry/received','/our-story','/process','/architects','/materials-care','/journal','/portfolio','/testimonials','/faq','/contact','/privacy','/terms','/shipping-delivery','/returns-cancellations','/accessibility','/imprint',product,product+'/customize',article,'/phase4-unavailable'];
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={checks:[],issues:[],captures:[],pages:[],scope:'Local QA records; browser emulation; no submissions or publication'};
const check=(name,pass)=>{(pass?report.checks:report.issues).push(name);};
try {
 for(const width of mode==='baseline'?[1440]:[1440,768,390,320]){
  const context=await browser.newContext({viewport:{width,height:width<700?844:1000},reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',e=>report.issues.push('JS '+e.message));
  for(const route of routes.filter(Boolean)){
   await page.goto(origin+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const semantic=await page.locator('main').last().evaluate(n=>({text:n.textContent,links:[...n.querySelectorAll('a')].map(a=>[a.textContent,a.getAttribute('href')]),media:[...n.querySelectorAll('img,video,source')].map(i=>[i.tagName,i.getAttribute('alt'),i.getAttribute('src'),i.getAttribute('style')]),h1:n.querySelector('h1')?.textContent}));
   if(width===1440)report.pages.push({route,...semantic});
   if(mode==='baseline')continue;
   check(width+' '+route+' H1',await page.locator('h1').count()===1);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   check(width+' '+route+' no overflow ('+overflow+')',overflow<=1);
   check(width+' '+route+' logo unchanged',await page.locator('header>a img').evaluate(i=>getComputedStyle(i).filter==='none'));
   check(width+' '+route+' video manual',await page.locator('video').evaluateAll(ns=>ns.every(v=>!v.autoplay&&v.paused&&v.controls)));
   if(width===1440||width===390||width===768&&['/collectible-design',product,'/commission/customize'].includes(route)){
    const slug=route==='/'?'home':route.slice(1).replaceAll('/','-');
    const name=width+'-'+slug+'.png';await page.screenshot({path:out+'/'+name});report.captures.push(name);
    if(['/collectible-design','/our-story','/journal','/faq','/privacy'].includes(route)){
     const target=page.locator('[data-public-part="reading"],[data-public-part="chapter"],#browse,[data-public-part="filter"]').first();
     if(await target.count()){await target.evaluate(e=>scrollTo(0,e.getBoundingClientRect().top+scrollY-104));await page.waitForTimeout(300);const file=width+'-'+slug+'-body.png';await page.screenshot({path:out+'/'+file});report.captures.push(file);}
    }
   }
  }
  await context.close();
 }
 if(mode!=='baseline'){
  const before=JSON.parse(await readFile(out+'/baseline.json','utf8'));
  for(const row of report.pages){const old=before.pages.find(p=>p.route===row.route);check(row.route+' exact public text retained',old?.text===row.text);check(row.route+' links retained',JSON.stringify(old?.links)===JSON.stringify(row.links));check(row.route+' media and crop attributes retained',JSON.stringify(old?.media)===JSON.stringify(row.media));}
 }
}finally{await browser.close();await writeFile(out+'/'+(mode==='baseline'?'baseline':'browser-verification')+'.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,issues:report.issues,captures:report.captures.length,pages:report.pages.map(p=>[p.route,p.h1])}));
assert.equal(report.issues.length,0,'Review reported issues');
