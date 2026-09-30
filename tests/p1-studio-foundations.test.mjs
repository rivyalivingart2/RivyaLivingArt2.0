import {test} from 'node:test';
import assert from 'node:assert/strict';
import {studioModules,studioModule,studioModuleHref,studioRoute} from '../src/lib/studio-modules.ts';
import {studioRecordHref,studioRecordTarget} from '../src/lib/studio-record-links.ts';
import {contentHealthRows,draftState,publicationState} from '../src/lib/content-health.ts';
import {businessDatePreset} from '../src/lib/business-time.ts';
import {baselineContent,validContent} from '../src/lib/content-model.ts';
import {baselineProducts} from '../src/lib/shop-model.ts';
import {approvedPublicMedia} from '../src/lib/public-media.ts';

test('every sidebar destination and supported alias resolves uniquely, including Content health',()=>{
 const segments=new Set();
 for(const entry of studioModules){
  assert.equal(studioModule(entry.segment),entry);
  assert.equal(studioModuleHref(entry),'/studio'+(entry.segment?'/'+entry.segment:''));
  for(const segment of [entry.segment,...entry.aliases]){
   assert.equal(segments.has(segment),false,segment);segments.add(segment);
   assert.equal(studioRoute([segment]),entry);
  }
 }
 assert.equal(studioRoute(['content-health']).key,'content-health');
 assert.equal(studioRoute(['navigation']).adminOnly,true);
 assert.equal(studioRoute(['content-health']).adminOnly,false);
 for(const path of [['imports'],['scraper'],['missing'],['products','wrong-record'],['content-health','extra'],[]])assert.equal(studioRoute(path),undefined);
});
test('record links round-trip punctuation, Unicode and media paths without changing identity',()=>{
 for(const [editor,record,field,tab] of [['content','page:imprint','description','content'],['products','DP099','story','details'],['products','DP001','image','images'],['media','/media/wood & resin #1? % नमस्ते.webp','alt','metadata']]){
  const url=new URL(studioRecordHref(editor,record,field),'https://example.test');
  assert.equal(url.pathname,'/studio/'+editor);
  assert.deepEqual(studioRecordTarget(editor,url.searchParams),{record,field,tab});
 }
});
test('tampered tabs and fields stay within their editor; empty or overlong identifiers fail closed',()=>{
 assert.deepEqual(studioRecordTarget('products',new URLSearchParams({record:'DP099',field:'story',tab:'history'})),{record:'DP099',field:'story',tab:'details'});
 assert.deepEqual(studioRecordTarget('content',new URLSearchParams({record:'page:imprint',field:'__proto__',tab:'evil'})),{record:'page:imprint',field:'title',tab:'content'});
 for(const record of ['', 'x'.repeat(1025),'bad\nrecord'])assert.equal(studioRecordTarget('media',new URLSearchParams({record})),null);
});
test('readiness never implies publication; hidden and source candidates remain distinct',()=>{
 const document=baselineContent.find(d=>d.id==='page:imprint');
 const rows=contentHealthRows([
  {document,published:null,visible:false,version:0},
  {document:{...document,id:'hidden'},published:{...document,id:'hidden'},visible:false,version:3},
  {document:{...document,id:'published'},published:{...document,id:'published'},visible:true,version:2},
 ],[],[]);
 assert.equal(rows[0].readiness,'No issues flagged');
 assert.equal(rows[0].publication,'Unpublished');assert.equal(rows[0].draft,'Source candidate');
 assert.equal(rows[1].publication,'Hidden');assert.equal(rows[1].draft,'Aligned');
 assert.equal(rows[2].publication,'Published');
 assert.equal(publicationState(null,true),'Unpublished');
});
test('draft comparison ignores object order, preserves array order and detects unpublished saved work',()=>{
 assert.equal(draftState({a:1,b:2},{b:2,a:1},2),'Aligned');
 assert.equal(draftState({items:['a','b']},{items:['b','a']},2),'Changes pending');
 assert.equal(draftState({a:1},null,1),'Unpublished draft');
});
test('health flags missing copy and opens the exact affected field without altering records',()=>{
 const product={...baselineProducts[0],story:''};
 const media={...approvedPublicMedia[0],alt:''};
 const input=[{product,published:baselineProducts[0],visible:true,version:2,hasDraft:true}];
 const original=JSON.stringify(input);
 const rows=contentHealthRows([],input,[{media,published:null,version:1}]);
 assert.equal(rows[0].readiness,'Needs review');assert.equal(rows[0].draft,'Changes pending');
 assert.equal(new URL(rows[0].href,'https://example.test').searchParams.get('field'),'story');
 assert.equal(new URL(rows[1].href,'https://example.test').searchParams.get('record'),media.path);
 assert.equal(rows[1].publication,'Unpublished');
 assert.equal(JSON.stringify(input),original);
});
test('editorial media without product associations is not a broken product record',()=>{
 const media={...approvedPublicMedia[0],products:[]};
 const [row]=contentHealthRows([],[],[{media,published:media,version:1}]);
 assert.equal(row.readiness,'No issues flagged');assert.match(row.detail,/editorial media/);
});
test('IST presets include today, crossing midnight, leap day and year boundaries correctly',()=>{
 assert.deepEqual(businessDatePreset(1,'2026-09-30T18:29:59.999Z'),{from:'2026-09-30',to:'2026-09-30'});
 assert.deepEqual(businessDatePreset(1,'2026-09-30T18:30:00.000Z'),{from:'2026-10-01',to:'2026-10-01'});
 assert.deepEqual(businessDatePreset(7,'2026-12-31T18:30:00Z'),{from:'2026-12-26',to:'2027-01-01'});
 assert.deepEqual(businessDatePreset(30,'2024-02-29T18:30:00Z'),{from:'2024-02-01',to:'2024-03-01'});
 assert.throws(()=>businessDatePreset(0),RangeError);
 assert.throws(()=>businessDatePreset(1,'invalid'),RangeError);
});
test('Imprint remains one valid source candidate with owner-confirmed new-site contacts',()=>{
 const entries=baselineContent.filter(d=>d.route==='/imprint');assert.equal(entries.length,1);
 const document=entries[0];assert.equal(document.id,'page:imprint');assert.equal(validContent(document,document),true);
 const text=JSON.stringify(document);assert.match(text,/\+91 8320404132/);assert.match(text,/rivyalivingart2\.0@gmail\.com/);
 assert.doesNotMatch(text,/7096036250|gondaliyabhavya70960|\\\\n/);
});
