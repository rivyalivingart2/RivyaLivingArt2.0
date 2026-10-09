import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {writeFileSync} from 'node:fs';
import {localApi,origin} from './local-api.mjs';
import {newEditorialDocument} from '../../src/lib/editorial-workspaces.ts';
import {candidateFingerprint} from './candidate-fingerprint.mjs';
const {api,request}=await localApi(),suffix=randomUUID().slice(0,8),report={at:new Date().toISOString(),candidate:candidateFingerprint(),checks:[],fixtures:[],completed:false};
const check=name=>{report.checks.push({name,passed:true});console.log('Passed: '+name);};
try{
 for(const route of ['/api/studio/content-list','/api/studio/content-register'])assert.equal((await fetch(origin+route)).status,401);
 const first=await api('/api/studio/content-list?area=journal'),second=await api('/api/studio/content-list?area=journal&page=2');assert.equal(first.entries.length,25);assert.ok(second.entries.length);assert.ok(first.entries.every(a=>!second.entries.some(b=>a.document.id===b.document.id)));assert.ok(first.entries.every(e=>e.detailPending&&!e.document.pageSnapshot&&!e.document.review));
 const exact=await api('/api/studio/content?record='+encodeURIComponent(first.entries[0].document.id));assert.equal(exact.entries.length,1);assert.ok(exact.entries[0].document.sections.some(s=>s.paragraphs.length));
 await api('/api/studio/content-list?from=2026-02-30',undefined,400);assert.equal((await api('/api/studio/content-list?journey=Invented')).total,0);
 assert.ok((await api('/api/studio/content-list?area=faqs')).entries.some(e=>e.document.id==='page:faq'));
 check('Authenticated lists paginate 25 compact summaries with stable IDs; details load alone, dates reject invalid values and empty metadata filters stay honest');
 const docs=['journal','portfolio'].map(area=>{const d=newEditorialDocument(area,randomUUID());d.title='M8 isolated '+area+' '+suffix;d.route='/'+(area==='journal'?'journal':'portfolio')+'/m8-qa-'+suffix;d.description='A synthetic local metadata and review check.';d.sections[0].paragraphs=['A labelled engineering fixture; not a production content entry.'];d.discovery={journey:'M8 QA journey',format:'Worksheet',tags:['QA'],context:'Local concept'};d.review={source:'private-source-'+suffix,author:'QA fixture author'};return d;});
 const dry=await api('/api/studio/content-intake',{mode:'dry-run',documents:docs});assert.equal(dry.records.length,2);assert.equal((await api('/api/studio/content-list?q='+suffix)).total,0);
 await api('/api/studio/content-intake',{mode:'create',documents:[{...docs[0],title:'Changed'}],token:dry.token,expires:dry.expires},409);
 await api('/api/studio/content-intake',{mode:'create',documents:docs,token:dry.token,expires:Date.now()-1},409);
 const created=await api('/api/studio/content-intake',{mode:'create',documents:docs,token:dry.token,expires:dry.expires});assert.equal(created.ids.length,2);assert.equal(created.published,0);report.fixtures.push(...created.ids);
 await api('/api/studio/content-intake',{mode:'create',documents:docs,token:dry.token,expires:dry.expires},409);
 for(const doc of docs)assert.equal((await fetch(origin+doc.route)).status,404);
 check('Dry run writes nothing, rejects changed batches, creates only checked new drafts and rejects duplicate retry without modifying existing records');
 const filtered=await api('/api/studio/content-list?journey=M8+QA+journey&source=present&status=draft&q='+suffix);assert.equal(filtered.total,2);assert.ok(!JSON.stringify(filtered).includes('private-source'));
 const pending=await api('/api/studio/content-list?journey=M8+QA+journey&review=needs-native&q='+suffix);assert.equal(pending.total,2);
 for(const d of docs){const saved=(await api('/api/studio/content?record='+encodeURIComponent(d.id))).entries[0];assert.equal(saved.document.review.native,undefined);const published=await api('/api/studio/content',{document:saved.document,version:saved.version,operation:'publish'});assert.equal(published.version,2);const response=await fetch(origin+d.route);assert.equal(response.status,200);assert.ok(!(await response.text()).includes('private-source-'+suffix));}
 check('Source, journey and native-evidence queues reflect saved metadata; publication does not create review evidence or disclose private source notes');
 const duplicate=(await api('/api/studio/content?record='+encodeURIComponent(docs[0].id))).entries[0];duplicate.document.review.duplicateOf=first.entries[0].document.id;const held=await api('/api/studio/content',{document:duplicate.document,version:duplicate.version,operation:'draft'});assert.ok(held.issues.some(issue=>issue.toLowerCase().includes('duplicate')));await api('/api/studio/content',{document:held.document,version:held.version,operation:'publish'},400);assert.equal((await api('/api/studio/content?record='+encodeURIComponent(docs[0].id))).entries[0].publishedVersion,2);check('Possible-duplicate review holds publication and keeps the previous public revision intact; expired intake is rejected');
 const collision={...docs[0],id:'article:'+randomUUID(),route:'/journal/m8-distinct-'+suffix};await api('/api/studio/content-intake',{mode:'dry-run',documents:[collision]},409);
 const register=await api('/api/studio/content-register');assert.equal(register.total,480);assert.equal(register.entries.length,25);assert.equal(register.created,0);for(const kind of ['Journal','Portfolio','Testimonials','FAQs'])assert.equal((await api('/api/studio/content-register?kind='+kind)).total,120);
 const cross=await request('/api/studio/content-intake',{method:'POST',headers:{Origin:'https://unrelated.invalid','Content-Type':'application/json'},body:'{}'});assert.equal(cross.status,403);
 check('Matching-title collision checks, four 120-slot registers and same-origin protection pass; production count stays zero');
 for(const route of ['/journal?journey=M8+QA+journey','/portfolio?classification=concept','/testimonials?classification=fictional','/faq?topic=Useful+questions','/studio/content-register','/studio/journal'])assert.equal((await request(route)).status,200,route);
 report.completed=true;
}finally{writeFileSync('test-results/old-design-migration/m8-contract-check-'+suffix+'.json',JSON.stringify(report,null,2)+'\n');}
