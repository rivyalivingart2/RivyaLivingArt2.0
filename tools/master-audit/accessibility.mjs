import {mkdir,writeFile} from 'node:fs/promises';
import {localBrowser,origin} from '../old-design-migration/local-browser.mjs';
const out='test-results/rivya-master-audit';await mkdir(out,{recursive:true});
const {browser,context,api}=await localBrowser();
const report={at:new Date().toISOString(),browser:browser.version(),scope:'Automated WCAG 2.2 AA-oriented DOM checks, not native assistive certification',rows:[],errors:[],blockedWrites:[]};
await context.route('**/api/studio/**',async route=>{if(!['GET','HEAD'].includes(route.request().method())){report.blockedWrites.push(new URL(route.request().url()).pathname);await route.abort();}else await route.continue();});
const entries=(await api('/api/studio/content?view=editor')).entries;
const routes=['/','/collectible-design','/memory-art','/personal-art','/pieces/river-channel','/pieces/river-channel/customize','/search','/saved-pieces','/commission','/commission/customize','/inquiry/received','/our-story','/process','/materials-care','/architects','/journal','/portfolio','/testimonials','/faq','/contact','/privacy','/terms','/accessibility','/imprint','/studio/login','/studio/request-access','/studio/forgot-password','/studio/set-password','/not-a-real-audit-route','/studio','/studio/products','/studio/inquiries','/studio/media','/studio/sections','/studio/journal','/studio/staff','/studio/settings','/studio/translations'];
for(const predicate of [d=>d.kind==='article',d=>d.editorial?.kind==='portfolio',d=>d.editorial?.kind==='testimonial',d=>d.editorial?.kind==='faq',d=>!!d.landing]){const e=entries.find(e=>e.visible&&e.published&&predicate(e.document));if(e)routes.push(e.document.route);}
try{
 const page=await context.newPage();page.setDefaultTimeout(15000);
 for(const width of [1440,390]){await page.setViewportSize({width,height:width===390?844:1000});for(const path of routes){try{
  await page.goto(origin+path,{waitUntil:'load'});await page.locator('h1').first().waitFor();await page.locator('[aria-busy="true"]').first().waitFor({state:'hidden',timeout:20000}).catch(()=>{});await page.evaluate(()=>document.fonts.ready);
  await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
  const result=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return{violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,helpUrl:v.helpUrl,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),passes:r.passes.length};});
  report.rows.push({path,width,...result});
 }catch(e){report.errors.push({path,width,error:e.message.split('\n')[0]});}
 await writeFile(out+'/accessibility.json',JSON.stringify(report,null,2)+'\n');}
 console.log(JSON.stringify({width,rows:report.rows.length,violations:report.rows.reduce((s,r)=>s+r.violations.length,0),errors:report.errors.length}));}
}finally{await browser.close();await writeFile(out+'/accessibility.json',JSON.stringify(report,null,2)+'\n');}
