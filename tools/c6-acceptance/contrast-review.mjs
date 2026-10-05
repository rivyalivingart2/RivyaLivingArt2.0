import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {login,launch,addSession,origin,record,output} from './common.mjs';
const require=createRequire(import.meta.url);
const routes=process.argv.slice(2).length?process.argv.slice(2):[...JSON.parse(readFileSync(output+'/accessibility-final.json','utf8')).samples.map(s=>s.route),'/studio/content?record=page%3Ahome'];
const cookie=await login(),{browser,page,context}=await launch(cookie,{reducedMotion:'reduce'}),samples=[];
const linear=c=>(c/=255)<=0.04045?c/12.92:((c+0.055)/1.055)**2.4;
const lum=rgb=>rgb.reduce((s,c,i)=>s+linear(c)*[0.2126,0.7152,0.0722][i],0);
const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
try{for(const route of routes)for(const width of [1440,390]){
 if(route==='/studio/login')await context.clearCookies();else if(route.startsWith('/studio'))await addSession(context,cookie);
 await page.setViewportSize({width,height:1000});await page.goto(origin+route,{waitUntil:'networkidle',timeout:90000});await page.evaluate(()=>document.fonts.ready);
 assert.equal(new URL(page.url()).pathname,new URL(origin+route).pathname,'Review the requested screen, never an authentication redirect');
 // Load below-fold backgrounds before taking stable text coordinates.
 await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=800){scrollTo(0,y);await new Promise(requestAnimationFrame);}scrollTo(0,0);});
 await page.waitForLoadState('networkidle');await page.evaluate(async()=>{await Promise.all([...document.images].filter(i=>i.complete).map(i=>i.decode().catch(()=>{})));scrollTo(0,0);await new Promise(requestAnimationFrame);});
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const audit=await page.evaluate(async()=>{
  const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}),nodes=[];
  for(const rule of result.incomplete)for(const node of rule.nodes){
   const e=document.querySelector(node.target[0]);if(!e||!e.checkVisibility({visibilityProperty:true,opacityProperty:true}))continue;
   const style=getComputedStyle(e),rects=[],walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let text;
   while((text=walker.nextNode()))if(text.textContent.trim()&&text.parentElement.checkVisibility({visibilityProperty:true,opacityProperty:true})){
    const range=document.createRange();range.selectNodeContents(text);for(const r of range.getClientRects())if(r.width&&r.height)rects.push({x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height});
   }
   if(e instanceof HTMLSelectElement){const r=e.getBoundingClientRect(),size=parseFloat(style.fontSize),left=parseFloat(style.paddingLeft)+2;const ctx=document.createElement('canvas').getContext('2d');ctx.font=style.font;rects.push({x:r.x+scrollX+left,y:r.y+scrollY+(r.height-size)/2,w:Math.min(ctx.measureText(e.selectedOptions[0]?.text||'').width,r.width-left-24),h:size});}
   let opacity=1;const surfaces=[];for(let el=e;el;el=el.parentElement){const s=getComputedStyle(el);opacity*=Number(s.opacity);if(s.backgroundColor!=='rgba(0, 0, 0, 0)'||s.backgroundImage!=='none')surfaces.push({tag:el.tagName,background:s.backgroundColor,image:s.backgroundImage});}
   const color=style.color.match(/[\d.]+/g)?.map(Number),large=parseFloat(style.fontSize)>=24||(parseFloat(style.fontSize)>=18.66&&Number(style.fontWeight)>=700);
   nodes.push({id:rule.id,target:node.target,reason:node.any.concat(node.all,node.none).map(c=>c.message),color,opacity,required:large?3:4.5,fontSize:style.fontSize,rects,surfaces,disabled:e.matches(':disabled')||!!e.closest('[inert]')});
  }
  return {nodes,violations:result.violations.map(v=>({id:v.id,count:v.nodes.length}))};
 });
 // Rasterize the actual composed backgrounds, including gradients and imagery.
 // Hide text paint only (never opacity, geometry, images or background layers).
 const mask=await page.addStyleTag({content:'*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;text-decoration-color:transparent!important} input::placeholder,textarea::placeholder{color:transparent!important}'});
 const pageHeight=await page.evaluate(()=>document.documentElement.scrollHeight),tiles=new Map(),bands=new Set();
 for(const node of audit.nodes)for(const r of node.rects)for(let y=Math.max(0,Math.floor(r.y/1000)*1000);y<Math.min(pageHeight,r.y+r.h);y+=1000)bands.add(y);
 const cdp=await context.newCDPSession(page);
 for(const y of [...bands].sort((a,b)=>a-b)){
  // Small explicit clips avoid browser texture limits on >16k-pixel pages.
  const shot=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y,width,height:Math.min(1000,pageHeight-y),scale:1}});
  tiles.set(y,await sharp(Buffer.from(shot.data,'base64')).removeAlpha().raw().toBuffer({resolveWithObject:true}));
 }
 await cdp.detach();await mask.evaluate(e=>e.remove());
 const checks=audit.nodes.map(({rects,...node})=>{
  let minimum=Infinity,pixels=0;
  if(node.color&&node.id==='color-contrast')for(const r of rects){
   for(let y=Math.max(0,Math.ceil(r.y+1));y<Math.min(pageHeight,Math.floor(r.y+r.h-1));y+=2)for(let x=Math.max(0,Math.ceil(r.x+1));x<Math.min(width,Math.floor(r.x+r.w-1));x+=2){
    const band=Math.floor(y/1000)*1000,{data,info}=tiles.get(band),offset=((y-band)*info.width+x)*info.channels,bg=[data[offset],data[offset+1],data[offset+2]],alpha=(node.color[3]??1)*node.opacity,fg=node.color.slice(0,3).map((c,i)=>alpha*c+(1-alpha)*bg[i]);minimum=Math.min(minimum,ratio(fg,bg));pixels++;
   }
  }
  return {...node,pixels,minimum:pixels?Math.round(minimum*100)/100:null,meets:pixels?minimum>=node.required:null};
 });
 samples.push({route,width,violations:audit.violations,checks});console.log(JSON.stringify({route,width,cases:checks.length,below:checks.filter(c=>c.meets===false&&!c.disabled).map(c=>({target:c.target,ratio:c.minimum,required:c.required})),unresolved:checks.filter(c=>c.meets===null&&!c.disabled).map(c=>({id:c.id,target:c.target,reason:c.reason}))}));
}}finally{await browser.close();record('contrast-review',{at:new Date().toISOString(),method:'Assistant contrast review aid: raster-sampled background under text rectangles with foreground/ancestor alpha compositing, 2px grid. Includes gradients and images. Current rendered states only; native controls and non-text shapes require separate judgment. Screenshot text paint hidden in memory; customer strings/HTML never recorded.',samples});}
