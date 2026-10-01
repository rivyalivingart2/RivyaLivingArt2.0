import {test} from 'node:test';
import assert from 'node:assert/strict';
import {baselineContent,validContent} from '../src/lib/content-model.ts';
import {detailedPageCandidates,restoreDetailedChapters,detailedChapters,discoveryTier} from '../src/lib/detailed-pages.ts';
import {compilePageSnapshot} from '../src/lib/page-dependencies.ts';
import {baselineProducts} from '../src/lib/shop-model.ts';
import {approvedPublicMedia} from '../src/lib/public-media.ts';
import {parseSavedPieces,changeSavedPieces,storeSavedPieces,savedPiecesKey} from '../src/lib/saved-pieces.ts';
import {formatPrice,formErrorTarget} from '../src/lib/product-presentation.ts';
import {discoveryPreviewUrl} from '../src/lib/discovery-preview-url.ts';
import {supportedSavedPreview} from '../src/lib/content-preview-model.ts';
const row=(key,document)=>({key,document,version:1,fingerprint:key});
const source=()=>({products:baselineProducts.map(p=>row(p.id,p)),content:baselineContent.map(d=>row(d.id,d)),media:approvedPublicMedia.map(m=>row(m.path,m))});
test('all detailed discovery candidates are valid and keep a visible browse target',()=>{
 assert.equal(detailedPageCandidates.length,6);
 for(const d of detailedPageCandidates){assert.ok(validContent(d,d),d.id);if(d.route==='/journal')continue;const hidden=structuredClone(d);hidden.sections.find(s=>s.id==='browse').enabled=false;assert.equal(validContent(hidden,d),false);}
});
test('restore adds only missing hidden chapters and never overwrites existing copy or crops',()=>{
 for(const route of Object.keys(detailedChapters)){
  const d=structuredClone(baselineContent.find(d=>d.route===route));d.sections[0].heading='An existing owner edit';const before=JSON.stringify(d),result=restoreDetailedChapters(d);
  assert.equal(JSON.stringify(d),before);assert.deepEqual(result.sections.slice(0,d.sections.length),d.sections);
  assert.ok(result.sections.slice(d.sections.length).every(s=>s.enabled===false&&s.sourceNote));assert.deepEqual(restoreDetailedChapters(result),result);assert.ok(validContent(result,d));
  while(d.sections.length<20)d.sections.push({id:'owner-'+d.sections.length,heading:'Owner text',paragraphs:['Keep this.']});assert.throws(()=>restoreDetailedChapters(d),/20/);
 }
});
test('collection snapshots follow the correct tier and reject unavailable product images',()=>{
 for(const d of detailedPageCandidates.filter(d=>discoveryTier(d.route))){const snap=compilePageSnapshot(d,source());assert.ok(snap.products.length>0);assert.ok(snap.products.every(p=>p.tier===discoveryTier(d.route)));const changed=source();changed.media=changed.media.filter(m=>m.key!==snap.products[0].image);const missing=compilePageSnapshot(d,changed);assert.ok(!missing.products.some(p=>p.id===snap.products[0].id));assert.ok(missing.issues.some(x=>x.includes(snap.products[0].id)));}
});
test('journal publication rejects a featured draft or unknown article and snapshots published routes',()=>{
 const d=structuredClone(detailedPageCandidates.find(d=>d.route==='/journal'));d.featuredArticleIds=['article:not-published'];assert.ok(compilePageSnapshot(d,source()).issues.some(s=>s.includes('not-published')));
 const changed=source();changed.content=changed.content.filter(r=>r.document.route!=='/privacy');const snapshot=compilePageSnapshot(d,changed);assert.ok(!snapshot.availableRoutes.includes('/privacy'));assert.ok(snapshot.availableRoutes.includes('/our-story'));
});
test('section layouts reject arbitrary values; featured article selection is journal-only',()=>{
 const d=structuredClone(detailedPageCandidates[0]);d.sections[1].layout='unsafe';assert.equal(validContent(d,detailedPageCandidates[0]),false);d.sections[1].layout='reverse';assert.equal(validContent(d,detailedPageCandidates[0]),true);d.featuredArticleIds=['DB001'];assert.equal(validContent(d,detailedPageCandidates[0]),false);
});
test('saved pieces retain only valid unique identifiers within their cap and toggle without mutation',()=>{
 assert.deepEqual(parseSavedPieces('broken'),[]);assert.deepEqual(parseSavedPieces('{"phone":"private"}'),[]);assert.deepEqual(parseSavedPieces('["DP001","DP001",null,"<script>","DB002"]'),['DP001','DB002']);
 const ids=['DP001'];assert.deepEqual(changeSavedPieces(ids,'DP002'),['DP001','DP002']);assert.deepEqual(changeSavedPieces(ids,'DP001'),[]);assert.deepEqual(ids,['DP001']);assert.equal(parseSavedPieces(JSON.stringify(Array.from({length:70},(_,i)=>'ID'+i))).length,60);
});
test('price and validation targets preserve factual values and focus reference group instead of disabled file field',()=>{
 assert.equal(formatPrice({mode:'fixed',amount:12345}),'₹12,345');assert.equal(formatPrice({mode:'starting',amount:12345}),'From ₹12,345');assert.equal(formatPrice(undefined),'Price on request');assert.equal(formErrorTarget('references',false),'contact-references');assert.equal(formErrorTarget('size',true),'answer-size');assert.equal(formErrorTarget('consent',false),'contact-consent');
});
test('blocked or full browser storage reports failure rather than confirming a save',()=>{
 assert.equal(storeSavedPieces({setItem(){throw Error('Quota exceeded');}},['DP001']),false);
 let saved;assert.equal(storeSavedPieces({setItem(key,value){saved={key,value};}},['DP001']),true);assert.deepEqual(saved,{key:savedPiecesKey,value:'["DP001"]'});
});
test('interactive discovery keeps the exact saved preview identity through filter and reset',()=>{
 const params=new URLSearchParams({record:'page:journal',version:'9'});
 assert.equal(discoveryPreviewUrl('/journal?q=wood','/journal',params),'/journal?q=wood');
 assert.equal(discoveryPreviewUrl('/journal?q=wood','/studio/preview/frame',params),'/studio/preview/frame?q=wood&record=page%3Ajournal&version=9');
 assert.equal(discoveryPreviewUrl('/journal','/studio/preview/frame',params),'/studio/preview/frame?record=page%3Ajournal&version=9');
});
test('public collection ordering is stable after row updates and sample price values stay private',()=>{
 const input=source();input.products.reverse();const d=detailedPageCandidates.find(d=>d.route==='/personal-art'),snap=compilePageSnapshot(d,input);
 assert.deepEqual(snap.products.map(p=>p.id),snap.products.map(p=>p.id).toSorted());assert.ok(snap.products.every(p=>p.price===undefined));
 assert.equal(formatPrice({mode:'fixed',amount:1000,sample:true}),'Price on request');
 const journal=compilePageSnapshot(detailedPageCandidates.find(d=>d.route==='/journal'),input);assert.deepEqual(journal.articles.map(a=>a.id),journal.articles.map(a=>a.id).toSorted());
});
test('custom pages use durable identities and a bounded route namespace with stable saved addresses',()=>{
 const d={id:'custom-page:6fe53f03-3d9f-4bb4-bb73-a86683f31f08',kind:'page',route:'/p/atelier-notes',title:'Atelier notes',eyebrow:'Notes',description:'Reviewed page content.',sections:[{id:'chapter',heading:'A chapter',paragraphs:['An original paragraph.']}]};
 assert.equal(validContent(d),true);assert.equal(supportedSavedPreview(d.id),true);
 for(const route of ['/studio','/contact','/p/../studio','/p/with/nesting','/p/with spaces'])assert.equal(validContent({...d,route}),false,route);
 assert.equal(validContent({...d,route:'/p/different'},d),false);assert.equal(validContent({...d,id:'custom-page:made-up'}),false);assert.equal(supportedSavedPreview('custom-page:made-up'),false);
});
