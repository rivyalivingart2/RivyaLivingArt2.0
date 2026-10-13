import {chromium} from 'playwright';
import {readFileSync,writeFileSync} from 'node:fs';
const checks=[],check=(name,pass,detail)=>checks.push({name,pass,detail});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const out='output/playwright/redesign-phase2';
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('http://127.0.0.1:4179/#reading');await page.waitForFunction(()=>window.phase2Preview);await page.waitForTimeout(700);
 check('Direct hash retains reading target',await page.locator('#reading').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<160));
 await page.reload();await page.waitForTimeout(700);check('Hash survives reload',await page.locator('#reading').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<160));
 await page.goto('http://127.0.0.1:4179/');await page.waitForFunction(()=>window.phase2Preview);await page.getByRole('link',{name:'Explore the material'}).click();await page.waitForTimeout(700);await page.goBack();await page.waitForTimeout(700);check('Back restores opening',await page.evaluate(()=>scrollY<160));
 await page.getByRole('button',{name:'Play film',exact:true}).focus();await page.keyboard.press('Enter');await page.waitForTimeout(800);check('Keyboard activates film',await page.locator('video').evaluate(v=>!v.paused&&v.currentTime>0));
 await page.locator('#reading').scrollIntoViewIfNeeded();await page.waitForTimeout(800);check('Offscreen film pauses',await page.locator('video').evaluate(v=>v.paused));
 await page.locator('.image-open').first().click();await page.keyboard.press('Tab');check('Modal traps keyboard focus',await page.locator('dialog').evaluate(d=>d.contains(document.activeElement)));await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Smooth scroll on',exact:true}).click();check('Independent smooth setting restores native anchor behavior',await page.evaluate(()=>document.documentElement.style.scrollBehavior!=='smooth'));
 const colourPairs=await page.evaluate(()=>{
  const selectors=[['.opening-copy .rv-button','#b89b63'],['.opening-copy>p','#080a0e'],['.material-section .small','#08283a'],['.media-item figcaption p','#080a0e'],['.reading-intro','#f4f1e9']];
  return selectors.map(([selector,bg])=>({selector,fg:getComputedStyle(document.querySelector(selector)).color,bg}));
 });
 function luminance(rgb){return rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);}
 for(const p of colourPairs){const fg=p.fg.match(/[\d.]+/g).slice(0,3).map(Number),bg=p.bg.slice(1).match(/../g).map(h=>parseInt(h,16));const a=luminance(fg),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);check(`Computed text contrast: ${p.selector}`,ratio>=4.5,{...p,ratio:Number(ratio.toFixed(2))});}
 const assets=JSON.parse(readFileSync('experiments/redesign-phase2/media-manifest.json','utf8'));
 let variants=0;for(const asset of assets)for(const v of asset.variants){const r=await page.request.get(`http://127.0.0.1:4179${v.src}`);if(r.status()===200&&(await r.body()).length===v.bytes)variants++;}check('All 36 responsive variants return exact registered bytes',variants===36,{variants});
 for(const width of [320,768,1024]){await page.setViewportSize({width,height:900});for(const path of ['/','/studio']){await page.goto('http://127.0.0.1:4179'+path);await page.waitForFunction(()=>window.phase2Preview);check(`${width}px ${path}: no horizontal overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));} }
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4179/studio');check('Mobile Studio logo clears review toolbar',await page.evaluate(()=>document.querySelector('.studio-preview aside img').getBoundingClientRect().top>=document.querySelector('.review-bar').getBoundingClientRect().bottom));
 await page.goto('http://127.0.0.1:4179/');await page.waitForFunction(()=>window.phase2Preview);await page.locator('.opening-image img').evaluate(i=>i.dispatchEvent(new Event('error')));check('Image failure shows accessible fallback',await page.locator('.opening-image .rv-image-fallback').isVisible());
 await page.route('**/assets/film.mp4',r=>r.abort());await page.route('**/assets/film.webm',r=>r.abort());await page.getByRole('button',{name:'Play film',exact:true}).click();await page.waitForTimeout(700);check('Video failure retains description and recovery status',await page.locator('.rv-film-status').textContent().then(t=>t.length>0));
}finally{await browser.close();writeFileSync(`${out}/edge-cases.json`,JSON.stringify({at:new Date().toISOString(),checks},null,2));}
console.log(JSON.stringify({checks:checks.length,failed:checks.filter(c=>!c.pass)},null,2));if(checks.some(c=>!c.pass))process.exitCode=1;
