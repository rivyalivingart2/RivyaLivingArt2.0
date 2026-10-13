import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {localBrowser,origin} from './old-design-migration/local-browser.mjs';
import {inEditorialArea} from '../src/lib/editorial-workspaces.ts';
const {browser,context,api}=await localBrowser(),out='output/playwright/redesign-phase5',report={checks:[],captures:[],scope:'Read-only child editors, saved previews and narrow layouts'};
const check=(name,value)=>{assert.ok(value,name);report.checks.push(name);};
try{const rows=(await api('/api/studio/content?view=editor')).entries;for(const width of [1440,390]){
const page=await context.newPage();await page.setViewportSize({width,height:width===390?844:1000});
for(const area of ['portfolio','testimonials','faqs','pages','landing-pages']){const entry=rows.find(e=>inEditorialArea(area,e.document)&&e.version>0&&!e.document.id.startsWith('page:'));assert.ok(entry,'Existing QA record for '+area);await page.goto(origin+'/studio/'+area+'?record='+encodeURIComponent(entry.document.id),{waitUntil:'networkidle'});const editor=page.locator('[data-studio-part=editor]').first();await editor.waitFor();await editor.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,e.getBoundingClientRect().top+scrollY-24);});await page.waitForTimeout(350);check(width+' '+area+' exact selected record',await page.locator('[data-studio-part=recordStatus]').textContent().then(t=>t.includes(entry.document.id)));check(width+' '+area+' no overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));let file=width+'-'+area+'-editor.png';await page.screenshot({path:out+'/'+file});report.captures.push(file);
const details=editor.locator('details').filter({has:page.locator('summary')});const labels=await details.locator('summary').allTextContents();report.checks.push(width+' '+area+' editor disclosures: '+labels.slice(0,6).join(' | '));
}
await page.close();}
for(const width of [768,320]){const p=await context.newPage();await p.setViewportSize({width,height:width===320?844:1000});for(const area of ['products','journal','sections']){await p.goto(origin+'/studio/'+area,{waitUntil:'domcontentloaded'});await p.waitForLoadState('networkidle',{timeout:6000}).catch(()=>{});await p.locator('main h1').first().waitFor();check(width+' '+area+' captured without overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));const file=width+'-'+area+'.png';await p.screenshot({path:out+'/'+file});report.captures.push(file);}await p.close();}
}finally{await browser.close();await writeFile(out+'/coverage.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,captures:report.captures.length}));
