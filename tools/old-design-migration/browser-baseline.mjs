import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {chromium} from '@playwright/test';
import {neon} from '@neondatabase/serverless';
import {assertLocalConfig} from './guard.mjs';
import {candidateFingerprint} from './candidate-fingerprint.mjs';

const output='test-results/old-design-migration',origin='http://127.0.0.1:4199';
const label=process.argv[2]||'baseline';
assert.match(label,/^[a-z0-9-]{1,30}$/);
const qa=parseEnv(readFileSync(output+'/.env.qa','utf8'));assertLocalConfig(qa);
assert.equal(globalThis.__rivyaMigrationLocalSql,true);
const sql=neon(qa.DATABASE_URL);
const html=await(await fetch(origin+'/studio/login')).text(),form=new FormData();
for(const tag of html.matchAll(/<input\b[^>]*>/g)){
  const attrs=Object.fromEntries([...tag[0].matchAll(/([\w$:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2].replace(/&quot;/g,'"').replace(/&amp;/g,'&')]));
  if(attrs.name?.startsWith('$ACTION'))form.set(attrs.name,attrs.value||'');
}
assert.ok([...form.keys()].length);form.set('id',qa.STUDIO_ADMIN_ID);form.set('password',qa.STUDIO_ADMIN_PASSWORD);
const login=await fetch(origin+'/studio/login',{method:'POST',headers:{Origin:origin},body:form,redirect:'manual'});
const cookies=login.headers.getSetCookie().map(c=>c.split(';')[0]);
const token=cookies.find(c=>c.startsWith('__Host-rivya-studio='))?.split('=')[1];assert.ok(token,'Local Studio login required');
assert.equal(Number((await sql`SELECT count(*) AS count FROM rivya_studio_sessions WHERE token_hash=${createHash('sha256').update(token).digest('hex')} AND expires_at>now()`)[0].count),1,'Browser session belongs to migration QA');
const browser=await chromium.launch({executablePath:process.env.RIVYA_BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={at:new Date().toISOString(),source:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),environment:'Compiled local application, dedicated loopback database, current public source fixtures; no production record copies',profile:'1440x1000 desktop and 390x844 touch emulation, DPR1, reduced motion; no CPU/network throttle; cold and warm browser navigation, server cache may be warm',humanScreenReader:false,physicalDevice:false,fieldPerformance:false,screenshots:[],samples:[],keyboard:[],errors:[]};
report.candidate=candidateFingerprint();
mkdirSync(output+'/screenshots',{recursive:true});
try {
  for(const width of [1440,390]){
    const context=await browser.newContext({viewport:{width,height:width===390?844:1000},isMobile:width===390,hasTouch:width===390,reducedMotion:'reduce'});
    await context.addCookies(cookies.map(c=>{const i=c.indexOf('=');return {name:c.slice(0,i),value:c.slice(i+1),url:origin.replace('http:','https:'),secure:true,httpOnly:true,sameSite:'Lax'};}));
    const page=await context.newPage();page.on('pageerror',()=>report.errors.push({width,type:'pageerror'}));
    await page.addInitScript(()=>{
      window.migrationMetrics={lcp:0,cls:0};
      new PerformanceObserver(list=>{for(const e of list.getEntries())window.migrationMetrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
      let start=0,last=0,total=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput){if(e.startTime-last>1000||e.startTime-start>5000){start=e.startTime;total=0;}last=e.startTime;total+=e.value;window.migrationMetrics.cls=Math.max(window.migrationMetrics.cls,total);}}).observe({type:'layout-shift',buffered:true});
    });
    const cdp=await context.newCDPSession(page);await cdp.send('Network.enable');
    for(const route of ['/','/process','/journal','/studio','/studio/content']){
      await cdp.send('Network.clearBrowserCache');
      for(const cache of ['cold','warm']){
        const response=await page.goto(origin+route,{waitUntil:'networkidle',timeout:60000});
        assert.equal(response.status(),200,route);assert.equal(new URL(page.url()).pathname,route,'Do not measure an auth redirect');
        await page.evaluate(()=>document.fonts.ready);
        if(route==='/studio/content')await page.getByRole('heading',{name:'Words with purpose.',exact:true}).waitFor();
        const measurement=await page.evaluate(()=>{const n=performance.getEntriesByType('navigation')[0];return {...window.migrationMetrics,ttfb:n.responseStart,load:n.loadEventEnd,overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('h1').length};});
        report.samples.push({route,width,cache,...measurement});
        if(cache==='cold'){
          const path=`screenshots/${label==='baseline'?'local':label}-${route==='/'?'home':route.slice(1).replaceAll('/','-')}-${width}.png`;
          await page.screenshot({path:output+'/'+path,fullPage:false});report.screenshots.push({route,width,path,scope:'first viewport; local source fixtures'});
        }
      }
      if(route==='/'||route==='/studio'){
        const menu=page.getByRole('button',{name:route.startsWith('/studio')?'Open Studio navigation':'Open navigation',exact:true});
        if(width===390){await menu.focus();await page.keyboard.press('Enter');await page.locator('dialog[open]').waitFor();await page.keyboard.press('Tab');const contained=await page.evaluate(()=>!!document.activeElement?.closest('dialog[open]'));await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);assert.equal(await menu.evaluate(el=>el===document.activeElement),true);report.keyboard.push({route,width,openedWithKeyboard:true,focusContained:contained,escapeClosed:true,focusReturned:true});assert.ok(contained);}
        else if(route==='/'){const search=page.getByRole('button',{name:'Search pieces',exact:true});await search.focus();await page.keyboard.press('Enter');await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');assert.equal(await search.evaluate(el=>el===document.activeElement),true);report.keyboard.push({route,width,searchOpened:true,escapeClosed:true,focusReturned:true});}
      }
    }
    await context.close();
  }
}finally{await browser.close();writeFileSync(output+'/'+(label==='baseline'?'browser-baseline':label+'-browser')+'.json',JSON.stringify(report,null,2));}
assert.equal(report.errors.length,0,'Local baseline has browser errors');
console.log(JSON.stringify({screenshots:report.screenshots.length,samples:report.samples.length,keyboard:report.keyboard.length,overflows:report.samples.filter(s=>s.overflow).length,browserErrors:report.errors.length}));
