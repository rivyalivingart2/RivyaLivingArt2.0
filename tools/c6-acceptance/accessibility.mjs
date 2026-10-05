import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {login,launch,addSession,origin,record,modules,sql,fingerprint,existingRows,preserve} from './common.mjs';
const require=createRequire(import.meta.url),name=process.argv[2]||'baseline';
const protectedBefore=await fingerprint(),before=await existingRows();
const article=(await sql`SELECT route FROM rivya_content WHERE visible AND kind='article' AND published IS NOT NULL ORDER BY content_key LIMIT 1`)[0]?.route;
const routes=['/','/collectible-design','/memory-art','/personal-art','/search','/saved-pieces','/pieces/river-channel','/pieces/vow-framed-varmala-keepsake','/pieces/botanical-resin-pendant','/pieces/river-channel/customize','/commission','/commission/customize','/preserve','/personalize','/our-story','/process','/materials-care','/architects','/portfolio','/journal',article,'/faq','/contact','/imprint','/privacy','/terms','/shipping-delivery','/returns-cancellations','/accessibility','/inquiry/received','/c6-unavailable-page','/studio/login',...modules.map(m=>'/studio'+(m?'/'+m:''))].filter(Boolean);
const cookie=await login(),{browser,page,context}=await launch(cookie,{reducedMotion:'reduce'}),samples=[],errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{for(const route of routes){
 if(route==='/studio/login')await context.clearCookies();if(route==='/studio')await addSession(context,cookie);
 await page.setViewportSize({width:1440,height:1000});const response=await page.goto(origin+route,{waitUntil:'networkidle',timeout:60000});await page.evaluate(()=>document.fonts.ready);
 assert.equal(new URL(page.url()).pathname,route,'Requested screen must render, not a redirect to sign-in');
 if(route.startsWith('/studio')&&route!=='/studio/login')await page.getByRole('button',{name:/Find a Studio page/}).waitFor();
 await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
 const checks=[];for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:1000});
  const result=await page.evaluate(async()=>{const axe=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:axe.incomplete.map(v=>({id:v.id,count:v.nodes.length})),passes:axe.passes.length,overflow:document.documentElement.scrollWidth>innerWidth+1,activeAnimations:document.getAnimations().filter(a=>a.playState==='running').length,missingImageNames:[...document.images].filter(i=>!i.hasAttribute('alt')).length};});
  checks.push({width,...result});
 }
 samples.push({route,status:response.status(),finalPath:new URL(page.url()).pathname,checks});console.log(JSON.stringify({route,status:response.status(),violations:[...new Set(checks.flatMap(c=>c.violations.map(v=>v.id)))],overflow:checks.filter(c=>c.overflow).map(c=>c.width)}));
}}finally{await browser.close();await preserve(before,protectedBefore);record('accessibility-'+name,{at:new Date().toISOString(),scope:'Compiled isolated QA, Chrome axe WCAG2.2 tags at 1440/390/320 CSS px and reduced motion; not human screen-reader or physical-device testing.',axeVersion:require('axe-core/package.json').version,protectedRecordsUnchanged:true,complete:samples.length===routes.length,samples,errors});}
assert.ok(!errors.length&&samples.every(s=>s.checks.every(c=>!c.violations.length&&!c.overflow&&!c.activeAnimations&&!c.missingImageNames)),'Accessibility, reduced-motion and reflow matrix');
