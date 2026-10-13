import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {localBrowser,origin} from './redesign-phase6-session.mjs';
const {browser,context}=await localBrowser(),out='output/playwright/redesign-phase6';
const report={scope:'Read-only all-module smoke, computed text samples and labelled intercepted API-failure previews',checks:[],contrast:[],captures:[]};
const check=(name,pass)=>{assert.ok(pass,name);report.checks.push(name);};
try{
 const modules=JSON.parse(await readFile('docs/redesign/modern-design-2026-10-13/studio-coverage.json','utf8'));
 const page=await context.newPage();for(const row of modules){await page.goto(origin+row.route,{waitUntil:'domcontentloaded'});await page.waitForLoadState('networkidle',{timeout:5000}).catch(()=>{});await page.locator('main h1').first().waitFor();check(row.key+' actual module opens',!page.url().includes('/login'));}
 for(const width of [1440,390]){await page.setViewportSize({width,height:width===390?844:1000});for(const route of ['','inquiries','staff','settings','navigation','analytics','exports']){
  await page.goto(origin+'/studio/'+route,{waitUntil:'networkidle'});
  const samples=await page.locator('main').evaluate(root=>{const rgba=s=>(s.match(/[\d.]+/g)||[]).map(Number),lum=rgb=>rgb.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);return [...root.querySelectorAll('h1,h2,p,label,summary,button,a,small')].filter(e=>e.getClientRects().length&&e.textContent.trim()&&!e.matches(':disabled')&&!e.closest('fieldset[disabled]')&&getComputedStyle(e).opacity==='1').slice(0,60).map(e=>{const s=getComputedStyle(e);let p=e,bg=[8,10,14];while(p){const c=rgba(getComputedStyle(p).backgroundColor);if(c.length===3||c[3]===1){bg=c;break;}p=p.parentElement;}const f=lum(rgba(s.color)),b=lum(bg),ratio=(Math.max(f,b)+.05)/(Math.min(f,b)+.05),large=parseFloat(s.fontSize)>=24||parseFloat(s.fontSize)>=18.66&&+s.fontWeight>=700;return{text:e.textContent.trim().slice(0,50),ratio:+ratio.toFixed(2),minimum:large?3:4.5};});});
  report.contrast.push({width,route,samples});check(width+' '+route+' text contrast',samples.every(s=>s.ratio>=s.minimum));
 }
 await page.route('**/api/studio/orders?*',r=>r.fulfill({status:503,json:{error:'Synthetic QA unavailable response. No records changed.'}}));await page.goto(origin+'/studio/inquiries',{waitUntil:'networkidle'});await page.getByText('Synthetic QA unavailable response.',{exact:false}).waitFor();check(width+' failed load retains recovery',await page.getByRole('button',{name:'Refresh inquiries',exact:true}).isEnabled());const file=width+'-unavailable.png';await page.screenshot({path:out+'/'+file,fullPage:true});report.captures.push(file);await page.unroute('**/api/studio/orders?*');await page.getByRole('button',{name:'Refresh inquiries',exact:true}).click();await page.getByText('Saved records loaded.',{exact:false}).waitFor();check(width+' recovery reload succeeds',true);
 await page.evaluate(()=>window.dispatchEvent(new Event('studio-session-expired')));check(width+' session-expired feedback retains retry',await page.getByRole('button',{name:'Check renewed access',exact:true}).isVisible());await page.screenshot({path:out+'/'+width+'-session-expired.png',fullPage:true});report.captures.push(width+'-session-expired.png');
 }
 check('Reduced-motion inherited',await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches));await page.close();
}finally{await browser.close();await writeFile(out+'/states.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({checks:report.checks.length,contrastSamples:report.contrast.reduce((n,c)=>n+c.samples.length,0),captures:report.captures.length}));
