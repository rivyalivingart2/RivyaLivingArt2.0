import {chromium} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
const out='test-results/cinematic-acceptance',origin='https://www.rivyalivingart.com';
const inventory=JSON.parse(await readFile(out+'/published-inventory.json','utf8'));
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={at:new Date().toISOString(),scope:'Every current sitemap URL opened in Chromium at 390px with touch/reduced-motion. Scrolls each media placement into view. Public read-only checks; not physical-device evidence or every interaction combination.',pages:[],issues:[]};
let index=0;const save=()=>writeFile(out+'/published-browser.json',JSON.stringify(report,null,2)+'\n');
try{await Promise.all(Array.from({length:2},async()=>{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce'}),page=await context.newPage();
 page.setDefaultTimeout(12000);
 while(index<inventory.routes.length){const {path}=inventory.routes[index++];const errors=[];const onError=e=>errors.push(e.message);page.on('pageerror',onError);
  try{const response=await page.goto(origin+path,{waitUntil:'domcontentloaded',timeout:60000});await page.locator('main h1').first().waitFor();await page.evaluate(()=>document.fonts.ready);
   for(const media of await page.locator('main img').all()){if(await media.isVisible()){await media.scrollIntoViewIfNeeded();await media.evaluate(e=>e.complete?null:new Promise(resolve=>{e.addEventListener('load',resolve,{once:true});e.addEventListener('error',resolve,{once:true});setTimeout(resolve,7000);}));}}
   const view=await page.evaluate(()=>({heading:document.querySelector('main h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth+1,images:[...document.querySelectorAll('main img')].filter(e=>e.getClientRects().length).length,broken:[...document.querySelectorAll('main img')].filter(i=>i.getClientRects().length&&i.complete&&i.naturalWidth===0).map(i=>({src:i.getAttribute('src'),alt:i.alt})),unloaded:[...document.querySelectorAll('main img')].filter(i=>i.getClientRects().length&&!i.complete).length}));
   const row={path,status:response.status(),...view,errors};report.pages.push(row);if(!response.ok()||view.overflow||view.broken.length||view.unloaded||errors.length)report.issues.push(row);
  }catch(e){report.issues.push({path,error:e.message.split('\n')[0]});}
  page.off('pageerror',onError);if(report.pages.length%30===0){await save();console.log(JSON.stringify({pages:report.pages.length,total:inventory.routes.length,issues:report.issues.length}));}
 }await context.close();
}));}finally{await browser.close();report.finishedAt=new Date().toISOString();await save();}
console.log(JSON.stringify({pages:report.pages.length,issues:report.issues.length}));
