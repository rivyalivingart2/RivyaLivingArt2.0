import {chromium} from '@playwright/test';
import {resolve} from 'node:path';
import {origin,output,record} from './common.mjs';
const name=process.argv[2]||'final',browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await context.newPage(),checks=[];
try{
 await page.goto(origin+'/personal-art',{waitUntil:'networkidle'});const badge=page.locator('[class*="cardBadge"]').first();await badge.scrollIntoViewIfNeeded();await page.waitForLoadState('networkidle');
 checks.push({subject:'Product badge',...await badge.evaluate(e=>{const s=getComputedStyle(e);return {color:s.color,background:s.backgroundColor,font:s.fontSize};})});
 await badge.locator('..').screenshot({path:resolve(output,'badge-'+name+'.png')});
 await page.goto(origin+'/',{waitUntil:'networkidle'});await page.screenshot({path:resolve(output,'home-'+name+'.png')});
 const closing=page.locator('#invitation');await closing.scrollIntoViewIfNeeded();await page.waitForLoadState('networkidle');
 await closing.screenshot({path:resolve(output,'closing-'+name+'.png')});
 const text=await closing.locator('a').first().evaluate(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x,y:r.y+scrollY,width:r.width,height:r.height,color:s.color,background:s.backgroundImage,viewport:innerWidth,pageHeight:document.documentElement.scrollHeight};});
 checks.push({subject:'Homepage closing button',...text});
 await page.locator('footer').screenshot({path:resolve(output,'footer-'+name+'.png')});
 await page.goto(origin+'/collectible-design',{waitUntil:'networkidle'});await page.screenshot({path:resolve(output,'collection-'+name+'.png')});
 record('visual-review-'+name,{at:new Date().toISOString(),checks});console.log(JSON.stringify(checks));
}finally{await browser.close();}
