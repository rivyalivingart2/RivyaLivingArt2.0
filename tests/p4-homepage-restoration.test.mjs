import {test} from 'node:test';
import assert from 'node:assert/strict';
import {restoreMissingHomeChapters,homeSectionDisposition,detailedHomeChapters} from '../src/lib/homepage-restoration.ts';
import {homeCandidate,homeActions} from '../src/lib/homepage-model.ts';
import {baselineContent,validContent} from '../src/lib/content-model.ts';
import {compileHomepageSnapshot} from '../src/lib/homepage-dependencies.ts';
import {baselineProducts} from '../src/lib/shop-model.ts';
import {approvedPublicMedia} from '../src/lib/public-media.ts';
import {availableNavigation,destinationAvailable} from '../src/lib/navigation-availability.ts';
import {defaultNavigation} from '../src/lib/site-settings-model.ts';
const row=(key,document)=>({key,document,version:1,fingerprint:key});
const source=()=>({products:baselineProducts.map(p=>row(p.id,p)),content:baselineContent.filter(d=>d.id!=='page:home').map(d=>row(d.id,d)),media:approvedPublicMedia.map(m=>row(m.path,m))});

test('restoration preserves every existing edit and protected reference, and is idempotent',()=>{
 const current=structuredClone(homeCandidate);current.title='My existing headline';current.homepage.sections.reverse();current.homepage.sections.find(s=>s.id==='material').image.mobile.x=19;
 const before=JSON.stringify(current),restored=restoreMissingHomeChapters(current);
 assert.equal(JSON.stringify(current),before);assert.equal(restored.title,current.title);assert.equal(validContent(restored,homeCandidate),true);
 assert.deepEqual(restored.sections.filter(s=>current.sections.some(c=>c.id===s.id)),current.sections);
 assert.deepEqual(restored.homepage.sections.filter(s=>current.homepage.sections.some(c=>c.id===s.id)),current.homepage.sections);
 assert.deepEqual(restoreMissingHomeChapters(restored),restored);
 assert.ok(detailedHomeChapters.every(t=>{const s=restored.homepage.sections.find(s=>s.id===t.block.id);return !s.enabled&&s.contentNeeded;}));
});
test('restoration accounts for all 18 legacy sections without fabricating conditional evidence',()=>{
 assert.equal(homeSectionDisposition.length,18);assert.equal(new Set(homeSectionDisposition.map(s=>s.old)).size,18);
 assert.equal(homeSectionDisposition.filter(s=>s.outcome==='Content needed').length,5);
 const restored=restoreMissingHomeChapters(homeCandidate);
 for(const deferred of homeSectionDisposition.filter(s=>s.outcome==='Content needed'))assert.ok(!restored.homepage.sections.some(s=>s.id===deferred.old));
 assert.deepEqual(compileHomepageSnapshot(restored,source()).issues,[]);
 restored.homepage.sections.find(s=>s.id==='manifesto').enabled=true;
 assert.ok(compileHomepageSnapshot(restored,source()).issues.some(i=>i.includes('manifesto')&&i.includes('reviewed')));
});
test('restoration refuses capacity overflow without truncating an existing draft',()=>{
 const current=structuredClone(homeCandidate);while(current.sections.length<20){const id='owner-'+current.sections.length;current.sections.push({id,heading:'Owner chapter',paragraphs:['Keep this work.']});current.homepage.sections.push({id,type:'story',enabled:false,eyebrow:''});}
 const before=JSON.stringify(current);assert.throws(()=>restoreMissingHomeChapters(current),/20 chapters/);assert.equal(JSON.stringify(current),before);
});
test('layout validation and secondary actions keep the normal publication dependency gate',()=>{
 const current=restoreMissingHomeChapters(homeCandidate),s=current.homepage.sections.find(s=>s.id==='manifesto');s.enabled=true;s.contentNeeded=false;s.secondaryAction={label:'A private destination',href:'/not-published'};
 assert.equal(validContent(current,homeCandidate),true);assert.ok(homeActions(current.homepage).some(a=>a.href==='/not-published'));
 assert.ok(compileHomepageSnapshot(current,source()).issues.some(i=>i.includes('/not-published')));
 s.layout='raw-html';assert.equal(validContent(current,homeCandidate),false);s.layout='statement';s.secondaryAction.href='javascript:alert(1)';assert.equal(validContent(current,homeCandidate),false);
});
test('navigation hides unpublished destinations and anchors without mutating saved configuration',()=>{
 const before=JSON.stringify(defaultNavigation),documents=[{route:'/our-story',anchors:['approach']},{route:'/imprint',anchors:[]}];
 const filtered=availableNavigation(defaultNavigation,documents,[]);
 assert.equal(JSON.stringify(defaultNavigation),before);assert.deepEqual(filtered.header.map(i=>i.href),['/our-story','/journal']);
 assert.deepEqual(filtered.footerLegal.map(i=>i.href),['/imprint']);assert.equal(filtered.collections.length,3);
 assert.equal(destinationAvailable('/our-story#approach',documents,[]),true);assert.equal(destinationAvailable('/our-story#missing',documents,[]),false);
 assert.equal(destinationAvailable('/pieces/published/customize',documents,['/pieces/published']),true);assert.equal(destinationAvailable('/pieces/withdrawn',documents,[]),false);
 assert.equal(destinationAvailable('/studio/content',documents,[]),false);assert.equal(destinationAvailable('//outside.example',documents,[]),false);
 assert.equal(destinationAvailable('/care', [{route:'/materials-care',anchors:['care']}],[]),true);
});
