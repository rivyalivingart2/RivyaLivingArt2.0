import {writeFileSync,mkdirSync} from 'node:fs';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const output='test-results/old-design-migration';mkdirSync(output+'/screenshots',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.RIVYA_BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={at:new Date().toISOString(),scope:'Anonymous read-only first-viewport samples. Different approved content and media are intentional variance, not permission to copy old facts. Emulation only.',rows:[]};
try{
  for(const width of [1440,390]){
    const context=await browser.newContext({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce',isMobile:width===390,hasTouch:width===390});
    const page=await context.newPage();
    for(const [label,origin,source] of [['old','https://oldwebsite-one.vercel.app','2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6'],['current-live','https://www.rivyalivingart.com','afba59f6adf6d3cdcc168f0d784d093a4cb4a294']]){
      for(const route of ['/','/process',label==='old'?'/blog':'/journal']){
        const response=await page.goto(origin+route,{waitUntil:'networkidle',timeout:60000});assert.equal(response.status(),200);
        const path=`screenshots/${label}-${route==='/'?'home':route.slice(1)}-${width}.png`;
        await page.screenshot({path:output+'/'+path,fullPage:false});
        report.rows.push({label,source,route,width,path,status:response.status(),url:new URL(page.url()).origin+new URL(page.url()).pathname,heading:await page.locator('h1').allTextContents(),viewportOnly:true});
      }
    }
    await context.close();
  }
}finally{await browser.close();writeFileSync(output+'/reference-baseline.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({readOnly:true,referenceSamples:report.rows.length}));
