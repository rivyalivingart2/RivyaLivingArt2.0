import {chromium} from 'playwright';
import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';
const out='output/playwright/redesign-phase3';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--disable-gpu']});
try{
 const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4199/',{waitUntil:'networkidle'});
 await page.evaluate(async()=>{await document.fonts.ready;for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,100));}});
 await page.waitForTimeout(1000);
 const height=await page.evaluate(()=>document.documentElement.scrollHeight),tiles=[];
 // Viewport tiles avoid the browser's oversized full-document screenshot artifact.
 // The sticky header appears once at the document top; it is hidden on later tiles.
 for(let top=0;top<height;top+=1000){
  await page.evaluate(y=>scrollTo(0,y),top);await page.waitForTimeout(50);
  const actual=await page.evaluate(()=>scrollY);
  if(top===1000)await page.addStyleTag({content:'header[class*="public-frame"]{visibility:hidden!important}'});
  const png=await page.screenshot();
  const length=Math.min(1000,height-top);
  tiles.push({input:await sharp(png).extract({left:0,top:top-actual,width:390,height:length}).png().toBuffer(),top,left:0});
 }
 await sharp({create:{width:390,height,channels:4,background:'#080a0e'}}).composite(tiles).png().toFile(out+'/390-full.png');
 await sharp(out+'/390-full.png').extract({left:0,top:Math.max(0,height-1800),width:390,height:Math.min(1800,height)}).png().toFile(out+'/390-full-ending.png');
 await writeFile(out+'/full-capture-receipt.json',JSON.stringify({width:390,height,tiles:tiles.length,method:'Settled viewport tiles; sticky header once; no layout/content modifications',lastText:await page.locator('footer').textContent()},null,2));
 console.log(JSON.stringify({height,tiles:tiles.length}));
}finally{await browser.close();}
