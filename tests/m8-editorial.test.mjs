import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {randomUUID} from 'node:crypto';
import {validContent} from '../src/lib/content-model.ts';
import {validDiscovery,validEditorialReview,reviewState,reviewRevision} from '../src/lib/editorial-metadata.ts';
import {newEditorialDocument} from '../src/lib/editorial-workspaces.ts';
import {reviewIntake} from '../src/lib/editorial-intake.ts';
import {editorialFilterView} from '../src/lib/editorial-filters.ts';
import {publicEntry} from '../src/lib/landing-dependencies.ts';
const document=()=>({...newEditorialDocument('journal',randomUUID()),title:'New source worksheet',description:'A new source-grounded editorial brief.',sections:[{id:'intro',heading:'A useful question',paragraphs:['Prepare a clear comparison.']}]});
test('metadata is optional and bounded; private review and native evidence never enter public cards',()=>{
 const d=document();assert.ok(validContent(d));assert.ok(validDiscovery({journey:'Memory art',tags:['Notes']}));assert.equal(validDiscovery({rating:5}),false);assert.equal(validDiscovery({tags:['Notes','Notes']}),false);
 d.review={author:'Named reviewer',source:'private-source-location',native:{en:{reviewer:'Actual reader',date:'2026-10-08',evidence:'private-reader-note',revision:reviewRevision(d,'en')}}};
 assert.ok(validEditorialReview(d.review));assert.equal(reviewState(d,'native'),'Evidence recorded');assert.equal(reviewState(d,'author'),'Not performed');assert.ok(!JSON.stringify(publicEntry(d)).includes('private-'));d.title+=' changed';assert.equal(reviewState(d,'native'),'Stale evidence');
 assert.equal(validEditorialReview({native:{en:{reviewer:'',date:'2026-10-08',evidence:'',revision:'a'.repeat(16)}}}),false);
});
test('facets reflect real metadata, preserve unknown combinations as empty and paginate without duplication',()=>{
 const items=Array.from({length:26},(_,i)=>({id:String(i).padStart(2,'0'),title:'Item '+i,topic:i%2?'Notes':'Care',search:'Item '+i,discovery:i%2?{journey:'Memory art'}:undefined,languages:['en']}));
 const a=editorialFilterView(items,new URLSearchParams('topic=Notes&journey=Memory+art'),['topic','journey','language']);assert.equal(a.results.length,13);assert.equal(a.paged.length,12);assert.ok(a.facets.journey.some(v=>v.value==='Unclassified'));
 const b=editorialFilterView(items,new URLSearchParams('topic=Notes&journey=Memory+art&page=2'),['topic','journey','language']);assert.equal(b.paged.length,1);assert.ok(!a.paged.some(i=>i.id===b.paged[0].id));assert.equal(editorialFilterView(items,new URLSearchParams('journey=Invented'),['journey']).results.length,0);
});
test('new draft intake rejects existing identities, routes, normalized titles, captured snapshots and oversized batches',()=>{
 const d=document();assert.deepEqual(reviewIntake([d],[]).issues,[]);
 for(const existing of [{id:d.id,route:'/journal/other',title:'Other'},{id:'other',route:d.route,title:'Other'},{id:'other',route:'/journal/other',title:'New source—worksheet!'}])assert.ok(reviewIntake([d],[existing]).issues.length);
 assert.ok(reviewIntake([{...d,pageSnapshot:{}}],[]).issues.length);assert.ok(reviewIntake(Array.from({length:11},document),[]).issues.length);assert.ok(reviewIntake([d,d],[]).issues.length);
});
test('production register contains 480 planning slots and no claimed evidence or created production records',()=>{
 const r=JSON.parse(readFileSync(new URL('../docs/redesign/old-design-migration-2026-10-08/editorial-production-register.json',import.meta.url)));
 for(const kind of ['Journal','Portfolio','Testimonials','FAQs'])assert.equal(r.records.filter(x=>x.kind===kind).length,120);
 assert.equal(r.records.filter(x=>x.newRecordId).length,0);assert.ok(r.records.every(x=>x.nativeReview==='Not performed'));
 assert.ok(r.records.filter(x=>x.kind==='Portfolio').every(x=>x.classification==='concept'));assert.ok(r.records.filter(x=>x.kind==='Testimonials').every(x=>x.classification==='fictional'));
 assert.equal(new Set(r.records.map(x=>x.id)).size,480);assert.equal(r.reconciliation.replacedProposals,18);
 const html=readFileSync(new URL('../docs/redesign/old-design-migration-2026-10-08/Rivya-Editorial-Production-Register.html',import.meta.url),'utf8');
 assert.deepEqual(JSON.parse(html.split('const records=')[1].split(';let page=0')[0]),r.records);
});
