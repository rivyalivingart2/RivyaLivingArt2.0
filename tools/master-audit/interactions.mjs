import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';

const origin='http://127.0.0.1:4199',out='test-results/rivya-master-audit';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={at:new Date().toISOString(),scope:'Local browser behavior checks; emulated preferences and device capability are not physical/native evidence.',checks:[],issues:[],captures:[]};
const check=(name,pass,detail)=>{report.checks.push({name,pass:!!pass,detail});if(!pass)report.issues.push(name);};
const save=()=>writeFile(out+'/interactions.json',JSON.stringify(report,null,2)+'\n');
async function scenario(name,fn,options={}){
 const context=await browser.newContext({viewport:{width:1440,height:1000},...options}),page=await context.newPage();page.setDefaultTimeout(20000);
 try{await fn(page,context);}catch(e){check(name,false,e.message.split('\n')[0]);}finally{await context.close();await save();}
}
async function shot(page,name){await page.screenshot({path:out+'/'+name+'.png'});report.captures.push(name+'.png');}
try{
 for(const manual of [false,true])await scenario('font gate '+manual,async page=>{
  let release;const gate=new Promise(resolve=>{release=resolve;});
  await page.route(/\.woff2(?:\?|$)/,async route=>{await gate;await route.continue();});
  try{
   await page.goto(origin,{waitUntil:'domcontentloaded'});
   const hero=page.locator('[data-home-hero-section]'),video=hero.locator('video');await video.waitFor({state:'attached'});await page.waitForTimeout(1600);
   check('Fonts pending: automatic hero sources deferred '+manual,await video.locator('source').count()===0);
   check('Fonts pending: readable fallback heading '+manual,await hero.locator('h1').isVisible());
   if(manual){await hero.getByRole('button',{name:/Play film:/}).click();await video.locator('source').first().waitFor({state:'attached'});check('Explicit Play bypasses pending font gate',true);}
   release();await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>!!document.querySelector('[data-home-hero-section] video')?.readyState&&document.querySelector('[data-home-hero-section] video').paused===false);
   check('Hero plays after '+(manual?'explicit request':'fonts and poster decode'),true);
   await page.locator('[data-home-chapter=invitation]').scrollIntoViewIfNeeded();await page.waitForTimeout(500);
   check('Offscreen hero pauses '+manual,await video.evaluate(v=>v.paused));
  }finally{release();}
 });
 for(const mode of ['reduced','save-data','slow-network','low-power','touch'])await scenario(mode+' fallback',async page=>{
  if(mode==='save-data'||mode==='slow-network')await page.addInitScript(mode=>{const connection=new EventTarget();connection.saveData=mode==='save-data';connection.effectiveType=mode==='slow-network'?'2g':'4g';Object.defineProperty(navigator,'connection',{value:connection,configurable:true});},mode);
  if(mode==='low-power')await page.addInitScript(()=>{Object.defineProperty(navigator,'hardwareConcurrency',{value:2,configurable:true});Object.defineProperty(navigator,'deviceMemory',{value:2,configurable:true});});
  await page.goto(origin,{waitUntil:'networkidle'});const root=page.locator('[data-cinematic-canvas]').first(),video=page.locator('[data-home-hero-section] video');
  const state=await root.getAttribute('data-cinema-state');check(mode+' static lighting fallback',['reduced-motion','low-power','touch'].includes(state),state);
  if(['reduced','save-data','slow-network'].includes(mode)){
   check(mode+' no automatic video fetch',await video.locator('source').count()===0);
   await page.locator('[data-home-hero-section]').getByRole('button',{name:/Play film:/}).click();await page.waitForFunction(()=>document.querySelector('[data-home-hero-section] video').readyState>=2);check(mode+' manual video remains available',true);
  }
 },mode==='reduced'?{reducedMotion:'reduce'}:mode==='touch'?{isMobile:true,hasTouch:true,viewport:{width:390,height:844}}:{});
 await scenario('format failure',async page=>{
  await page.route(/\.(mp4|webm)(?:\?|$)/,route=>route.abort());await page.goto(origin,{waitUntil:'networkidle'});
  const hero=page.locator('[data-home-hero-section]');await hero.getByText('Film unavailable. Still image shown.',{exact:true}).waitFor();
  check('Unavailable formats retain visible poster',await hero.locator('img').first().evaluate(i=>i.complete&&i.naturalWidth>0));await shot(page,'film-unavailable-poster');
 });
 await scenario('expanded film keyboard',async page=>{
  await page.goto(origin,{waitUntil:'networkidle'});const film=page.locator('[data-material-film]');await film.scrollIntoViewIfNeeded();const button=film.getByRole('button',{name:'View film',exact:false});await button.click();
  const dialog=page.getByRole('dialog');await dialog.waitFor();check('Expanded player opens',await dialog.locator('video').count()===1);
  await page.keyboard.press('Escape');check('Escape closes expanded player',!await dialog.count());check('Expanded player restores focus',await button.evaluate(el=>el===document.activeElement));
  const effects=page.getByRole('button',{name:'Pause decorative visual effects',exact:true});await effects.click();await page.reload({waitUntil:'networkidle'});
  check('Effects pause persists after reload',await page.locator('[data-cinematic-canvas]').first().getAttribute('data-cinema-state')==='paused');
 });
 for(const width of [1920,1440,1200,992,768,512,390,320])await scenario('focus '+width,async page=>{
  for(const [path,selector] of [['/','[data-home-hero-section] a'],['/studio/login','input'],['/studio/request-access','input'],['/contact','main a'],['/collectible-design','main a']]){
   await page.goto(origin+path,{waitUntil:'networkidle'});const control=page.locator(selector).filter({visible:true}).first();await control.scrollIntoViewIfNeeded();await page.keyboard.press('Tab');await control.focus();
   const value=await control.evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return{focusVisible:el.matches(':focus-visible'),outline:s.outlineColor,width:s.outlineWidth,offset:s.outlineOffset,shadow:s.boxShadow,visible:r.width>0&&r.height>0,overflow:document.documentElement.scrollWidth>innerWidth+1};});
   check(width+' '+path+' dual-edge keyboard focus',value.focusVisible&&value.width==='2px'&&value.outline==='rgb(244, 241, 233)'&&value.shadow.includes('rgb(8, 10, 14)')&&!value.overflow,value);
   if(width===390&&path==='/studio/login')await shot(page,'studio-login-focus-390');
  }
 },{viewport:{width,height:width<600?844:1000}});
 await scenario('forced colors',async page=>{await page.goto(origin+'/studio/login',{waitUntil:'networkidle'});await page.keyboard.press('Tab');const input=page.locator('input').filter({visible:true}).first();await input.focus();const value=await input.evaluate(e=>({visible:e.matches(':focus-visible'),width:getComputedStyle(e).outlineWidth,style:getComputedStyle(e).outlineStyle,shadow:getComputedStyle(e).boxShadow}));check('System high-contrast focus retained',value.visible&&value.width==='2px'&&value.style==='solid'&&value.shadow==='none',value);},{forcedColors:'active'});
}finally{await browser.close();await save();}
console.log(JSON.stringify({checks:report.checks.length,issues:report.issues}));
