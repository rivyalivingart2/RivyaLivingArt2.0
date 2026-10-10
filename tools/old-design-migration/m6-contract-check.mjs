import assert from 'node:assert/strict';
import {randomBytes,randomUUID} from 'node:crypto';
import {writeFileSync} from 'node:fs';
import {localApi,origin} from './local-api.mjs';
import {candidateFingerprint} from './candidate-fingerprint.mjs';
import {newEditorialDocument,editorialAreas,inEditorialArea} from '../../src/lib/editorial-workspaces.ts';
import {studioModules,studioModuleHref} from '../../src/lib/studio-modules.ts';
import {editorialDocument} from '../../src/lib/page-dependencies.ts';
const {api,request}=await localApi(),suffix=randomUUID().slice(0,8);
const report={at:new Date().toISOString(),candidate:candidateFingerprint(),scope:'M6 loopback HTTP and saved-record lifecycle',completed:false,checks:[],fixtures:[],human:false,physicalDevice:false};
const check=name=>{report.checks.push({name,passed:true});console.log('Passed: '+name);};
const save=(document,version=0,extra={})=>api('/api/studio/content',{document:editorialDocument(document),version,operation:'draft',...extra});
try{
 assert.equal((await fetch(origin+'/api/studio/analytics')).status,401);
 const invalid=await request('/api/studio/analytics?from=2026-02-30&to=2026-03-01');assert.equal(invalid.status,400);
 const identity={id:'m6-editor-'+suffix,password:randomBytes(24).toString('hex')};
 await api('/api/studio/workspace',{action:'staff',login:identity.id,name:'Isolated M6 QA editor',role:'editor',active:true,password:identity.password});
 const editor=await localApi(identity);
 for(const mod of studioModules){const path=studioModuleHref(mod);assert.equal((await request(path)).status,200,path);if(mod.adminOnly)assert.equal((await editor.request(path)).status,404,path);}
 for(const path of ['/studio/scraper','/studio/catalog-fill','/studio/products/unknown/tail'])assert.equal((await request(path)).status,404,path);
 for(const [from,to] of [['/studio/blog/new','/studio/journal?create=1'],['/studio/custom-pages/new','/studio/landing-pages?create=1'],['/studio/products/DP001','/studio/products?record=DP001']]){
  const r=await request(from);assert.equal(r.status,307);assert.equal(r.headers.get('location'),to);
 }
 await editor.api('/api/studio/operations?view=exports',undefined,403);
 check('All 35 current Studio destinations load; admin views enforce role scope, excluded tools stay unavailable and supported child routes resolve exact editors');
 const before=await api('/api/studio/analytics'),id=randomUUID();
 await api('/api/studio/orders',{action:'create',id,client:'Isolated QA fixture',title:'M6 analytics scope check'},201);
 const after=await api('/api/studio/analytics'),assigned=await editor.api('/api/studio/analytics');
 assert.equal(after.scope,'all');assert.equal(after.totals.received,before.totals.received+1);assert.equal(after.totals.manual,before.totals.manual+1);
 assert.equal(after.days.reduce((n,d)=>n+d.count,0),after.totals.received);assert.equal(after.stages.reduce((n,d)=>n+d.count,0),after.totals.received);
 assert.equal(assigned.scope,'assigned');assert.equal(assigned.totals.manual,0);assert.equal(assigned.totals.received,0);assert.ok(!JSON.stringify(after).includes('Isolated QA fixture'));
 check('Analytics returns real date-scoped aggregates, consistent day/stage totals and no customer fields; editors cannot see admin manual records');
 for(const area of editorialAreas){
  const d=newEditorialDocument(area,randomUUID());d.title='M6 local '+area+' '+suffix;d.description='Isolated QA content; this is not a production editorial entry.';
  d.route=d.route.replace('new-','m6-qa-'+suffix+'-');d.sections.forEach(s=>s.paragraphs=['This synthetic record checks the local saved editing workflow.']);
  if(d.editorial?.kind==='faq')d.editorial.policyHref='/terms';
  if(d.landing)d.landing.blocks=[{id:'film',type:'videoStory',enabled:true,heading:'Material study',paragraphs:['Disclosed local QA film.'],film:'resin-pour'}];
  let saved=await save(d);assert.deepEqual(saved.issues,[],area);report.fixtures.push({area,id:d.id,route:d.route});
  assert.equal((await fetch(origin+d.route)).status,404);
  const compact=(await api('/api/studio/content?view=editor')).entries.find(e=>e.document.id===d.id);
  assert.equal(compact.detailPending,true);assert.ok(inEditorialArea(area,compact.document));assert.ok(!compact.document.pageSnapshot);assert.ok(!compact.document.editorial?.evidence);
  const exact=(await api('/api/studio/content?view=editor&record='+encodeURIComponent(d.id))).entries.find(e=>e.document.id===d.id);
  assert.ok(!exact.detailPending);assert.deepEqual(exact.document,saved.document);
  const preview=await request('/studio/preview?'+new URLSearchParams({record:d.id,version:'1'}));assert.equal(preview.status,200);assert.ok((await preview.text()).includes(d.title));
  await editor.api('/api/studio/content',{document:saved.document,version:saved.version,operation:'publish'},403);
  saved=await api('/api/studio/content',{document:saved.document,version:saved.version,operation:'publish'});
  const publicResponse=await fetch(origin+d.route);assert.equal(publicResponse.status,200);assert.ok((await publicResponse.text()).includes(d.title));
  const revised=await save({...saved.document,title:d.title+' amended'},saved.version);
  await api('/api/studio/content',{document:editorialDocument(saved.document),version:saved.version,operation:'draft'},409);
  const history=await api('/api/studio/revisions?'+new URLSearchParams({kind:'content',key:d.id}));
  const restored=await save(history.revisions.find(v=>v.version===1).document,revised.version,{restoredFrom:1});assert.equal(restored.publishedVersion,2);
  assert.ok((await(await fetch(origin+d.route)).text()).includes(d.title));assert.equal(restored.version,4);
 }
 check('All six editorial workspaces preserve compact classification, exact full-record loading, private saved preview, admin-only publication, stale-save protection and draft-only restoration');
 const options=await api('/api/studio/homepage-options');assert.ok(options.entries.some(e=>e.kind==='portfolio'));assert.ok(options.entries.some(e=>e.kind==='testimonial'));assert.ok(options.entries.some(e=>e.kind==='faq'));assert.ok(options.entries.some(e=>e.id.startsWith('page:faq#')));
 assert.ok(!JSON.stringify(options).includes('private-permission'));assert.ok(options.products.length>0);
 check('Landing selectors expose published typed choices and existing FAQ sections without private source evidence');
 const blocked=newEditorialDocument('testimonials',randomUUID());blocked.title='M6 genuine gate '+suffix;blocked.description='No genuine claim can be published without evidence.';blocked.sections[0].paragraphs=['Local negative test.'];blocked.editorial.classification='genuine';
 const saved=await save(blocked);assert.ok(saved.issues.length);await api('/api/studio/content',{document:saved.document,version:1,operation:'publish'},400);
 const cross=await request('/api/studio/content',{method:'POST',headers:{Origin:'https://unrelated.invalid','Content-Type':'application/json'},body:JSON.stringify({document:blocked,version:1,operation:'draft'})});assert.equal(cross.status,403);
 check('Genuine-source and cross-origin publication boundaries remain enforced');
 report.completed=true;
}finally{writeFileSync('test-results/old-design-migration/m6-contract-check-'+suffix+'.json',JSON.stringify(report,null,2)+'\n');}
