import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {chromium} from '@playwright/test';
import {assertLocalConfig} from './guard.mjs';
import {candidateFingerprint} from './candidate-fingerprint.mjs';
const output='test-results/old-design-migration',origin='http://127.0.0.1:4199';
const qa=parseEnv(readFileSync(output+'/.env.qa','utf8'));assertLocalConfig(qa);
assert.equal(globalThis.__rivyaMigrationLocalSql,true);
const html=await(await fetch(origin+'/studio/login')).text(),form=new FormData();
for(const tag of html.matchAll(/<input\b[^>]*>/g)){
 const attrs=Object.fromEntries([...tag[0].matchAll(/([\w$:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2].replace(/&quot;/g,'"').replace(/&amp;/g,'&')]));
 if(attrs.name?.startsWith('$ACTION'))form.set(attrs.name,attrs.value||'');
}
assert.ok([...form.keys()].length);form.set('id',qa.STUDIO_ADMIN_ID);form.set('password',qa.STUDIO_ADMIN_PASSWORD);
const login=await fetch(origin+'/studio/login',{method:'POST',headers:{Origin:origin},body:form,redirect:'manual'});
const cookies=login.headers.getSetCookie().map(c=>c.split(';')[0]);assert.ok(cookies.some(c=>c.startsWith('__Host-rivya-studio=')));
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={at:new Date().toISOString(),scope:'Local compiled frames; source fixtures only',human:false,physicalDevice:false,checks:[],errors:[]};
report.candidate=candidateFingerprint();
const check=(name,details={})=>report.checks.push({name,passed:true,...details});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 await context.addCookies(cookies.map(c=>{const i=c.indexOf('=');return {name:c.slice(0,i),value:c.slice(i+1),url:origin.replace('http:','https:'),secure:true,httpOnly:true,sameSite:'Lax'};}));
 const page=await context.newPage();page.on('pageerror',error=>report.errors.push({type:'pageerror',message:error.message.slice(0,180)}));
 await page.goto(origin+'/studio',{waitUntil:'networkidle'});
 const sidebar=page.getByRole('navigation',{name:'Studio navigation',exact:true});
 for(const group of ['Today','Catalogue','Content','Editorial','Settings'])assert.equal(await sidebar.getByText(group,{exact:true}).count(),1);
 assert.equal(await sidebar.getByRole('link').count(),16);check('Five groups contain exactly the 16 supported current destinations');
 assert.equal(await sidebar.getByRole('link',{name:/scraper|catalog fill|subscribers/i}).count(),0);check('Unsupported and excluded destinations are not active links');
 await page.getByRole('button',{name:'Collapse Studio sidebar',exact:true}).click();
 await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.locator('[data-collapsed=true]').count(),1);
 await page.goto(origin+'/studio/content',{waitUntil:'networkidle'});assert.equal(await page.locator('[data-collapsed=true]').count(),1);
 check('Sidebar preference survives reload and module navigation with matching server markup');
 await page.getByRole('button',{name:'Expand Studio sidebar',exact:true}).click();
 await page.getByRole('button',{name:'Find a Studio page',exact:true}).click();
 const search=page.getByRole('searchbox',{name:'Page name'});await search.fill('website content');
 assert.ok(await page.getByRole('navigation',{name:'Matching Studio pages'}).getByRole('link',{name:/Content health/}).count());
 await page.keyboard.press('Escape');check('Former group search terms still locate the same permitted page');
 await page.goto(origin+'/',{waitUntil:'networkidle'});
 const rail=page.getByRole('navigation',{name:'On this page'}).filter({has:page.locator('a[title]')});
 assert.equal(await rail.count(),1);
 const railLinks=rail.getByRole('link');assert.ok(await railLinks.count()>1);
 for(const link of await railLinks.all()){const href=await link.getAttribute('href');assert.equal(await page.locator(href).count(),1);}
 const first=railLinks.first();await first.focus();await page.keyboard.press('Enter');assert.notEqual(new URL(page.url()).hash,'');
 check('Section rail contains only existing sections and supports keyboard links');
 const phone=await page.locator('footer a[href^="tel:"]').getAttribute('href');assert.equal(phone.replaceAll(' ',''),'tel:+918320404132');
 const email=await page.locator('footer a[href^="mailto:"]').getAttribute('href');assert.equal(email,'mailto:rivyalivingart2.0@gmail.com');
 check('Current phone and email remain in footer');
 for(const width of [320,390,800,1440]){
  await page.setViewportSize({width,height:width<700?844:1000});
  for(const route of ['/','/studio','/studio/content','/studio/media']){
   await page.goto(origin+route,{waitUntil:'networkidle'});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,route+' at '+width);
   assert.equal(await page.locator('h1').count(),1);
   if(width===390&&route==='/studio/content'){
    await page.evaluate(()=>document.fonts.ready);
    const brand=page.locator('header a[href="/studio"] strong');
    assert.equal(await brand.isVisible(),true);
    await page.screenshot({path:output+'/screenshots/m2-mobile-frame-review.png'});
   }
   check('Responsive frame',{route,width});
  }
 }
 await context.close();
}finally{await browser.close();writeFileSync(output+'/m2-frames.json',JSON.stringify(report,null,2)+'\n');}
assert.equal(report.errors.length,0);console.log(JSON.stringify({checks:report.checks.length,errors:report.errors.length}));
