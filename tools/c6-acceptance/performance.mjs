import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {origin,record,login,addSession,qa} from './common.mjs';
const name=process.argv[2]||'baseline',repeats=Number(process.argv[3]||1);
const routes=process.argv.slice(4).length?process.argv.slice(4):['/','/collectible-design','/pieces/river-channel'];
const cookie=routes.some(r=>r.startsWith('/studio'))?await login():null;
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const samples=[],errors=[];
try{for(const route of routes)for(let run=1;run<=repeats;run++){
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 if(cookie&&route.startsWith('/studio'))await addSession(context,cookie);
 const page=await context.newPage();page.on('pageerror',e=>errors.push({route,message:e.message}));
 const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.clearBrowserCache');await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750,connectionType:'cellular4g'});
 await page.addInitScript(()=>{
  window.c6={lcp:0,cls:0,events:[],lcpElement:null};
  new PerformanceObserver(list=>{for(const e of list.getEntries()){window.c6.lcp=e.startTime;window.c6.lcpElement={tag:e.element?.tagName,path:e.url?new URL(e.url).pathname:null,size:e.size};}}).observe({type:'largest-contentful-paint',buffered:true});
  let start=0,last=0,total=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){if(e.startTime-last>1000||e.startTime-start>5000){start=e.startTime;total=0;}last=e.startTime;total+=e.value;window.c6.cls=Math.max(window.c6.cls,total);}}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.interactionId)window.c6.events.push(e.duration);}).observe({type:'event',buffered:true,durationThreshold:16});
 });
 const response=await page.goto(origin+route,{waitUntil:'load',timeout:120000});await page.waitForLoadState('networkidle',{timeout:90000});await page.evaluate(()=>document.fonts.ready);
 assert.equal(new URL(page.url()).pathname,new URL(origin+route).pathname,'Measure the requested page, never a sign-in redirect');
 if(route.startsWith('/studio/content?')){await page.locator('#content-field-title').waitFor();await page.locator('#homepage-destinations option').first().waitFor({state:'attached'});}
 const menu=page.getByRole('button',{name:route.startsWith('/studio')?'Open Studio navigation':'Open navigation',exact:true});
 await menu.waitFor();await menu.click();await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');
 await page.waitForTimeout(250);
 const sample=await page.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0];const resources=performance.getEntriesByType('resource');return {...window.c6,ttfb:n.responseStart,transfer:n.transferSize+resources.reduce((s,r)=>s+r.transferSize,0),resources:resources.map(r=>({path:new URL(r.name).pathname,bytes:r.transferSize,duration:r.duration,start:r.startTime})).sort((a,b)=>b.bytes-a.bytes).slice(0,10),images:[...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight).map(i=>({width:Math.round(i.getBoundingClientRect().width),naturalWidth:i.naturalWidth,sizes:i.sizes,requestedWidth:Number(new URL(i.currentSrc||i.src,location.href).searchParams.get('w')),loading:i.loading,priority:i.fetchPriority,complete:i.complete&&i.naturalWidth>0})),overflow:document.documentElement.scrollWidth>innerWidth+1};});
 samples.push({route,run,status:response.status(),...sample});console.log(JSON.stringify({route,run,lcp:sample.lcp,ttfb:sample.ttfb,cls:sample.cls,transfer:sample.transfer,maxInteraction:Math.max(0,...sample.events)}));await context.close();
}}finally{await browser.close();record('performance-'+name,{at:new Date().toISOString(),environment:qa.RIVYA_QA_TARGET==='local'?'Compiled local Next server and loopback PostgreSQL with source-only fixtures; no Neon/CDN':'Compiled local Next server, isolated remote QA database; no production CDN',profile:'Cold browser cache each sample, 390x844 DPR3 touch, CPU4x, 150ms latency, 1.6Mbps down, 750Kbps up, reduced motion. Server/image caches may be warm.',limits:'Repeated lab samples and event maxima are diagnostics, not field p75 INP or human/physical-phone evidence.',targets:{lcp:2500,cls:0.1,interactionDiagnostic:200},complete:samples.length===routes.length*repeats,expectedSamples:routes.length*repeats,samples,errors});}
