import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {localBrowser,origin} from './old-design-migration/local-browser.mjs';
const {browser,context}=await localBrowser(),report={checks:[],contrast:[],captures:[],scope:'Computed browser samples and explicitly synthetic QA authoring states'};
const out='output/playwright/redesign-phase5',check=(name,value)=>{assert.ok(value,name);report.checks.push(name);};
try{for(const width of [1440,390]){const page=await context.newPage();await page.setViewportSize({width,height:width===390?844:1000});
 for(const route of ['products','journal','site-copy','translations','sections','media','content-register','editorial-order']){
 await page.goto(origin+'/studio/'+route,{waitUntil:'domcontentloaded'});await page.waitForLoadState('networkidle',{timeout:6000}).catch(()=>{});await page.locator('main h1').first().waitFor();
 const samples=await page.locator('main').evaluate(root=>{const rgba=s=>(s.match(/[\d.]+/g)||[]).map(Number),lum=rgb=>rgb.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);return [...root.querySelectorAll('h1,h2,p,label,summary,button,a,small')].filter(e=>e.getClientRects().length&&e.textContent.trim()&&!e.matches(':disabled')&&!e.closest('fieldset[disabled]')&&getComputedStyle(e).opacity==='1').slice(0,45).map(e=>{const s=getComputedStyle(e);let p=e,bg=[8,10,14];while(p){const c=rgba(getComputedStyle(p).backgroundColor);if(c.length===3||c[3]===1){bg=c;break;}p=p.parentElement;}const f=lum(rgba(s.color)),b=lum(bg),ratio=(Math.max(f,b)+.05)/(Math.min(f,b)+.05),large=parseFloat(s.fontSize)>=24||parseFloat(s.fontSize)>=18.66&&+s.fontWeight>=700;return{text:e.textContent.trim().slice(0,55),ratio:+ratio.toFixed(2),minimum:large?3:4.5};});});
 report.contrast.push({width,route,samples});check(width+' '+route+' flat text contrast',samples.every(s=>s.ratio>=s.minimum));
 }
 await page.goto(origin+'/studio/preview/states',{waitUntil:'networkidle'});await page.getByRole('heading',{name:'Authoring state gallery',exact:true}).waitFor();
 for(const state of ['Loading','Empty','Draft saved','Validation error','Conflict','Session expired','Published; verification needed','Unavailable image','Long content']){
 await page.getByLabel(/^State/).selectOption({label:state});check(width+' synthetic '+state+' rendered',await page.getByRole('heading',{name:state,exact:true}).count()===1);check(width+' synthetic '+state+' no overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 const file=width+'-state-'+state.toLowerCase().replaceAll(/[^a-z]+/g,'-')+'.png';await page.screenshot({path:out+'/'+file});report.captures.push(file);}
 await page.close();
}}finally{await browser.close();await writeFile(out+'/states-contrast.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,samples:report.contrast.reduce((n,c)=>n+c.samples.length,0),captures:report.captures.length}));
