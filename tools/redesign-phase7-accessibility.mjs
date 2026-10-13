import {readFile,writeFile} from 'node:fs/promises';
import {localBrowser,origin} from './redesign-phase7-session.mjs';
const {browser,context}=await localBrowser(),axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const retry=process.argv[2]==='retry-categories';
const prior=retry?JSON.parse(await readFile('output/redesign-phase7/accessibility.json','utf8')):null;
const report={scope:'axe WCAG A/AA automated checks in Chromium; this is not screen-reader, physical-device or full conformance certification',pages:prior?.pages||[],errors:[],initialNavigationFailures:prior?.errors||[]};
const publicRoutes=['/','/collectible-design','/memory-art','/personal-art','/pieces/amber-veil-wall-panel','/commission','/commission/customize','/search','/saved-pieces','/our-story','/process','/architects','/materials-care','/journal','/portfolio','/testimonials','/faq','/contact','/privacy','/terms','/shipping-delivery','/returns-cancellations','/accessibility','/imprint'];
const studioRoutes=JSON.parse(await readFile('docs/redesign/modern-design-2026-10-13/studio-coverage.json','utf8')).map(r=>r.route);
try{const page=await context.newPage();for(const [width,routes]of retry?[[1440,['/studio/categories']]]:[[1440,[...publicRoutes,...studioRoutes]],[390,['/','/collectible-design','/commission/customize','/journal','/privacy','/studio/products','/studio/inquiries','/studio/staff','/studio/settings','/studio/login']]]){
 await page.setViewportSize({width,height:width===390?844:1000});for(const route of routes){try{
  await page.goto(origin+route,{waitUntil:'domcontentloaded'});await page.waitForLoadState('networkidle',{timeout:5000}).catch(()=>{});await page.locator('h1').first().waitFor();await page.evaluate(()=>document.fonts.ready);await page.addScriptTag({content:axe});
  const result=await page.evaluate(async()=>{const result=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return {violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,helpUrl:v.helpUrl,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(v=>({id:v.id,count:v.nodes.length})),passes:result.passes.length};});
  report.pages.push({width,route,...result});
 }catch(error){report.errors.push({width,route,error:error.message});}}
 }}finally{await browser.close();await writeFile('output/redesign-phase7/accessibility.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({pages:report.pages.length,violations:report.pages.flatMap(p=>p.violations.map(v=>({route:p.route,width:p.width,id:v.id,impact:v.impact,nodes:v.nodes.length}))),errors:report.errors}));
