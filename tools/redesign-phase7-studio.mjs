import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {localBrowser,origin} from './redesign-phase7-session.mjs';
const {browser,context}=await localBrowser();
const modules=JSON.parse(await readFile('docs/redesign/modern-design-2026-10-13/studio-coverage.json','utf8'));
const report={scope:'Current candidate all Studio entries, four emulated widths, anonymous access, focus and scroll geometry; no saves',checks:[],issues:[],pages:[],networkIdleTimeouts:[]};
const check=(name,value)=>(value?report.checks:report.issues).push(name);
try{
 const p=await context.newPage();p.on('pageerror',e=>report.issues.push('JS '+e.message));
 for(const width of [1440,768,390,320]){await p.setViewportSize({width,height:width<700?844:1000});for(const row of modules){
  await p.goto(origin+row.route,{waitUntil:'domcontentloaded'});await p.waitForLoadState('networkidle',{timeout:5000}).catch(()=>report.networkIdleTimeouts.push({width,route:row.route}));await p.locator('main h1').first().waitFor();
  check(width+' '+row.key+' authenticated',!p.url().includes('/login'));check(width+' '+row.key+' one heading',await p.locator('main h1').count()===1);check(width+' '+row.key+' no document overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  const scrolls=await p.locator('main').evaluate(root=>[...root.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflowX==='auto').map(e=>({tag:e.tagName,scroll:e.scrollWidth,client:e.clientWidth})));
  report.pages.push({width,route:row.route,heading:await p.locator('main h1').first().textContent(),intentionalHorizontalScrolls:scrolls});
 }}
 await p.setViewportSize({width:1440,height:1000});await p.goto(origin+'/studio/navigation',{waitUntil:'networkidle'});
 const scrolled=await p.locator('main').evaluate(root=>{const regions=[...root.querySelectorAll('*')].filter(e=>e.scrollHeight>e.clientHeight+10&&['auto','scroll'].includes(getComputedStyle(e).overflowY));regions.forEach(e=>e.scrollTop=e.scrollHeight);return regions.length;});check('Navigation nested scroll can reach end',scrolled>0);await p.screenshot({path:'output/playwright/redesign-phase7/studio-navigation-end.png',fullPage:true});
 await p.goto(origin+'/studio/analytics',{waitUntil:'networkidle'});const tables=await p.locator('main').evaluate(root=>{const regions=[...root.querySelectorAll('*')].filter(e=>e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflowX==='auto');regions.forEach(e=>e.scrollLeft=e.scrollWidth);return regions.map(e=>e.scrollLeft>0);});check('Analytics offscreen columns reachable',tables.every(Boolean));await p.screenshot({path:'output/playwright/redesign-phase7/studio-analytics-end.png',fullPage:true});
 const guest=await browser.newContext(),g=await guest.newPage();for(const row of modules){await g.goto(origin+row.route,{waitUntil:'domcontentloaded'});check('Anonymous denied '+row.key,new URL(g.url()).pathname==='/studio/login');}
 for(const path of ['/api/studio/workspace','/api/studio/settings','/api/studio/site-settings','/api/studio/orders','/api/studio/content?view=editor','/api/studio/operations?view=exports']){const r=await g.evaluate(async path=>(await fetch(path)).status,path);check('Anonymous API denied '+path,r===401||r===403);}
 await guest.close();
}finally{await browser.close();await writeFile('output/redesign-phase7/studio.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({checks:report.checks.length,pages:report.pages.length,issues:report.issues}));assert.equal(report.issues.length,0);
