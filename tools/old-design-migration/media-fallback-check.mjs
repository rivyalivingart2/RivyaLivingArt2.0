import assert from 'node:assert/strict';
import {expect} from '@playwright/test';
import {localBrowser,origin} from './local-browser.mjs';
const {browser,context}=await localBrowser();await context.close();
try{
 for(const failBoth of [false,true]){
  const isolated=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await isolated.newPage(),blocked=[];
  await isolated.route('**/hero-pour-loop.webm',route=>{blocked.push('webm');return route.abort();});
  if(failBoth)await isolated.route('**/hero-pour-loop.mp4',route=>{blocked.push('mp4');return route.abort();});
  await page.goto(origin+'/',{waitUntil:'networkidle'});await page.locator('[data-material-film]').scrollIntoViewIfNeeded();await page.getByRole('button',{name:'Play film',exact:false}).click();
  try{
   if(failBoth)await expect(page.getByText('Film unavailable. The still image is shown.',{exact:true})).toBeVisible();
   else {await expect.poll(()=>page.locator('video').evaluate(v=>v.currentSrc)).toContain('hero-pour-loop.mp4');await expect.poll(()=>page.locator('video').evaluate(v=>v.currentTime)).toBeGreaterThan(0);}
   assert.ok(blocked.includes('webm'));if(failBoth)assert.ok(blocked.includes('mp4'));console.log(JSON.stringify({failBoth,blocked,passed:true}));
  }catch(error){console.log(JSON.stringify({failBoth,blocked,video:await page.locator('video').evaluateAll(nodes=>nodes.map(v=>({src:v.currentSrc,time:v.currentTime,paused:v.paused,error:v.error?.code,network:v.networkState,ready:v.readyState}))),fallback:await page.getByText('Film unavailable. The still image is shown.',{exact:true}).count()}));throw error;}
  await isolated.close();
 }
}finally{await browser.close();}
