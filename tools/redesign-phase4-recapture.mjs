import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const out='output/playwright/redesign-phase4',origin='http://127.0.0.1:4199';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const receipt=[];
try{for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});
 await page.goto(origin+'/commission/customize',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Your details →',exact:true}).click();await page.waitForTimeout(800);
 await page.getByRole('heading',{name:'Your piece',exact:true}).evaluate(e=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,e.getBoundingClientRect().top+scrollY-112);});await page.waitForTimeout(350);
 await page.screenshot({path:out+'/'+width+'-brief-errors.png'});receipt.push({file:width+'-brief-errors.png',scope:'Settled validation context; no submit'});
 await page.locator('#answer-piece_type').selectOption({index:1});await page.locator('#answer-purpose').fill('LOCAL UNSAVED LAYOUT TEST');await page.locator('#answer-city').fill('Local test');
 await page.getByRole('button',{name:'Your details →',exact:true}).click();
 await page.locator('#contact-name').fill('Local preview only');await page.locator('#contact-phone').fill('9999999999');await page.locator('#contact-consent').check();await page.getByRole('button',{name:'Review your brief →',exact:true}).click();
 const heading=page.getByRole('heading',{name:'Review',exact:true});await heading.waitFor();
 // Wait for the existing form's focus/scroll effects, then choose a deliberate capture position.
 await page.waitForTimeout(800);await heading.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,e.getBoundingClientRect().top+scrollY-112);});await page.waitForTimeout(350);
 const rect=await heading.boundingBox();assert.ok(rect&&rect.y>=0&&rect.y<300);
 const file=width+'-brief-review.png';await page.screenshot({path:out+'/'+file});receipt.push({file,headingY:rect.y,scope:'Built app; synthetic answers remain unsaved'});
 const save=page.getByRole('button',{name:/^(Save order details →|Saving temporarily unavailable)$/});await save.scrollIntoViewIfNeeded();await page.waitForTimeout(350);
 const controls=width+'-brief-review-controls.png';await page.screenshot({path:out+'/'+controls});receipt.push({file:controls,label:await save.textContent(),disabled:await save.isDisabled(),scope:'Final save control shown, never clicked; local session rate limiting may disable saving'});
 await page.close();
 const journal=await browser.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});await journal.goto(origin+'/journal',{waitUntil:'networkidle'});const allStories=journal.getByRole('heading',{name:'All stories',exact:true});await allStories.waitFor();await allStories.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,e.getBoundingClientRect().top+scrollY-112);});await journal.waitForTimeout(500);await journal.waitForFunction(()=>[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;}).every(i=>i.complete&&i.naturalWidth>0));await journal.screenshot({path:out+'/'+width+'-journal-body.png'});receipt.push({file:width+'-journal-body.png',scope:'Settled visible archive results, not hidden desktop filter'});await journal.close();
 if(width===1440){const gallery=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});await gallery.goto(origin+'/pieces/amber-veil-wall-panel',{waitUntil:'networkidle'});await gallery.getByRole('button',{name:/Enlarge image of/}).click();await gallery.locator('dialog[open]').waitFor();await gallery.waitForFunction(()=>[...document.querySelectorAll('dialog[open] img')].every(i=>i.complete&&i.naturalWidth>0));await gallery.locator('dialog[open] img').evaluateAll(async ns=>{await Promise.all(ns.map(i=>i.decode()));});await gallery.waitForTimeout(350);const file='1440-gallery-enlarged.png';await gallery.screenshot({path:out+'/'+file});receipt.push({file,decoded:true});await gallery.close();}
}}finally{await browser.close();await writeFile(out+'/recapture-verification.json',JSON.stringify(receipt,null,2));}
console.log(JSON.stringify(receipt));
