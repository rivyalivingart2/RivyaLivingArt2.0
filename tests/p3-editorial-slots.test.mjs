import {test} from 'node:test';
import assert from 'node:assert/strict';
import {baselineContent} from '../src/lib/content-model.ts';
import {homeCandidate} from '../src/lib/homepage-model.ts';
import {sharedCopyCandidate} from '../src/lib/shared-copy-model.ts';
import {editorialSlots,assignEditorialSlot,editorialUsages} from '../src/lib/editorial-slots.ts';

test('slot inventory exposes rendered editorial placements and protects product references',()=>{
 const slots=editorialSlots(homeCandidate);
 assert.equal(slots.find(s=>s.key==='home:material').editable,true);
 assert.equal(slots.find(s=>s.key==='hero').editable,true);
 assert.equal(slots.filter(s=>s.key.startsWith('journey:')).length,3);
 assert.ok(slots.filter(s=>s.key.startsWith('journey:')).every(s=>s.editable));
 assert.deepEqual(editorialSlots(sharedCopyCandidate),[]);
});
test('a crop changes only the chosen page slot and never its original or shared references',()=>{
 const before=structuredClone(homeCandidate),source=JSON.stringify(before);
 const usage=structuredClone(before.homepage.sections.find(s=>s.id==='material').image);
 usage.mobile.x=23;
 const next=assignEditorialSlot(before,'home:material',usage);
 assert.equal(next.homepage.sections.find(s=>s.id==='material').image.mobile.x,23);
 assert.equal(JSON.stringify(before),source);
 assert.equal(next.homepage.heroProductId,before.homepage.heroProductId);
 assert.deepEqual(next.homepage.sections.find(s=>s.id==='journeys'),before.homepage.sections.find(s=>s.id==='journeys'));
 assert.equal(assignEditorialSlot(next,'home:material').homepage.sections.find(s=>s.id==='material').image,undefined);
});
test('private paths, invalid crops and reference placements cannot be assigned',()=>{
 const usage=structuredClone(homeCandidate.homepage.sections.find(s=>s.id==='material').image);
 assert.equal(assignEditorialSlot(homeCandidate,'hero',usage).homepage.heroImage.path,usage.path);
 assert.throws(()=>assignEditorialSlot(homeCandidate,'missing',usage),/unavailable/);
 assert.throws(()=>assignEditorialSlot(homeCandidate,'home:material',{...usage,path:'/api/studio/private-reference/file'}),/approved/);
 assert.throws(()=>assignEditorialSlot(homeCandidate,'home:material',{...usage,mobile:{...usage.mobile,x:101}}),/approved/);
});
test('generic section assignment preserves the header and other sections; usage counts retain both saved states',()=>{
 const before=structuredClone(baselineContent.find(d=>d.id==='page:process'));
 const usage=homeCandidate.homepage.sections.find(s=>s.id==='material').image;
 const next=assignEditorialSlot(before,'section:'+before.sections[0].id,usage);
 assert.equal(next.image,before.image);
 assert.deepEqual(next.sections.slice(1),before.sections.slice(1));
 assert.equal(before.sections[0].image,undefined);
 const owners=[{document:next,published:before},{document:homeCandidate,published:homeCandidate}];
 const all=editorialUsages(owners,usage.path);
 assert.ok(all.some(u=>u.record==='page:process'&&u.state==='draft'));
 assert.ok(!all.some(u=>u.record==='page:process'&&u.state==='published'&&u.slot.startsWith('section:')));
 assert.equal(all.filter(u=>u.record==='page:home').length,2);
});
