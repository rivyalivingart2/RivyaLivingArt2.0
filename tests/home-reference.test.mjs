import test from 'node:test';
import assert from 'node:assert/strict';
import {referenceHomeSections,referenceComposition,validHomeComposition,referenceSectionStates} from '../src/lib/home-reference-model.ts';
import {compileHomeReference,localizeHomeReference} from '../src/lib/home-reference-dependencies.ts';
import {homeCandidate} from '../src/lib/homepage-model.ts';
import {baselineContent} from '../src/lib/content-model.ts';
import {baselineProducts} from '../src/lib/shop-model.ts';
import {approvedPublicMedia} from '../src/lib/public-media.ts';
import {compileHomepageSnapshot} from '../src/lib/homepage-dependencies.ts';
import {defaultHomepageLayout,validHomepageLayout} from '../src/lib/presentation-model.ts';
const row=(key,document)=>({key,document,version:1,fingerprint:'checked-'+key});
const source=()=>({products:baselineProducts.map(p=>row(p.id,p)),content:baselineContent.filter(d=>d.id!=='page:home').map(d=>row(d.id,d)),media:approvedPublicMedia.map(m=>row(m.path,m))});
test('all 18 source slots retain order and separate off-by-default furniture and rooms',()=>{
 assert.deepEqual(referenceHomeSections.map(s=>s.key),['pour','manifesto','pieces','large-format','material','collections','furniture','maker','rooms','work','words','bespoke','workshops','print','process','why','journal','closing']);
 assert.deepEqual(referenceComposition().hidden,['furniture','rooms']);assert.equal(validHomeComposition(referenceComposition()),true);
 for(const hidden of [['pour'],['rooms','rooms'],['unknown']])assert.equal(validHomeComposition({...referenceComposition(),hidden}),false);
 assert.equal(validHomepageLayout({...defaultHomepageLayout,composition:referenceComposition()}),true);assert.equal(validHomeComposition({...referenceComposition(),copy:'new facts'}),false);
});
test('reference capture preserves all input documents/crops and does not pull the commission catalogue',()=>{
 const data=source(),before=JSON.stringify(data),snapshot=compileHomeReference(data);
 assert.equal(JSON.stringify(data),before);assert.deepEqual(snapshot.issues,[]);
 assert.equal(snapshot.pages.length,3);assert.equal(snapshot.pages.find(p=>p.document.route==='/commission').document.pageSnapshot.products.length,0);
 for(const item of snapshot.pages){const original=data.content.find(r=>r.key===item.document.id).document;assert.deepEqual(item.document.sections,original.sections);assert.deepEqual(item.document.translations,original.translations);assert.equal(item.document.image,original.image);}
 assert.equal(snapshot.dependencies.some(dep=>dep.kind==='content'&&dep.key==='page:our-story'),true);
 assert.deepEqual(localizeHomeReference(snapshot,'en'),snapshot);
});
test('unavailable services, portfolio, feedback and unselected journal stay absent without invented copy',()=>{
 const data=source(),home={...homeCandidate,homeSnapshot:compileHomepageSnapshot(homeCandidate,data)},snapshot=compileHomeReference(data);
 const states=referenceSectionStates(home,snapshot,referenceComposition());
 for(const key of ['work','words','workshops','print','journal','furniture','rooms'])assert.equal(states.find(s=>s.key===key).visible,false,key);
 assert.equal(states.find(s=>s.key==='maker').heading,baselineContent.find(d=>d.route==='/our-story').title);
 const missing=referenceSectionStates(home,{...snapshot,pages:[]},referenceComposition());
 for(const key of ['maker','why','large-format','bespoke'])assert.equal(missing.find(s=>s.key===key).visible,false);
});
test('confirmed additive adapters are separate from unchanged source records',()=>{
 const data=source(),home={...homeCandidate,homeSnapshot:compileHomepageSnapshot(homeCandidate,data)},snapshot=compileHomeReference(data),before=JSON.stringify(snapshot);
 const staged={...snapshot,portfolio:[{id:'qa-concept',classification:'concept',title:'QA concept',description:'Labelled test fixture',href:'/p/qa-concept'}],feedback:[{id:'qa-fiction',classification:'fictional-sample',quote:'Synthetic QA wording',attribution:''}],workshops:{title:'QA workshop',description:'Isolated fixture only',href:'/p/qa-workshop',confirmationSource:'synthetic QA evidence, not business approval',facts:[]}};
 const states=referenceSectionStates(home,staged,referenceComposition());for(const key of ['work','words','workshops'])assert.equal(states.find(s=>s.key===key).visible,true);
 assert.equal(states.find(s=>s.key==='print').visible,false);assert.equal(JSON.stringify(snapshot),before);
});
