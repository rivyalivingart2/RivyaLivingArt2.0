import assert from 'node:assert/strict';
import {randomBytes,randomUUID} from 'node:crypto';
import {writeFileSync} from 'node:fs';
import {localApi,origin} from './local-api.mjs';
import {newEditorialDocument} from '../../src/lib/editorial-workspaces.ts';
import {candidateFingerprint} from './candidate-fingerprint.mjs';
const {api,request}=await localApi(),suffix=randomUUID().slice(0,8),report={at:new Date().toISOString(),candidate:candidateFingerprint(),checks:[],fixtures:[],completed:false};
const check=name=>{report.checks.push({name,passed:true});console.log('Passed: '+name);};
try{
 assert.equal((await fetch(origin+'/api/studio/editorial-order')).status,401);
 const identity={id:'m7-editor-'+suffix,password:randomBytes(24).toString('hex')};
 await api('/api/studio/workspace',{action:'staff',login:identity.id,name:'Isolated M7 QA editor',role:'editor',active:true,password:identity.password});const editor=await localApi(identity);
 const initial=await api('/api/studio/editorial-order');assert.equal(initial.complete,true);
 for(const key of ['archive:journal','archive:portfolio','archive:testimonials','archive:faq','faq:groups','featured:journal','placement:testimonials:archive',initial.scopes.find(s=>s.key.startsWith('related:')).key]){
  const source=await api('/api/studio/editorial-order?scope='+encodeURIComponent(key)),scope=source.scopes.find(s=>s.key===key),ids=scope.mode==='permutation'?[...scope.defaults].reverse():scope.candidates.slice(0,Math.min(2,scope.limit));
  const draft=await api('/api/studio/editorial-order',{scope:key,operation:'draft',version:source.entry.version,ids});
  await api('/api/studio/editorial-order',{scope:key,operation:'draft',version:source.entry.version,ids},409);
  if(scope.mode==='permutation'&&ids.length)await api('/api/studio/editorial-order',{scope:key,operation:'draft',version:draft.entry.version,ids:ids.slice(1)},409);
  const preview=await request('/studio/editorial-order/preview?'+new URLSearchParams({scope:key,version:String(draft.entry.version)}));assert.equal(preview.status,200);const html=await preview.text();assert.ok(!html.includes('sourceStamp'));assert.ok(!html.includes('private-permission'));
  await editor.api('/api/studio/editorial-order',{scope:key,operation:'publish',version:draft.entry.version},403);
  const pub=await api('/api/studio/editorial-order',{scope:key,operation:'publish',version:draft.entry.version});
  const restored=await api('/api/studio/editorial-order',{scope:key,operation:'restore',version:pub.entry.version,restoredFrom:draft.entry.version});assert.equal(restored.entry.publishedVersion,pub.entry.publishedVersion);
 }
 check('All ordering families support exact private previews, complete-scope validation, stale 409, admin publication and draft-only restoration');
 const key='featured:portfolio',before=await api('/api/studio/editorial-order?scope='+key),scope=before.scopes.find(s=>s.key===key);
 const captured=await api('/api/studio/editorial-order',{scope:key,version:before.entry.version,operation:'draft',ids:scope.defaults});
 const d=newEditorialDocument('portfolio',randomUUID());d.title='M7 isolated concept '+suffix;d.route='/portfolio/m7-qa-'+suffix;d.description='Synthetic local ordering dependency test.';d.sections[0].paragraphs=['A labelled local concept for engineering verification.'];
 const draft=await api('/api/studio/content',{document:d,version:0,operation:'draft'});await api('/api/studio/content',{document:draft.document,version:draft.version,operation:'publish'});report.fixtures.push(d.id);
 await api('/api/studio/editorial-order',{scope:key,version:captured.entry.version,operation:'publish'},409);
 check('A newly published record invalidates the old saved scope before publication');
 const order=await api('/api/studio/orders',{action:'create',requestId:randomUUID(),client:'M7 synthetic QA',title:'Local saved card '+suffix},201),id=order.order.id;report.fixtures.push(id);
 const card=await request('/studio/inquiries/'+id+'/card');assert.equal(card.status,200);assert.match(card.headers.get('cache-control'),/no-store/);const cardText=await card.text();assert.ok(cardText.includes('Local saved card '+suffix));assert.ok(cardText.includes('not an invoice'));assert.ok(!cardText.includes('certificate of authenticity</'));
 assert.equal((await editor.request('/studio/inquiries/'+id+'/card')).status,404);
 const denied=await fetch(origin+'/studio/inquiries/'+id+'/card',{redirect:'manual'});assert.equal(denied.status,307);
 const link=await request('/studio/inquiries/'+id);assert.equal(link.status,307);assert.equal(link.headers.get('location'),'/studio/inquiries?record='+id);
 check('Saved cards enforce sign-in and assignment scope, no-store, exact saved facts and supported record links');
 const cross=await request('/api/studio/editorial-order',{method:'POST',headers:{Origin:'https://unrelated.invalid','Content-Type':'application/json'},body:'{}'});assert.equal(cross.status,403);
 for(const route of ['/journal','/portfolio','/testimonials','/faq'])assert.equal((await fetch(origin+route)).status,200);
 check('Publication routes render and cross-origin mutations remain rejected');
 report.completed=true;
}finally{writeFileSync('test-results/old-design-migration/m7-contract-check-'+suffix+'.json',JSON.stringify(report,null,2)+'\n');}
