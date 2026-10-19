import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const out='test-results/cinematic-acceptance',captures=[];
await mkdir(out,{recursive:true});
try{for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:1000}});
 await page.goto('http://127.0.0.1:4199/',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.querySelector('[data-home-hero-section] video')?.readyState>=2);
 for(const [name,selector] of [['hero','[data-home-hero-section]'],['resin','[data-material-film]']]){
  await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(700);
  const filename=`after-${name}-${width}.png`;await page.screenshot({path:out+'/'+filename});captures.push({filename,width,route:'/',section:name,syntheticBackground:false});
 }
 await page.goto('http://127.0.0.1:4199/studio/login',{waitUntil:'networkidle'});
 const filename=`after-studio-login-${width}.png`;await page.screenshot({path:out+'/'+filename});captures.push({filename,width,route:'/studio/login',syntheticBackground:false});
 await page.close();
}}finally{await browser.close();await writeFile(out+'/captures.json',JSON.stringify({at:new Date().toISOString(),captures},null,2)+'\n');}
console.log(JSON.stringify({captures:captures.length}));
