import {mkdir,writeFile} from 'node:fs/promises';
import {localBrowser,origin} from '../old-design-migration/local-browser.mjs';
const out='test-results/rivya-master-audit';await mkdir(out,{recursive:true});
const {browser,context,api}=await localBrowser();
const report={at:new Date().toISOString(),scope:'Isolated QA, unsaved UI only',writesBlocked:[],findings:[]};
await context.route('**/api/studio/**',async route=>{if(!['GET','HEAD'].includes(route.request().method())){report.writesBlocked.push(new URL(route.request().url()).pathname);await route.abort();}else await route.continue();});
try{
 const page=await context.newPage();
 await page.goto(origin+'/studio/products');
 await page.getByText('Drafts are shared across devices. Only published content appears on the website.',{exact:true}).waitFor();
 const all=page.getByRole('tab',{name:/^All pieces \(/});await all.waitFor();await all.focus();await page.keyboard.press('ArrowRight');
 report.findings.push({id:'STUDIO-01',focused:await page.locator(':focus').innerText(),tabs:await page.getByRole('tab').evaluateAll(els=>els.map(e=>({name:e.textContent,tabIndex:e.tabIndex,controls:e.getAttribute('aria-controls')}))),panels:await page.getByRole('tabpanel').count()});
 await page.screenshot({path:out+'/before-catalogue-filter.png'});
 const entries=(await api('/api/studio/content?view=editor')).entries;
 const entry=entries.find(e=>e.document.kind==='article');
 await page.goto(origin+'/studio/journal?record='+encodeURIComponent(entry.document.id));
 await page.locator('#content-field-title').fill(entry.document.title+' [unsaved local audit]');
 await page.locator('[data-unsaved="true"]').waitFor();
 const dialogs=[];page.on('dialog',async d=>{dialogs.push(d.message());await d.accept();});
 await page.getByRole('link',{name:/Return to filtered records/}).click();
 await page.waitForURL('**/studio/journal');
 report.findings.push({id:'STUDIO-02',confirmations:dialogs.length,messages:dialogs});
 const publicCandidates=entries.filter(e=>e.visible&&e.published).map(e=>({route:e.document.route,kind:e.document.kind,editorial:e.document.editorial?.kind,landing:!!e.document.landing}));
 await writeFile(out+'/local-public-candidates.json',JSON.stringify(publicCandidates,null,2));
 report.status='pass';
}catch(error){report.status='error';report.error=error.message;}
finally{await browser.close();await writeFile(out+'/studio-repro.json',JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report,null,2));
