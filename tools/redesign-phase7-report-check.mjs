import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}),checks=[];
const check=(name,pass)=>{assert.ok(pass,name);checks.push(name);};
try{const p=await browser.newPage();for(const width of [1440,390]){await p.setViewportSize({width,height:900});const response=await p.goto('http://127.0.0.1:4184/review',{waitUntil:'networkidle'});check(width+' report opens',response.status()===200);check(width+' report images decode',await p.locator('img').evaluateAll(async images=>{await Promise.all(images.map(i=>i.decode()));return images.every(i=>i.naturalWidth>0);}));check(width+' no document overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));check(width+' release hold visible',await p.locator('body').textContent().then(t=>t.includes('Nothing has been pushed or released')));}
 for(const path of ['/report.md','/verification.json','/release-checklist.md'])check(path+' resolves',(await fetch('http://127.0.0.1:4184'+path)).status===200);
 check('Report server rejects mutation',(await fetch('http://127.0.0.1:4184/review',{method:'POST'})).status===405);
}finally{await browser.close();await writeFile('output/redesign-phase7/report-check.json',JSON.stringify({checks},null,2)+'\n');}console.log(JSON.stringify({checks:checks.length}));
