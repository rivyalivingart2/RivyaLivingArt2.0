import {chromium} from '@playwright/test';
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';

const origin=process.env.RIVYA_CONTRAST_ORIGIN||'http://127.0.0.1:4199';
const directory='test-results/rivya-master-audit';await mkdir(directory,{recursive:true});
const label=process.env.RIVYA_CONTRAST_LABEL||'contrast';
const widths=(process.env.RIVYA_CONTRAST_WIDTHS||'1920,1440,1200,992,768,512,390,320').split(',').map(Number);
const selectedPaths=process.env.RIVYA_CONTRAST_PATHS?.split(',');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={at:new Date().toISOString(),origin,method:'Rendered background pixels behind visible text-node line rectangles with glyph fill hidden but backgrounds, scrims, filters and lighting retained. Five decoded video times and three ambient positions are sampled. Synthetic white/black media stress cases are labelled separately. Scroll is held still during measurement; lines obscured by another element such as the fixed navigation are excluded. Partly offscreen and fading text is excluded. This is finite browser evidence, not every animation frame or native assistive certification.',samples:[],errors:[]};
const luminance=rgb=>rgb.slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const routes=[{path:'/',targets:['[data-home-hero-section]','[data-material-film]','[data-home-chapter=story]','[data-home-chapter=invitation]']},{path:'/our-story',targets:['main','[data-public-part=chapter][data-immersive=true]']},{path:'/collectible-design',targets:['[data-public-part=opening]']},{path:'/studio/login',targets:['main']},{path:'/studio/request-access',targets:['main']},{path:'/studio/forgot-password',targets:['main']},{path:'/studio/set-password',targets:['main']}];
const glyphCss='html{scroll-behavior:auto!important}html[data-audit-hide-glyphs] body *{ -webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important }html[data-audit-hide-glyphs] body svg{visibility:hidden!important}';
try{for(const width of widths){
 const context=await browser.newContext({viewport:{width,height:width<600?844:1000},reducedMotion:'no-preference',deviceScaleFactor:1}),page=await context.newPage();page.setDefaultTimeout(12000);
 for(const row of routes.filter(row=>!selectedPaths||selectedPaths.includes(row.path))){try{
  await page.goto(origin+row.path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);await page.addStyleTag({content:glyphCss});
  for(const selector of row.targets){const target=page.locator(selector).first();if(!await target.count()){if(selector.includes('data-immersive'))continue;report.errors.push({path:row.path,width,selector,error:'Target absent'});continue;}
   await target.scrollIntoViewIfNeeded();await page.waitForTimeout(1000);
   // Explicitly play the fixture film before seeking; capture actual readiness so
   // a poster sample cannot silently be described as a decoded moving frame.
   await target.evaluate(async root=>{const v=root.querySelector('video');if(v){const b=root.querySelector('button[aria-controls]');if(v.readyState<2)b?.click();await Promise.race([new Promise(resolve=>{if(v.readyState>=2)resolve();else v.addEventListener('loadeddata',resolve,{once:true});}),new Promise(resolve=>setTimeout(resolve,8000))]);}});
   const scenarios=process.env.RIVYA_CONTRAST_STATES?.split(',')||(selector.includes('material-film')||selector.includes('hero')?['frame-0','frame-2','frame-4','frame-6','frame-7.8','white-media','black-media']:['ambient-start','ambient-mid','ambient-end','white-media','black-media']);
   for(const state of scenarios){
    await page.mouse.move(state==='ambient-end'?width-20:20,state==='ambient-mid'?600:180);
    await page.evaluate(async state=>{
     document.documentElement.removeAttribute('data-audit-hide-glyphs');document.getElementById('audit-media-stress')?.remove();
     for(const a of document.getAnimations()){if(typeof a.currentTime==='number'&&(a.effect?.target?.closest('[data-cinematic-canvas]')||a.animationName?.includes('glass-flow'))){a.pause();a.currentTime=state==='ambient-end'?16000:state==='ambient-mid'?8000:0;}}
     if(state.startsWith('frame-'))await Promise.all([...document.querySelectorAll('video')].filter(v=>v.readyState>=2).map(v=>new Promise(resolve=>{v.pause();v.currentTime=Math.min(parseFloat(state.slice(6)),Math.max(0,v.duration-.05));v.addEventListener('seeked',resolve,{once:true});setTimeout(resolve,500);})));
     if(state.endsWith('-media')){const style=document.createElement('style');style.id='audit-media-stress';style.textContent='main img:not([alt*=logo i]),main video{filter:brightness(0) '+(state.includes('white-media')?'invert(1)':'')+'!important}';document.head.append(style);}
    },state);
    if(state.startsWith('hover')||state.startsWith('focus')){const control=target.locator('a,button,input,select,textarea,summary').filter({visible:true}).first();if(await control.count()){if(state.startsWith('hover'))await control.hover();else{await page.keyboard.press('Tab');await control.focus();}}}
    await page.waitForTimeout(180);
    const atoms=await target.evaluate(root=>{
     const atoms=[],walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
     while((node=walk.nextNode())){if(!node.textContent.trim())continue;const el=node.parentElement;if(!el||el.closest('script,style,[aria-hidden=true],option'))continue;const cs=getComputedStyle(el),rect=el.getBoundingClientRect();if(rect.width<=1||rect.height<=1||cs.visibility!=='visible')continue;let alpha=1,p=el;while(p){alpha*=parseFloat(getComputedStyle(p).opacity);p=p.parentElement;}if(alpha<.98)continue;
      const color=(cs.color.match(/[\d.]+/g)||[]).map(Number);if(color.length<3)continue;const range=document.createRange();range.selectNodeContents(node);const boxes=[...range.getClientRects()].filter(r=>r.width>2&&r.height>2&&r.top>=0&&r.bottom<=innerHeight&&r.left>=0&&r.right<=innerWidth).filter(r=>[1,r.width/2,r.width-1].every(x=>[1,r.height/2,r.height-1].every(y=>{const hit=document.elementFromPoint(r.x+x,r.y+y);return hit&&(hit===el||el.contains(hit)||hit.contains(el));}))).map(r=>({x:r.x,y:r.y,width:r.width,height:r.height}));
      if(boxes.length)atoms.push({text:node.textContent.trim().slice(0,90),color,size:parseFloat(cs.fontSize),weight:parseFloat(cs.fontWeight)||400,minimum:parseFloat(cs.fontSize)>=24||(parseFloat(cs.fontSize)>=18.66&&parseFloat(cs.fontWeight)>=700)?3:4.5,boxes});
     }return atoms;
    });
    await page.evaluate(()=>document.documentElement.setAttribute('data-audit-hide-glyphs',''));
    const {data,info}=await sharp(await page.screenshot({animations:'allow'})).removeAlpha().raw().toBuffer({resolveWithObject:true});
    const results=atoms.map(atom=>{let min=100,worst,point;for(const box of atom.boxes)for(let y=Math.ceil(box.y)+1;y<Math.floor(box.y+box.height)-1;y+=2)for(let x=Math.ceil(box.x)+1;x<Math.floor(box.x+box.width)-1;x+=2){const i=(y*info.width+x)*info.channels,bg=[data[i],data[i+1],data[i+2]],r=ratio(atom.color,bg);if(r<min){min=r;worst=bg;point={x,y};}}return{text:atom.text,foreground:atom.color.slice(0,3),background:worst,point,ratio:+min.toFixed(3),minimum:atom.minimum};}).filter(r=>r.background);
    if(results.some(r=>r.ratio+0.015<r.minimum))await page.screenshot({path:`${directory}/${label}-failure-${width}-${selector.replace(/[^a-zA-Z0-9]/g,'')}-${state}.png`});
    const media=await target.evaluate(root=>[...root.querySelectorAll('video')].map(v=>({readyState:v.readyState,currentTime:v.currentTime,duration:Number.isFinite(v.duration)?v.duration:null,decoded:v.readyState>=2})));
    report.samples.push({path:row.path,width,selector,state,media,texts:results.length,minimumRatio:Math.min(...results.map(r=>r.ratio)),failures:results.filter(r=>r.ratio+0.015<r.minimum)});
    await page.evaluate(()=>document.documentElement.removeAttribute('data-audit-hide-glyphs'));
    if(state===scenarios[0])await page.screenshot({path:`${directory}/${label}-${row.path.replaceAll('/','-')||'home'}-${selector.replace(/[^a-zA-Z0-9]/g,'')}-${width}.png`});
   }
  }
 }catch(error){report.errors.push({path:row.path,width,error:error.message});}await writeFile(directory+'/'+label+'.json',JSON.stringify(report,null,2)+'\n');}
 await context.close();
}}finally{await browser.close();await writeFile(directory+'/'+label+'.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({samples:report.samples.length,failingSamples:report.samples.filter(s=>s.failures.length).length,errors:report.errors}));
