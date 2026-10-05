import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {resolve,dirname,basename} from 'node:path';
import assert from 'node:assert/strict';
import {login,addSession,origin,output,record,modules,fingerprint,existingRows,preserve} from './common.mjs';

const cookie=await login(),before=await existingRows(),protectedBefore=await fingerprint();
const routes=['/','/collectible-design','/memory-art','/personal-art','/search','/saved-pieces','/pieces/river-channel','/pieces/vow-framed-varmala-keepsake','/pieces/botanical-resin-pendant','/pieces/river-channel/customize','/commission','/commission/customize','/preserve','/personalize','/our-story','/process','/materials-care','/architects','/portfolio','/journal','/journal/a-room-begins-with-a-statement-table','/faq','/contact','/imprint','/privacy','/terms','/shipping-delivery','/returns-cancellations','/accessibility','/inquiry/received','/c6-unavailable-page','/studio/login',...modules.map(m=>'/studio'+(m?'/'+m:'')), '/studio/content?record=page%3Ahome'];
const samples=[],errors=[],interactions=[];let baseline;
try{for(const factor of [1,2,4]){
 const profile=mkdtempSync(resolve(output,'zoom-profile-'));mkdirSync(resolve(profile,'Default'));
 // Chrome's native page-zoom preference, consumed by ChromeZoomLevelPrefs.
 // Default partition key "x" is hex(empty relative path), not CSS/device emulation.
 writeFileSync(resolve(profile,'Default/Preferences'),JSON.stringify({partition:{default_zoom_level:{x:Math.log(factor)/Math.log(1.2)}}}));
 const persistent=await chromium.launchPersistentContext(profile,{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,viewport:null,args:['--window-size=1440,1000']});
 try{
  // Incognito contexts inherit zoom but keep the QA session in memory only.
  // The persistent profile never receives cookies or navigates to Studio.
  const context=await persistent.browser().newContext({viewport:null,reducedMotion:'reduce'});
  await addSession(context,cookie);const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  for(const route of factor===1?['/']:routes){
   if(route==='/studio/login')await context.clearCookies();if(route==='/studio')await addSession(context,cookie);
   const response=await page.goto(origin+route,{waitUntil:'networkidle',timeout:90000});await page.evaluate(()=>document.fonts.ready);
   assert.equal(new URL(page.url()).pathname,new URL(origin+route).pathname);
   const geometry=await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,scale:visualViewport.scale,cssZoom:getComputedStyle(document.body).zoom,overflow:document.documentElement.scrollWidth>innerWidth+1,h1:!!document.querySelector('#main-content h1')}));
   if(factor===1)baseline=geometry;
   assert.ok(Math.abs(geometry.width*factor-baseline.width)<=factor&&Math.abs(geometry.dpr/baseline.dpr-factor)<0.01,'Prove native zoom using inverse CSS viewport and device pixel ratio');
   assert.equal(geometry.scale,1,'No pinch zoom');assert.equal(geometry.cssZoom,'1','No CSS zoom');
   samples.push({route,factor,status:response.status(),...geometry});
   if(factor>1&&['/','/commission/customize','/studio/content?record=page%3Ahome'].includes(route)){
    const studio=route.startsWith('/studio'),menu=page.getByRole('button',{name:studio?'Open Studio navigation':'Open navigation',exact:true});
    const trigger=await menu.isVisible()?menu:page.getByRole('button',{name:/Find a Studio page/});
    await trigger.click();const dialog=page.locator('dialog[open]');await dialog.waitFor();
    assert.equal(await dialog.evaluate(e=>e.scrollWidth>e.clientWidth+1),false,'Zoomed navigation has no horizontal clipping');
    await page.keyboard.press('Escape');assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
    interactions.push({route,factor,dialogFocusReturn:true});
    if(route==='/'){
     // Native zoom changes DPR; Playwright's CSS clipping can crop this capture.
     // An unclipped CDP viewport capture preserves the actual browser pixels.
     const cdp=await context.newCDPSession(page),shot=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
     writeFileSync(resolve(output,'native-zoom-'+factor*100+'.png'),Buffer.from(shot.data,'base64'));await cdp.detach();
    }
   }
   console.log(JSON.stringify({factor,route,overflow:geometry.overflow}));
  }
  await context.close();
 }finally{
  await persistent.close();
  assert.equal(dirname(resolve(profile)),output);assert.ok(basename(profile).startsWith('zoom-profile-'));
  rmSync(profile,{recursive:true,force:true,maxRetries:3});
 }
}}finally{
 await preserve(before,protectedBefore);record('native-zoom',{at:new Date().toISOString(),method:'Chrome native default page zoom in disposable profiles; authenticated incognito contexts only. CSS zoom=1, visualViewport.scale=1; CSS width and DPR prove 100/200/400 percent. This is browser automation, not human/physical-device use.',baseline,samples,interactions,errors,protectedRecordsUnchanged:true,complete:samples.length===1+routes.length*2});
}
assert.ok(!errors.length&&samples.every(s=>!s.overflow),'Native browser zoom route matrix');
