import {chromium} from 'playwright';
import {readFileSync,writeFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={scope:'Local desktop prototype comparison; fresh contexts, no network/CPU throttling; not production LCP, field INP or an identical-content A/B test',samples:[],bundles:[]};
try{
 for(let run=1;run<=3;run++)for(const [phase,url] of [[1,'http://127.0.0.1:4178/?view=home'],[2,'http://127.0.0.1:4179/']]){
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();const bytes=[];
  await page.addInitScript(()=>{window.phase2Metrics={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.phase2Metrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.phase2Metrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
  page.on('response',r=>{const n=Number(r.headers()['content-length']);if(Number.isFinite(n))bytes.push(n);});
  try{await page.goto(url,{waitUntil:'networkidle',timeout:20000});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);report.samples.push({phase,run,...await page.evaluate(()=>window.phase2Metrics),uncompressedResponseBytes:bytes.reduce((a,b)=>a+b,0)});}catch(error){report.samples.push({phase,run,error:error.message.split('\n')[0]});}
  await context.close();
 }
 for(const [phase,path] of [[1,'experiments/redesign-phase1/preview.js'],[2,'output/redesign-phase2/client.js']]){const bytes=readFileSync(path);report.bundles.push({phase,path,raw:bytes.length,gzipLevel6:gzipSync(bytes,{level:6}).length});}
}finally{await browser.close();writeFileSync('docs/redesign/modern-design-2026-10-13/phase2-performance.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify(report,null,2));
