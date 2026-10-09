import {test} from 'node:test';
import assert from 'node:assert/strict';
import {baselineContent,validContent} from '../src/lib/content-model.ts';
import {baselineProducts} from '../src/lib/shop-model.ts';
import {approvedPublicMedia} from '../src/lib/public-media.ts';
import {compilePageSnapshot} from '../src/lib/page-dependencies.ts';
import {landingTypes,validLanding} from '../src/lib/landing-model.ts';
import {editorialPublicationIssues,publicEditorial,editorialDisclosure} from '../src/lib/editorial-record-model.ts';
import {supportedSavedPreview} from '../src/lib/content-preview-model.ts';
import {translationFields,validTranslationFields} from '../src/lib/translation-review.ts';
const uuid='cc71559f-96c0-4fbe-a08f-8f2307bc7001';
const row=d=>({key:d.id||d.path,document:d,version:1,fingerprint:'fingerprint-'+(d.id||d.path)});
const source=()=>({products:baselineProducts.map(row),content:baselineContent.map(row),media:approvedPublicMedia.map(row)});
const document=(kind='portfolio',classification='concept')=>({id:'editorial:'+uuid,kind:'page',route:'/'+(kind==='testimonial'?'testimonials':kind)+'/material-study',title:'Material study',eyebrow:'Material',description:'A labelled study of form and colour.',sections:[{id:'brief',heading:'The brief',paragraphs:['A design exploration for review.']}],editorial:{schemaVersion:1,kind,classification}});
const landing=blocks=>({id:'custom-page:'+uuid,kind:'page',route:'/p/material-study',title:'Material study',eyebrow:'Material',description:'A page about material.',sections:[{id:'intro',heading:'Material',paragraphs:['A page about material.']}],landing:{schemaVersion:1,blocks}});
const block=(type,id=type)=>({id:id.toLowerCase(),type,enabled:true,heading:type,paragraphs:['Explore the material.']});
test('M5: all sixteen block types are bounded and hero/final slots are exclusive',()=>{
 assert.equal(landingTypes.length,16);
 for(const type of landingTypes)assert.ok(validContent(landing([block(type)])),type);
 assert.equal(validLanding({schemaVersion:1,blocks:[block('hero'),block('videoHero')]}),false);
 assert.equal(validLanding({schemaVersion:1,blocks:[block('hero'),block('hero')]}),false);
 assert.equal(validContent(landing([{...block('richText'),type:'html',html:'<script>alert(1)</script>'}])),false);
 assert.equal(validContent(landing([{...block('productGrid'),ids:Array.from({length:13},(_,i)=>'DP'+i)}])),false);
 assert.equal(validContent(landing([{...block('imageCta'),action:{label:'Bad link',href:'javascript:alert(1)'}}])),false);
});
test('M5: new editorial identity and kind cannot claim an existing page or change saved routes',()=>{
 const d=document();assert.ok(validContent(d));assert.ok(supportedSavedPreview(d.id));
 assert.equal(validContent({...d,route:'/contact'}),false);
 assert.equal(validContent({...d,id:'page:contact'}),false);
 assert.equal(validContent({...d,route:'/portfolio/new-name'},d),false);
 assert.equal(validContent({...d,editorial:{...d.editorial,classification:'fictional'}}),false);
 for(const old of baselineContent)assert.ok(validContent(old,old),old.id);
});
test('M5: concepts and fictional samples have mandatory public classification and no pretend customer',()=>{
 const d=document('testimonial','fictional');assert.ok(validContent(d));assert.deepEqual(editorialPublicationIssues(d),[]);
 assert.match(editorialDisclosure(d.editorial),/not a customer review/);
 assert.match(editorialDisclosure(document().editorial),/not a completed customer project/);
 assert.equal(validContent({...d,editorial:{...d.editorial,attribution:'Invented customer'}}),false);
 assert.equal(validContent({...d,image:approvedPublicMedia[0].path,imageAlt:'Pretend reviewer'}),false);
 const e={...d.editorial,evidence:{source:'private-record',permission:'private-consent',reviewer:'private-person',approvedOn:'2026-10-09'}};
 assert.equal(JSON.stringify(publicEditorial(e)).includes('private'),false);
});
test('M5: genuine evidence and sourced FAQ publication are gated while drafts remain saveable',()=>{
 const d=document('testimonial','genuine');assert.ok(validContent(d));assert.equal(editorialPublicationIssues(d).length,1);
 d.editorial.evidence={source:'Original feedback record',permission:'Owner permission record',reviewer:'Review reference',approvedOn:'2026-10-09'};
 assert.equal(editorialPublicationIssues(d).length,1);
 d.editorial.attribution='Approved attribution';assert.deepEqual(editorialPublicationIssues(d),[]);
 const faq=document('faq','guidance');assert.ok(validContent(faq));assert.equal(editorialPublicationIssues(faq).length,1);faq.editorial.policyHref='/terms';assert.deepEqual(editorialPublicationIssues(faq),[]);
});
test('M5: landing product order, article and stable original FAQ dependencies are captured without mutations',()=>{
 const input=source(),before=JSON.stringify(input),article=baselineContent.find(d=>d.kind==='article'),faq=baselineContent.find(d=>d.id==='page:faq');
 const d=landing([{...block('productGrid'),ids:['DP013','DP001']},{...block('journalGrid'),ids:[article.id]},{...block('faqPicker'),ids:['page:faq#'+faq.sections[0].id]}]);
 const result=compilePageSnapshot(d,input);assert.deepEqual(result.issues,[]);
 assert.deepEqual(result.landing.productIds.productgrid,['DP013','DP001']);
 assert.equal(result.landing.entries.journalgrid[0].id,article.id);
 assert.deepEqual(result.landing.entries.faqpicker[0].sections[0].paragraphs,faq.sections[0].paragraphs);
 assert.ok(result.dependencies.some(r=>r.kind==='content'&&r.key===faq.id));assert.equal(JSON.stringify(input),before);
 input.content=input.content.filter(r=>r.key!==article.id);const withdrawn=compilePageSnapshot(d,input);
 assert.equal(withdrawn.landing.entries.journalgrid.length,0);assert.ok(withdrawn.issues.some(i=>i.includes(article.id)));
 assert.equal(result.landing.entries.journalgrid[0].id,article.id,'previous saved preview remains exact');
});
test('M5: wrong-kind, withdrawn and unapproved editorial dependencies cannot render as quote evidence',()=>{
 const input=source(),concept=document(),genuine=document('testimonial','genuine');genuine.id='editorial:cc71559f-96c0-4fbe-a08f-8f2307bc7002';input.content.push(row(concept),row(genuine));
 const d=landing([{...block('portfolioGrid'),ids:[concept.id]},{...block('testimonialGrid'),ids:[concept.id,genuine.id]}]);
 const result=compilePageSnapshot(d,input);assert.equal(result.landing.entries.portfoliogrid.length,1);assert.equal(result.landing.entries.testimonialgrid.length,0);assert.ok(result.issues.length>=2);
 assert.equal(JSON.stringify(result.landing).includes('evidence'),false);
});
test('M5: new gallery usages support wide ratios without touching originals or allowing private paths',()=>{
 const media=approvedPublicMedia[0],usage={path:media.path,alt:'Material',caption:'Design visualization',desktop:{x:31,y:42,ratio:'16/9'},mobile:{x:52,y:67,ratio:'4/5'}};
 const d=landing([{...block('bentoGallery'),gallery:[usage]}]);assert.ok(validContent(d));
 assert.deepEqual(compilePageSnapshot(d,source()).issues,[]);
 d.landing.blocks[0].gallery[0].path='/api/studio/references/private';assert.equal(validContent(d),false);
});
test('M5: new block copy participates in reviewed translation while private evidence and crop fields do not',()=>{
 const d=landing([block('richText')]),fields=translationFields(d);
 assert.ok(fields.some(f=>f.path==='landing.blocks.0.heading'));
 assert.equal(validTranslationFields(d,{fields:{'landing.blocks.0.action.href':'/contact'}}),false);
 const e=document();e.editorial.evidence={source:'private',permission:'private',reviewer:'private',approvedOn:'2026-10-09'};
 assert.ok(!translationFields(e).some(f=>f.path.includes('evidence')));
});
