import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';

// Public GET-only measurements. Each cold visit uses a new browser context;
// this does not pretend to control the hosting provider's server/CDN caches.
const origin=process.env.RIVYA_PERF_ORIGIN||'https://www.rivyalivingart.com';
const label=process.env.RIVYA_PERF_LABEL||'production-performance';
const directory='test-results/cinematic-acceptance';
await mkdir(directory,{recursive:true});
const report={at:new Date().toISOString(),origin,scope:(origin.includes('127.0.0.1')?'Local candidate':'Production')+' browser lab, not real-user field metrics or physical-mobile evidence',profiles:{desktop:{width:1440,height:1000,cpu:1,network:'unthrottled'},mobile:{width:390,height:844,cpu:4,latencyMs:150,downloadMbps:1.6,uploadMbps:.75,touch:true}},samples:[],errors:[]};
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const save=()=>writeFile(directory+'/'+label+'.json',JSON.stringify(report,null,2)+'\n');
try{
 for(const profile of (process.env.RIVYA_PERF_PROFILES||'desktop,mobile').split(','))for(const route of ['/','/collectible-design','/journal','/pieces/river-channel'])for(let run=1;run<=3;run++){
  const mobile=profile==='mobile',context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile,serviceWorkers:'block'}),page=await context.newPage(),cdp=await context.newCDPSession(page);
  if(mobile){await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750,connectionType:'cellular4g'});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});}
  await page.addInitScript(()=>{
   const m=window.__acceptancePerf={lcp:0,cls:0,blockingMs:0,lcpElement:null,lcpUrl:null};let start=0,last=0,score=0;
   new PerformanceObserver(list=>{for(const e of list.getEntries()){m.lcp=e.startTime;m.lcpElement=e.element?.tagName;m.lcpUrl=e.url||null;}}).observe({type:'largest-contentful-paint',buffered:true});
   new PerformanceObserver(list=>{for(const e of list.getEntries()){if(e.hadRecentInput)continue;if(!start||e.startTime-last>1000||e.startTime-start>5000){start=e.startTime;score=0;}score+=e.value;last=e.startTime;m.cls=Math.max(m.cls,score);}}).observe({type:'layout-shift',buffered:true});
   new PerformanceObserver(list=>{for(const e of list.getEntries())m.blockingMs+=Math.max(0,e.duration-50);}).observe({type:'longtask',buffered:true});
  });
  for(const cache of run===1?['cold-browser','repeat-visit']:['cold-browser']){
   try{
    const response=await page.goto(origin+route,{waitUntil:'load',timeout:90000});await page.waitForTimeout(mobile?6500:4000);
    const metrics=await page.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0],resources=performance.getEntriesByType('resource');return {...window.__acceptancePerf,ttfb:n.responseStart,requestWait:n.responseStart-n.requestStart,domReady:n.domContentLoadedEventEnd,load:n.loadEventEnd,resourceCount:resources.length,transferBytes:resources.reduce((s,r)=>s+r.transferSize,0),largestResources:resources.filter(r=>r.transferSize>0).sort((a,b)=>b.transferSize-a.transferSize).slice(0,6).map(r=>({path:new URL(r.name).pathname,bytes:r.transferSize,duration:r.duration})),failedImages:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length,videos:[...document.querySelectorAll('video')].map(v=>({ready:v.readyState,sources:v.querySelectorAll('source').length,paused:v.paused})),overflow:document.documentElement.scrollWidth>innerWidth+1};});
    report.samples.push({profile,route,run,cache,status:response.status(),cacheHeader:response.headers()['x-vercel-cache']??null,...metrics});
    if(run===1&&cache==='cold-browser')await page.screenshot({path:`${directory}/${label}-${profile}-${route==='/'?'home':route.split('/').at(-1)}.png`});
    console.log(JSON.stringify({profile,route,run,cache,status:response.status(),lcp:Math.round(metrics.lcp),ttfb:Math.round(metrics.ttfb),cls:metrics.cls}));
   }catch(error){report.errors.push({profile,route,run,cache,error:error.message});}
   await save();
  }
  await context.close();
 }
}finally{await browser.close();report.finishedAt=new Date().toISOString();await save();}
