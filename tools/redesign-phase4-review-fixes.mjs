import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const out='output/playwright/redesign-phase4',origin='http://127.0.0.1:4199';
const luminance=rgb=>rgb.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
const ratio=(fg,bg)=>{const a=luminance(fg),b=luminance(bg);return Number(((Math.max(a,b)+.05)/(Math.min(a,b)+.05)).toFixed(2));};
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={checks:[],captures:[],scope:'Independent review fix verification: opening label text and light/dark focus rings'};
try{for(const width of [1440,768,390,320]){
 const page=await browser.newPage({viewport:{width,height:width<700?844:1000},reducedMotion:'reduce'});
 for(const route of ['/privacy','/our-story']){await page.goto(origin+route,{waitUntil:'networkidle'});const label=page.locator('[data-public-part=opening] [data-public-part=intro]>span').first();const colors=await label.evaluate(e=>({fg:getComputedStyle(e).color,bg:getComputedStyle(e.closest('[data-public-part=opening]')).backgroundColor}));const value=ratio(colors.fg,colors.bg);assert.ok(value>=4.5);report.checks.push({width,route,kind:'opening label',...colors,ratio:value});}
 await page.goto(origin+'/privacy',{waitUntil:'networkidle'});const link=page.locator('[data-public-part=contents] a').first();await page.keyboard.press('Tab');await link.focus();await link.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,e.getBoundingClientRect().top+scrollY-160);});await page.waitForTimeout(350);
 let colors=await link.evaluate(e=>({fg:getComputedStyle(e).outlineColor,bg:getComputedStyle(e.closest('[data-public-part=reading]')).backgroundColor,outlineWidth:getComputedStyle(e).outlineWidth}));let value=ratio(colors.fg,colors.bg);assert.ok(value>=3&&colors.outlineWidth==='3px');report.checks.push({width,kind:'ivory focus',...colors,ratio:value});let file=width+'-focus-ivory.png';await page.screenshot({path:out+'/'+file});report.captures.push(file);
 await page.goto(origin+'/commission/customize',{waitUntil:'networkidle'});const input=page.locator('#answer-purpose');await page.keyboard.press('Tab');await input.focus();await input.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,e.getBoundingClientRect().top+scrollY-200);});await page.waitForTimeout(350);colors=await input.evaluate(e=>({fg:getComputedStyle(e).outlineColor,bg:getComputedStyle(document.querySelector('main')).backgroundColor,outlineWidth:getComputedStyle(e).outlineWidth}));value=ratio(colors.fg,colors.bg);assert.ok(value>=3&&colors.outlineWidth==='3px');report.checks.push({width,kind:'dark focus',...colors,ratio:value});file=width+'-focus-dark.png';await page.screenshot({path:out+'/'+file});report.captures.push(file);await page.close();
}
 for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});
 await page.goto(origin+'/faq',{waitUntil:'networkidle'});
 const summary=page.locator('main details summary').first();await page.keyboard.press('Tab');await summary.focus();await summary.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,e.getBoundingClientRect().top+scrollY-160);});await page.waitForTimeout(350);
 let colors=await summary.evaluate(e=>({fg:getComputedStyle(e).outlineColor,bg:getComputedStyle(e.closest('[data-public-part=reading]')).backgroundColor,outlineWidth:getComputedStyle(e).outlineWidth}));let value=ratio(colors.fg,colors.bg);assert.ok(value>=3&&colors.outlineWidth==='3px');report.checks.push({width,kind:'FAQ ivory focus',...colors,ratio:value});let file=width+'-focus-faq.png';await page.screenshot({path:out+'/'+file});report.captures.push(file);
 if(width===390)await page.getByRole('button',{name:'Filter faqs',exact:true}).click();
 const filter=page.locator(width===390?'dialog[open] input[name=q]':'main form input[name=q]').first();await page.keyboard.press('Tab');await filter.focus();await filter.scrollIntoViewIfNeeded();await page.waitForTimeout(350);
 colors=await filter.evaluate(e=>{let p=e.parentElement;while(p&&['rgba(0, 0, 0, 0)','transparent'].includes(getComputedStyle(p).backgroundColor))p=p.parentElement;return {fg:getComputedStyle(e).outlineColor,bg:getComputedStyle(p).backgroundColor,outlineWidth:getComputedStyle(e).outlineWidth};});value=ratio(colors.fg,colors.bg);assert.ok(value>=3&&colors.outlineWidth==='3px');report.checks.push({width,kind:'nested dark filter focus',...colors,ratio:value});file=width+'-focus-dark-filter.png';await page.screenshot({path:out+'/'+file});report.captures.push(file);await page.close();
 }
}finally{await browser.close();await writeFile(out+'/review-fixes-verification.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify(report.checks));
