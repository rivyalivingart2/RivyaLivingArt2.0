import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validEditorialBody,bodyFromParagraphs,bodyParagraphs,safeEditorialHref} from '../src/lib/editorial-body.ts';
import {baselineContent,validContent,localizeContent} from '../src/lib/content-model.ts';
import {compilePageSnapshot,editorialDocument} from '../src/lib/page-dependencies.ts';
import {sharedCopyCandidate,sharedCopyValues,sharedCopyFields} from '../src/lib/shared-copy-model.ts';
import {baselineProducts} from '../src/lib/shop-model.ts';
import {approvedPublicMedia} from '../src/lib/public-media.ts';
import {addHomeChapter} from '../src/lib/homepage-chapters.ts';
import {homeCandidate} from '../src/lib/homepage-model.ts';
import {compileHomepageSnapshot} from '../src/lib/homepage-dependencies.ts';
import {issueField} from '../src/lib/content-issues.ts';
const clone=id=>structuredClone(baselineContent.find(d=>d.id===id));
const row=d=>({key:d.id||d.path,document:structuredClone(d),version:3,fingerprint:'test-'+(d.id||d.path)});
const source=()=>({products:baselineProducts.map(row),content:baselineContent.filter(d=>d.id!=='page:home').map(row),media:approvedPublicMedia.map(row)});
test('safe rich content preserves plain text identity while rejecting executable and unsupported input',()=>{
 const body=bodyFromParagraphs(['Read the material guide.']);body.blocks[0].runs=[{text:'Read the ',bold:true},{text:'material guide.',italic:true,href:'/materials-care#care'}];
 assert.equal(validEditorialBody(body),true);assert.deepEqual(bodyParagraphs(body),['Read the material guide.']);
 for(const href of ['javascript:alert(1)','//evil.test','/studio','/api/private','/care?x=1','/x%0a','https://evil.test'])assert.equal(safeEditorialHref(href),false);
 for(const mutate of [b=>b.blocks[0].runs[0].html='<b>x</b>',b=>b.blocks[0].kind='script',b=>b.blocks[0].runs[0].text='<img onerror=x>',b=>b.blocks.push(b.blocks[0]),b=>b.blocks[0].runs=[]]){const bad=structuredClone(body);mutate(bad);assert.equal(validEditorialBody(bad),false);}
});
test('rich body is canonical, not a competing copy store; translated text does not retain English marks',()=>{
 const d=clone('page:process');d.sections[0].body=bodyFromParagraphs(d.sections[0].paragraphs);assert.equal(validContent(d,clone(d.id)),true);
 d.sections[0].paragraphs=['different'];assert.equal(validContent(d,clone(d.id)),false);
 d.sections[0].paragraphs=bodyParagraphs(d.sections[0].body);d.translations={hi:{sections:{[d.sections[0].id]:{paragraphs:['अनुवाद']}}}};assert.equal(localizeContent(d,'hi').sections[0].body,undefined);
});
test('shared copy has a fixed inventory, protects structural labels and never exposes a contact-value field',()=>{
 assert.equal(validContent(sharedCopyCandidate,sharedCopyCandidate),true);assert.equal(sharedCopyValues().footerExplore,'Explore');
 assert.equal(sharedCopyFields.some(f=>['phone','email','whatsapp'].includes(f.id)),false);
 const d=structuredClone(sharedCopyCandidate);d.sections.pop();assert.equal(validContent(d,sharedCopyCandidate),false);
 const e=structuredClone(sharedCopyCandidate);e.sections[0].enabled=false;assert.equal(validContent(e,sharedCopyCandidate),false);
});
test('all-page snapshots retain images, related pieces and link dependencies without mutating their sources',()=>{
 const data=source(),before=JSON.stringify(data),d=clone('page:process');d.relatedProductIds=[data.products[0].key];d.sections[0].body=bodyFromParagraphs(d.sections[0].paragraphs);d.sections[0].body.blocks[0].runs[0].href='/materials-care#care';
 const saved=compilePageSnapshot(d,data);assert.deepEqual(saved.issues,[]);assert.equal(saved.products[0].id,d.relatedProductIds[0]);assert.ok(saved.dependencies.some(r=>r.key==='page:materials-care'));assert.ok(saved.image);assert.equal(JSON.stringify(data),before);
 data.content=data.content.filter(r=>r.key!=='page:materials-care');data.media=[];const current=compilePageSnapshot(d,data);assert.ok(current.issues.some(x=>x.includes('unpublished destination')));assert.equal(current.image,undefined);assert.ok(saved.image);
});
test('structured FAQ, process and materials fields validate and stable hidden anchors cannot be linked',()=>{
 const d=clone('page:faq');d.sections[0]={...d.sections[0],group:'Before ordering',policyHref:'/terms',stage:'customer',material:{appearance:'Timber grain',limitations:'Confirm per piece',care:'Follow agreed guidance',placement:'Discuss the setting'}};
 assert.equal(validContent(d,clone(d.id)),true);d.sections[1].enabled=false;d.sections[0].action={label:'Question',href:'/faq#'+d.sections[1].id};assert.ok(compilePageSnapshot(d,source()).issues.some(x=>x.startsWith('Missing section')));
 d.effectiveDate='2026-02-30';assert.equal(validContent(d,clone(d.id)),false);
});
test('forged snapshots are removed and optional chapters cannot publish while marked content needed',()=>{
 const d={...clone('page:process'),pageSnapshot:{forged:true},homeSnapshot:{forged:true}};assert.equal('pageSnapshot' in editorialDocument(d),false);assert.equal('homeSnapshot' in editorialDocument(d),false);
 const home=addHomeChapter(structuredClone(homeCandidate),'atelier','atelier-new');assert.equal(validContent(home,homeCandidate),true);assert.deepEqual(compileHomepageSnapshot(home,source()).issues,[]);home.homepage.sections.at(-1).enabled=true;assert.ok(compileHomepageSnapshot(home,source()).issues.some(x=>x.includes('needs reviewed content')));
 assert.equal(issueField(home,'atelier-new: this chapter still needs reviewed content.'),'section-atelier-new');
});
test('malformed client payloads return invalid rather than throwing',()=>{
 for(const patch of [{sections:[null]},{sections:[{id:'bad',heading:'x',paragraphs:['x'],body:{blocks:null}}]},{effectiveDate:'2026-99-99'}])assert.equal(validContent({...clone('page:process'),...patch},clone('page:process')),false);
});
