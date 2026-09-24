import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const repo=process.cwd(),load=createRequire(path.join(repo,'package.json'));
const output=path.resolve('test-results/release-qa');fs.mkdirSync(output,{recursive:true});
const {chromium}=load('@playwright/test'),inventory=JSON.parse(fs.readFileSync(repo+'/docs/redesign/instances.json','utf8'));
const out=output+'/',base='http://localhost:4187';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.RIVYA_BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}),results=[],violations=[];
 try{
  const context=await browser.newContext(),page=await context.newPage();
  const paths=[...inventory.products.flatMap(p=>[{id:p.id,path:'/pieces/'+p.slug},{id:p.id+'-form',path:'/pieces/'+p.slug+'/customize'}]),...inventory.articles.map(p=>({id:p.id,path:'/journal/'+p.slug}))];
  for(let n=0;n<paths.length;n+=5){await Promise.all(paths.slice(n,n+5).map(async item=>{const r=await context.request.get(base+item.path);const body=await r.text();assert.equal(r.status(),200,item.path);assert.match(body,/<h1[ >]/,item.path);assert.doesNotMatch(body,/This page is unavailable|NEXT_HTTP_ERROR_FALLBACK;404/,item.path);results.push({...item,status:200});}));if(n%25===0)console.log('Public instances checked',Math.min(n+5,paths.length));}
  console.log('PASS public product/article HTTP inventory',results.length);
  for(const viewport of [{width:1440,height:1000},{width:1200,height:900},{width:1024,height:900},{width:768,height:1024},{width:390,height:844},{width:320,height:740}]){
   await page.setViewportSize(viewport);
   for(const path of ['/','/collectible-design','/pieces/river-channel','/commission','/delivery','/privacy','/studio/login']){
    await page.goto(base+path);await page.waitForLoadState('networkidle');await page.addScriptTag({path:repo+'/node_modules/axe-core/axe.min.js'});
    const audit=await page.evaluate(async()=>{const a=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return a.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
    violations.push({path,width:viewport.width,overflow,violations:audit});
    if(path==='/'||path==='/pieces/river-channel')await page.screenshot({path:out+`public-${viewport.width}-${path==='/'?'home':'piece'}.png`,fullPage:true});
   }
   console.log('Accessibility/layout inspected at width',viewport.width);
  }
  fs.writeFileSync(out+'public-browser.json',JSON.stringify({at:new Date().toISOString(),results,accessibility:violations,limitation:'Automated accessibility checks do not replace assistive-technology testing.'},null,2));
  const failures=violations.filter(x=>x.overflow||x.violations.length);
  console.log('Violations',failures.map(x=>({path:x.path,width:x.width,overflow:x.overflow,violations:x.violations.map(v=>v.id)})));
  assert.equal(failures.length,0,'Resolve automated accessibility/layout findings before treating this suite as passed');
 }finally{await browser.close()}
})().catch(e=>{console.error('FAIL',e.message);process.exitCode=1});
