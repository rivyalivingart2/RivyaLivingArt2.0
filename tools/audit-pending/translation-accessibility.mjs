import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {expect} from '@playwright/test';
import sharp from 'sharp';
import {localBrowser,origin} from '../old-design-migration/local-browser.mjs';

const out='test-results/audit-pending-accessibility/after';await mkdir(out,{recursive:true});
const {browser,context}=await localBrowser();
const report={at:new Date().toISOString(),browser:browser.version(),scope:'Translation workspace; isolated loopback4199; DPR1; reduced motion; no production',axe:[],textSamples:[],focusSamples:[],states:[],errors:[],blockedWrites:[]};
await context.route('**/api/studio/**',async route=>{if(!['GET','HEAD'].includes(route.request().method())){report.blockedWrites.push(new URL(route.request().url()).pathname);await route.abort();}else await route.continue();});
const page=await context.newPage();page.setDefaultTimeout(30000);page.on('pageerror',e=>report.errors.push(e.message));
const lum=c=>c.slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((a,x,i)=>a+x*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const css='html{scroll-behavior:auto!important}html[data-a11y-hide-text] body *{-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}html[data-a11y-hide-ring] :focus{outline-color:transparent!important}';
async function setup(){await page.goto(origin+'/studio/translations',{waitUntil:'domcontentloaded'});await expect(page.getByRole('status').filter({hasText:/\d+ documents/})).toBeVisible();await page.evaluate(()=>document.fonts.ready);await expect.poll(()=>page.locator('header img').evaluateAll(images=>{const visible=images.filter(img=>img.getBoundingClientRect().width>0);return visible.length>0&&visible.every(img=>img.complete&&img.naturalWidth>0);}),{timeout:30000}).toBe(true);await page.addStyleTag({content:css});}
async function textSample(label,width){
 const atoms=await page.locator('body').evaluate(root=>{
  const atoms=[],walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
  while((node=walk.nextNode())){
   if(!node.textContent.trim())continue;const el=node.parentElement;if(!el||el.closest('script,style,option,[aria-hidden=true]'))continue;
   const cs=getComputedStyle(el);if(cs.visibility!=='visible'||!el.getClientRects().length)continue;
   let opacity=1,p=el;while(p){opacity*=Number(getComputedStyle(p).opacity);p=p.parentElement;}if(opacity<.98||el.closest(':disabled'))continue;
   const range=document.createRange();range.selectNodeContents(node);
   const boxes=[...range.getClientRects()].filter(r=>r.width>2&&r.height>2&&r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth).filter(r=>[1,r.width/2,r.width-1].every(x=>[1,r.height/2,r.height-1].every(y=>{const hit=document.elementFromPoint(r.x+x,r.y+y);return hit&&(hit===el||el.contains(hit)||hit.contains(el));}))).map(r=>({x:r.x,y:r.y,w:r.width,h:r.height}));
   if(boxes.length)atoms.push({text:node.textContent.trim().slice(0,100),color:(cs.color.match(/[\d.]+/g)||[]).map(Number),minimum:parseFloat(cs.fontSize)>=24||parseFloat(cs.fontSize)>=18.66&&parseFloat(cs.fontWeight)>=700?3:4.5,boxes});
  }
  for(const el of root.querySelectorAll('input[type=search],select')){const r=el.getBoundingClientRect(),cs=getComputedStyle(el);if(r.top>=0&&r.bottom<=innerHeight&&r.width&&r.left>=0&&r.right<=innerWidth){const text=el.tagName==='SELECT'?el.selectedOptions[0]?.textContent:el.value;if(text)atoms.push({text:'Control value: '+text,color:(cs.color.match(/[\d.]+/g)||[]).map(Number),minimum:4.5,boxes:[{x:r.x+13,y:r.y+10,w:Math.max(1,r.width-48),h:r.height-20}]});}}
  return atoms;
 });
 await page.evaluate(()=>document.documentElement.setAttribute('data-a11y-hide-text',''));
 const {data,info}=await sharp(await page.screenshot()).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const results=atoms.map(atom=>{let minimum=100,worst;for(const box of atom.boxes)for(let y=Math.ceil(box.y)+1;y<Math.floor(box.y+box.h)-1;y+=2)for(let x=Math.ceil(box.x)+1;x<Math.floor(box.x+box.w)-1;x+=2){const i=(y*info.width+x)*info.channels,bg=[data[i],data[i+1],data[i+2]],value=contrast(atom.color,bg);if(value<minimum){minimum=value;worst=bg;}}return{text:atom.text,foreground:atom.color,background:worst,ratio:Number(minimum.toFixed(3)),minimum:atom.minimum};}).filter(x=>x.background);
 await page.evaluate(()=>document.documentElement.removeAttribute('data-a11y-hide-text'));
 report.textSamples.push({label,width,scrollY:await page.evaluate(()=>scrollY),texts:results.length,minimumRatio:Math.min(...results.map(x=>x.ratio)),failures:results.filter(x=>x.ratio<x.minimum),results});
}
async function focusSample(locator,label,width){
 await locator.scrollIntoViewIfNeeded();await page.keyboard.press('Tab');await locator.focus();
 const ring=await locator.evaluate(el=>{const c=getComputedStyle(el),r=el.getBoundingClientRect();return{focusVisible:el.matches(':focus-visible'),style:c.outlineStyle,width:parseFloat(c.outlineWidth),offset:parseFloat(c.outlineOffset),color:(c.outlineColor.match(/[\d.]+/g)||[]).map(Number),rect:{x:r.x,y:r.y,w:r.width,h:r.height}};});
 await page.screenshot({path:`${out}/focus-${width}-${label}.png`});
 await page.evaluate(()=>document.documentElement.setAttribute('data-a11y-hide-ring',''));
 const {data,info}=await sharp(await page.screenshot()).removeAlpha().raw().toBuffer({resolveWithObject:true});
 await page.evaluate(()=>document.documentElement.removeAttribute('data-a11y-hide-ring'));
 const r=ring.rect,d=ring.offset+ring.width/2,points=[[r.x+r.w/2,r.y-d],[r.x+r.w/2,r.y+r.h+d],[r.x-d,r.y+r.h/2],[r.x+r.w+d,r.y+r.h/2]].filter(([x,y])=>x>=0&&y>=0&&x<info.width&&y<info.height);
 const ratios=points.map(([x,y])=>{const i=(Math.floor(y)*info.width+Math.floor(x))*info.channels;return contrast(ring.color,[data[i],data[i+1],data[i+2]]);});
 report.focusSamples.push({label,viewportWidth:width,...ring,adjacentRatios:ratios,minimumRatio:Math.min(...ratios),passes:ring.focusVisible&&ring.width>=2&&ring.style!=='none'&&ratios.length===4&&ratios.every(x=>x>=3)});
 await textSample('focus-'+label,width);
}
try{
 await setup();
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:width===1440?1000:844});await page.evaluate(()=>scrollTo(0,0));
  await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
  const a=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'rule',values:['aria-prohibited-attr','color-contrast']}});return{violations:r.violations,incomplete:r.incomplete};});report.axe.push({width,...a});
  assert.equal(a.violations.length,0);assert.equal(a.incomplete.filter(x=>x.id==='aria-prohibited-attr').length,0);
  await page.screenshot({path:`${out}/stable-${width}-top.png`});
  const height=await page.evaluate(()=>document.documentElement.scrollHeight),step=width===1440?700:590;
  for(let y=0;y<height;y+=step){await page.evaluate(y=>scrollTo(0,y),y);await textSample('stable',width);}
  await focusSample(page.getByRole('button',{name:'Refresh coverage'}),'refresh',width);
  await focusSample(page.getByRole('searchbox',{name:'Find document'}),'search',width);
  await focusSample(page.getByRole('combobox',{name:/^Review language/}),'language',width);
  await focusSample(page.getByRole('button',{name:'Next',exact:true}),'next',width);
  await focusSample(page.locator('article a').first(),'review-link',width);
  const pagination=page.getByRole('status').filter({hasText:/Page \d+ of \d+/});
  assert.equal(await pagination.evaluate(el=>getComputedStyle(el).color===getComputedStyle(el.parentElement).color),true,'Page fraction retains its inherited visual color');
  await page.getByRole('button',{name:'Next',exact:true}).focus();await page.keyboard.press('Enter');await expect(pagination).toContainText('Page 2 of 31');
  const snapshot=await pagination.ariaSnapshot();assert.match(snapshot,/Page 2 of 31/);assert.doesNotMatch(snapshot,/2 \/ 31/);await expect(page.getByRole('button',{name:'Next',exact:true})).toBeFocused();
  report.states.push({width,state:'pagination',snapshot,html:await pagination.evaluate(e=>e.outerHTML)});
  await page.getByRole('combobox',{name:/^Review language/}).selectOption('gu');await page.getByRole('combobox',{name:/^Review language/}).selectOption('hi');
  let release;const pending=new Promise(resolve=>{release=resolve;});const hold=async route=>{await pending;await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Synthetic local outage'})});};
  await context.route('**/api/studio/content?view=translations',hold);await page.getByRole('button',{name:'Refresh coverage'}).click();
  await expect(page.getByText('Checking saved translations…')).toBeVisible();await page.getByText('Checking saved translations…').scrollIntoViewIfNeeded();await textSample('refresh-loading',width);await page.screenshot({path:`${out}/loading-${width}.png`});
  release();await expect(page.getByRole('alert').filter({hasText:'Translation coverage'})).toBeVisible();await page.getByRole('alert').filter({hasText:'Translation coverage'}).scrollIntoViewIfNeeded();await textSample('refresh-error',width);await page.screenshot({path:`${out}/error-${width}.png`});report.states.push({width,state:'refresh-error',retainedCards:await page.locator('article').count()});
  await context.unroute('**/api/studio/content?view=translations',hold);await page.getByRole('button',{name:'Refresh coverage'}).click();await expect(page.getByRole('alert').filter({hasText:'Translation coverage'})).toHaveCount(0);await expect(page.getByRole('button',{name:'Refresh coverage'})).toBeEnabled();
 }
 report.paginationAccessibilitySnapshot=await page.getByRole('status').filter({hasText:/Page \d+ of \d+/}).ariaSnapshot();
 assert.equal(report.textSamples.flatMap(s=>s.failures).length,0);assert.equal(report.focusSamples.filter(s=>!s.passes).length,0);assert.equal(report.blockedWrites.length,0);assert.equal(report.errors.length,0);
 report.status='COMPLETE';
}catch(e){report.status='ERROR';report.error=e.message;throw e;}finally{await writeFile(`${out}/review.json`,JSON.stringify(report,null,2)+'\n');await browser.close();console.log(JSON.stringify({status:report.status,textSamples:report.textSamples.length,focusSamples:report.focusSamples.length,textFailures:report.textSamples.flatMap(s=>s.failures).length,focusFailures:report.focusSamples.filter(s=>!s.passes).length,error:report.error}));}
