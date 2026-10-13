import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {writeFile} from 'node:fs/promises';
import {localApi,origin} from './old-design-migration/local-api.mjs';
import {localBrowser} from './old-design-migration/local-browser.mjs';
import {newEditorialDocument} from '../src/lib/editorial-workspaces.ts';
import {editorialDocument} from '../src/lib/page-dependencies.ts';
const {api}=await localApi(),report={checks:[],scope:'One new synthetic FAQ in isolated localhost QA only; existing records never saved',fixture:null};
const check=(name,pass)=>{assert.ok(pass,name);report.checks.push(name);};
const doc=newEditorialDocument('faqs',randomUUID());doc.title='Phase 5 isolated editing check';doc.description='Synthetic local QA record for the approved Studio redesign. Not customer content.';
doc.route='/faq/phase5-qa-'+doc.id.split(':')[1].slice(0,8);doc.sections[0].paragraphs=['This labelled test record verifies draft, preview, publication and conflict handling in the isolated local database.'];doc.editorial.policyHref='/terms';
let saved=await api('/api/studio/content',{document:editorialDocument(doc),version:0,operation:'draft'});report.fixture={id:doc.id,route:doc.route,version:saved.version};await writeFile('output/redesign-phase5/lifecycle.json',JSON.stringify(report,null,2));
check('New synthetic draft saves with no blockers',saved.version===1&&saved.issues.length===0);check('Draft stays unavailable publicly',(await fetch(origin+doc.route)).status===404);
const {browser,context}=await localBrowser();const page=await context.newPage();
try{
 await page.goto(origin+'/studio/faqs?record='+encodeURIComponent(doc.id),{waitUntil:'networkidle'});await page.locator('#content-field-title').fill(doc.title+' revised');await page.getByRole('button',{name:'Save draft',exact:true}).click();await page.getByText('Draft saved. Your public page is unchanged.',{exact:true}).waitFor();
 let entry=(await api('/api/studio/content?record='+encodeURIComponent(doc.id))).entries.find(e=>e.document.id===doc.id);check('Browser Save draft persists the new test record',entry.version===2&&entry.document.title.endsWith('revised'));await page.screenshot({path:'output/playwright/redesign-phase5/1440-qa-draft-saved.png'});
 await api('/api/studio/content',{document:editorialDocument(saved.document),version:1,operation:'draft'},409);check('Stale save is rejected without replacing newer draft',true);
 await page.getByRole('button',{name:'Publish this revision',exact:true}).click();await page.getByText(/Published and verified: anonymous public revision/).waitFor();entry=(await api('/api/studio/content?record='+encodeURIComponent(doc.id))).entries.find(e=>e.document.id===doc.id);check('Browser publishes only the synthetic saved revision',entry.visible&&entry.publishedVersion===3);check('Local anonymous page contains published test title',(await(await fetch(origin+doc.route)).text()).includes(entry.document.title));await page.screenshot({path:'output/playwright/redesign-phase5/1440-qa-published.png'});
 await page.getByRole('button',{name:'Hide public page',exact:true}).click();await page.getByText('Hidden from public pages. The draft is retained.',{exact:true}).waitFor();check('Synthetic publication hidden after verification',(await fetch(origin+doc.route)).status===404);
 entry=(await api('/api/studio/content?record='+encodeURIComponent(doc.id))).entries.find(e=>e.document.id===doc.id);const history=await api('/api/studio/revisions?'+new URLSearchParams({kind:'content',key:doc.id}));check('Draft and publish revisions remain in history',history.revisions.length>=3);
 report.fixture={id:doc.id,route:doc.route,version:entry.version,visible:entry.visible,publishedVersion:entry.publishedVersion};check('Test fixture ends hidden and retained for continuation',!entry.visible);
 await page.goto(origin+'/studio/preview?'+new URLSearchParams({record:doc.id,version:String(entry.version)}),{waitUntil:'networkidle'});check('Saved private preview renders exact revision',await page.locator('[data-saved-content-revision="'+entry.version+'"]').count()===1);await page.screenshot({path:'output/playwright/redesign-phase5/1440-qa-saved-preview.png'});
}finally{await browser.close();await writeFile('output/redesign-phase5/lifecycle.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({checks:report.checks.length,fixture:report.fixture}));
