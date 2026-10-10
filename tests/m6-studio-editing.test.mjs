import {test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {newEditorialDocument,inEditorialArea,editorialAreas} from '../src/lib/editorial-workspaces.ts';
import {contentListDocument,contentListDraftState} from '../src/lib/content-list-document.ts';
import {editorialSlots,assignEditorialSlot} from '../src/lib/editorial-slots.ts';
import {contentIssues,issueField} from '../src/lib/content-issues.ts';
import {homeCandidate} from '../src/lib/homepage-model.ts';
import {analyticsRange} from '../src/lib/studio-analytics.ts';
import {studioChildHref} from '../src/lib/studio-modules.ts';
const usage=structuredClone(homeCandidate.homepage.sections.find(s=>s.id==='material').image);

test('new Studio records are unsaved, correctly scoped and never fabricate approval',()=>{
 for(const area of editorialAreas){
  const d=newEditorialDocument(area,randomUUID()),compact=contentListDocument(d);
  assert.ok(inEditorialArea(area,compact));
  assert.equal(editorialAreas.filter(a=>inEditorialArea(a,compact)).length,1);
  assert.ok(!d.editorial?.evidence);assert.ok(!d.editorial?.attribution);
  assert.ok(contentIssues(d).some(i=>i.field==='description'));
  assert.equal(contentListDraftState({document:d,published:null,version:0}),'Source candidate');
 }
});
test('compact editorial summaries preserve kind and classification while withholding private evidence and image detail',()=>{
 const d=newEditorialDocument('portfolio',randomUUID());
 d.editorial.evidence={source:'private-source',permission:'private-permission',reviewer:'test',approvedOn:'2026-01-01'};d.editorial.gallery=[usage];
 const compact=contentListDocument(d);
 assert.equal(compact.editorial.kind,'portfolio');assert.equal(compact.editorial.classification,'concept');
 assert.equal(compact.editorial.evidence,undefined);assert.equal(compact.editorial.gallery,undefined);
});
test('new landing and portfolio crop edits touch only their selected usage and preserve the original document',()=>{
 const d=newEditorialDocument('landing-pages',randomUUID());
 d.landing.blocks[0].image=usage;
 d.landing.blocks.push({id:'gallery',type:'masonryGallery',enabled:true,heading:'Gallery',paragraphs:[],gallery:[usage,usage]});
 const before=structuredClone(d),changed={...usage,mobile:{...usage.mobile,x:18}};
 const next=assignEditorialSlot(d,'landing-gallery:gallery:1',changed);
 assert.deepEqual(d,before);assert.deepEqual(next.landing.blocks[0],d.landing.blocks[0]);
 assert.equal(next.landing.blocks[1].gallery[0].mobile.x,usage.mobile.x);assert.equal(next.landing.blocks[1].gallery[1].mobile.x,18);
 assert.deepEqual(editorialSlots(d).map(s=>s.key),['landing:opening','landing-gallery:gallery:0','landing-gallery:gallery:1']);
 const p=newEditorialDocument('portfolio',randomUUID());p.editorial.gallery=[usage];
 assert.equal(assignEditorialSlot(p,'portfolio-gallery:0',changed).editorial.gallery[0].mobile.x,18);assert.equal(p.editorial.gallery[0].mobile.x,usage.mobile.x);
 assert.deepEqual(editorialSlots(newEditorialDocument('testimonials',randomUUID())),[]);
});
test('source and block failures identify the relevant repair control',()=>{
 const d=newEditorialDocument('testimonials',randomUUID());d.editorial.classification='genuine';
 assert.ok(contentIssues(d).some(i=>i.field==='editorial'));
 assert.equal(issueField(d,'Record the genuine source and permission'),'editorial');
 const p=newEditorialDocument('landing-pages',randomUUID());
 assert.equal(issueField(p,'Opening: select a verified film.'),'block-opening');
});
test('analytics uses complete IST dates and a preceding period of equal length',()=>{
 const r=analyticsRange('2026-10-01','2026-10-07');
 assert.equal(r.days,7);assert.equal(r.fromInstant,'2026-09-30T18:30:00.000Z');assert.equal(r.toExclusive,'2026-10-07T18:30:00.000Z');assert.equal(r.previousFrom,'2026-09-23T18:30:00.000Z');
 assert.equal(analyticsRange(null,null,'2026-10-08T20:00:00Z').to,'2026-10-09');
 for(const dates of [['2026-02-30','2026-03-02'],['2026-10-09','2026-10-08'],['2024-01-01','2026-01-01'],['bad','2026-01-01']])assert.throws(()=>analyticsRange(...dates));
});
test('supported record child routes keep exact identities while excluded tools and arbitrary tails stay unavailable',()=>{
 assert.equal(studioChildHref(['blog','article:abc']),'/studio/journal?record=article%3Aabc');
 assert.equal(studioChildHref(['custom-pages','new']),'/studio/landing-pages?create=1');
 for(const p of [['scraper','new'],['catalog-fill','a'],['inquiries','a','print'],['pages','../secret'],['products','a','unknown']])assert.equal(studioChildHref(p),null);
});


test('new source and landing blockers keep exact deep links and translation review covers portfolio detail text',async()=>{
 const {studioRecordHref,studioRecordTarget}=await import('../src/lib/studio-record-links.ts');
 const {translationFields}=await import('../src/lib/translation-review.ts');
 for(const field of ['editorial','block-opening']){const href=studioRecordHref('content','editorial:example',field);assert.equal(studioRecordTarget('content',new URL(href,'https://example.invalid').searchParams).field,field);}
 const d=newEditorialDocument('portfolio',randomUUID());d.editorial.details=[{label:'Study',value:'A conceptual material pairing'}];d.editorial.evidence={source:'private',permission:'private',reviewer:'private',approvedOn:'2026-01-01'};
 const fields=translationFields(d);assert.ok(fields.some(f=>f.path==='editorial.details.0.value'));assert.ok(!fields.some(f=>f.path.includes('evidence')));
});
