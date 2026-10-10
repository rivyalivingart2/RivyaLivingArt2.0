import test from 'node:test';
import assert from 'node:assert/strict';
import {reviewedArticleLabels,localizeSnapshot,savedEditorialImage} from '../src/lib/editorial-language-presentation.ts';
import {translationFields,translationRevision} from '../src/lib/translation-review.ts';
import {bindImprintContacts} from '../src/lib/imprint-content.ts';

const article=()=>({id:'DB001',kind:'article',route:'/journal/room',title:'A room',eyebrow:'Spaces',description:'Plan the space.',image:'/media/scene.webp',imageAlt:'A table in a room',sections:[{id:'plan',heading:'Plan',paragraphs:['Keep the access route clear.']} ]});
function reviewed(d,locale){const fields=Object.fromEntries(translationFields(d).map(f=>[f.path,(locale==='hi'?'हिन्दी ':'ગુજરાતી ')+f.source]));d.translations={...d.translations,[locale]:{fields,reviewedRevision:translationRevision(d,fields)}};return d;}
test('article cards capture only current reviewed labels, not unreviewed prose or private values',()=>{
 const d=reviewed(article(),'hi');d.translations.gu={fields:{title:'અપૂર્ણ'}};d.privateNote='do not serialize';
 const copy=reviewedArticleLabels(d);assert.deepEqual(Object.keys(copy),['hi']);assert.deepEqual(Object.keys(copy.hi).sort(),['description','eyebrow','imageAlt','title']);
 assert.equal(copy.hi.title,'हिन्दी A room');d.sections[0].paragraphs[0]='Source changed';assert.equal(reviewedArticleLabels(d),undefined);
});
test('localized snapshot cards preserve exact IDs, media, products and recorded revisions',()=>{
 const d=reviewed(article(),'gu');const a={...d,localizedCopy:reviewedArticleLabels(d)};delete a.translations;
 const original={schemaVersion:1,articles:[a],products:[{id:'DP001',name:'Unchanged'}],dependencies:[{kind:'content',key:'DB001',version:2}],mediaPaths:['/media/scene.webp'],categories:[],issues:[]};
 const before=JSON.stringify(original),localized=localizeSnapshot(original,'gu');assert.equal(localized.articles[0].title,'ગુજરાતી A room');assert.equal(localized.articles[0].route,a.route);assert.equal(localized.articles[0].image,a.image);assert.deepEqual(localized.products,original.products);assert.deepEqual(localized.dependencies,original.dependencies);assert.equal(JSON.stringify(original),before);
 assert.equal(localizeSnapshot(original,'en'),original);assert.equal(localizeSnapshot({...original,articles:[article()]},'gu').articles[0].title,'A room');
});
test('saved translated preview keeps its captured image and crop while using the reviewed description',()=>{
 const snapshot={image:{path:'/media/saved.webp',alt:'English snapshot',position:'30% 60%'}};
 assert.deepEqual(savedEditorialImage({...article(),imageAlt:'હિન્દી નહીં, ગુજરાતી વર્ણન'},snapshot),{image:'/media/saved.webp',imageAlt:'હિન્દી નહીં, ગુજરાતી વર્ણન',imagePosition:'30% 60%'});
 assert.equal(savedEditorialImage({...article(),imageAlt:undefined},snapshot).imageAlt,'English snapshot');
 assert.equal(savedEditorialImage(article(),{}).image,undefined);
});
test('Imprint contact binding preserves the translated heading but never editable contact values',()=>{
 const d={...article(),id:'page:imprint',sections:[{id:'section-2',heading:'સંપર્કની માહિતી',paragraphs:['Old phone and email'],body:{blocks:[]},action:{href:'/old',label:'Old'}}]};
 const result=bindImprintContacts(d,{phone:'+918320404132',email:'rivyalivingart2.0@gmail.com'});
 assert.equal(result.sections[0].heading,'સંપર્કની માહિતી');assert.deepEqual(result.sections[0].paragraphs,['Phone: +91 8320404132. Email: rivyalivingart2.0@gmail.com']);assert.equal(result.sections[0].body,undefined);assert.equal(result.sections[0].action,undefined);assert.equal(d.sections[0].paragraphs[0],'Old phone and email');
});

test('embedded editorial translations are captured, localized and protected from later source changes',async()=>{
 const {publicEntry}=await import('../src/lib/landing-dependencies.ts');
 const d=reviewed(article(),'hi');d.privateNote='never public';d.editorial={kind:'portfolio',classification:'concept',schemaVersion:1,evidence:{source:'private'}};
 // Editorial evidence is excluded from the reviewed text fingerprint and public copy.
 const entry=publicEntry(d),snapshot={articles:[],products:[],dependencies:[{key:d.id,version:3,fingerprint:'original'}],faqEntries:[entry],discovery:[entry],landing:{entries:{grid:[entry]},productIds:{}}};
 const before=JSON.stringify(snapshot),translated=localizeSnapshot(snapshot,'hi');
 for(const e of [translated.faqEntries[0],translated.discovery[0],translated.landing.entries.grid[0]]){
  assert.notEqual(e.title,d.title);assert.notEqual(e.sections[0].paragraphs[0],d.sections[0].paragraphs[0]);assert.equal(e.route,d.route);assert.equal(e.editorial.classification,'concept');
 }
 assert.equal(JSON.stringify(translated).includes('private'),false);assert.deepEqual(translated.dependencies,snapshot.dependencies);assert.equal(JSON.stringify(snapshot),before);
 d.sections[0].paragraphs[0]='Changed English';assert.equal(publicEntry(d).localizedCopy,undefined);assert.equal(localizeSnapshot(snapshot,'gu').faqEntries[0].title,'A room');
 assert.notEqual(localizeSnapshot(snapshot,'hi').faqEntries[0].sections[0].paragraphs[0],d.sections[0].paragraphs[0]);
});
