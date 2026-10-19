import test from 'node:test';
import assert from 'node:assert/strict';
import {translationOverviewEntry} from '../src/lib/translation-overview.ts';
import {translationFields,translationRevision,translationStatus} from '../src/lib/translation-review.ts';

const document=()=>({id:'qa:translation',kind:'article',route:'/journal/qa',title:'A room',eyebrow:'Materials',description:'A space for a piece.',sections:[{id:'space',heading:'Space',paragraphs:['Leave room to move.']}]});
function translated(state,locale){
 const d=document();
 if(state==='missing')return d;
 const fields=Object.fromEntries(translationFields(d).map(f=>[f.path,(locale==='hi'?'हिन्दी ':'ગુજરાતી ')+f.source]));
 d.translations={[locale]:{fields}};
 if(['reviewed','stale'].includes(state))d.translations[locale].reviewedRevision=translationRevision(d,fields);
 if(state==='incomplete')delete fields['sections.0.paragraphs.0'];
 if(state==='stale')d.title='An updated room';
 return d;
}
for(const locale of ['hi','gu'])for(const state of ['missing','incomplete','needs review','reviewed','stale']){
 test(`${locale}: overview retains ${state} counts and independent published review`,()=>{
  const source={document:translated(state,locale),published:translated('reviewed',locale),visible:true,version:7};
  const before=JSON.stringify(source),summary=translationOverviewEntry(source);
  assert.equal(summary.reviews[locale].draft.state,state);
  assert.deepEqual(summary.reviews[locale].draft,translationStatus(source.document,locale));
  assert.equal(summary.reviews[locale].published,'reviewed');
  assert.equal(summary.reviews[locale==='hi'?'gu':'hi'].draft.state,'missing');
  assert.equal(summary.version,7);
  assert.equal(JSON.stringify(source),before);
 });
}
test('hidden or absent publications never appear as live reviewed translations',()=>{
 const source={document:document(),published:translated('reviewed','hi'),visible:false,version:2};
 assert.equal(translationOverviewEntry(source).reviews.hi.published,null);
 assert.equal(translationOverviewEntry({...source,published:null,visible:true}).reviews.gu.published,null);
});
test('overview exports only destination metadata and review counts, with no document or captured content',()=>{
 const d=translated('reviewed','gu');
 d.evidence={privateNote:'PRIVATE_EVIDENCE'};
 d.pageSnapshot={text:'CAPTURED_CONTENT'.repeat(10000)};
 const summary=translationOverviewEntry({document:d,published:d,visible:true,version:1});
 assert.deepEqual(Object.keys(summary).sort(),['id','reviews','route','title','version']);
 assert.deepEqual(Object.keys(summary.reviews).sort(),['gu','hi']);
 for(const review of Object.values(summary.reviews)){
  assert.deepEqual(Object.keys(review).sort(),['draft','published']);
  assert.deepEqual(Object.keys(review.draft).sort(),['missing','state','total']);
 }
 const json=JSON.stringify(summary);
 assert.ok(!json.includes('PRIVATE_EVIDENCE')&&!json.includes('CAPTURED_CONTENT')&&!json.includes('ગુજરાતી'));
 assert.equal(summary.title,d.title);assert.equal(summary.route,d.route);assert.equal(summary.id,d.id);
});
