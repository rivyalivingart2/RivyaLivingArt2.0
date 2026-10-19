import test from 'node:test';
import assert from 'node:assert/strict';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {localizeEditorialContent,capturedEditorialLanguage} from '../src/lib/editorial-content-language.ts';
import {localizeSnapshot,reviewedArticleLabels} from '../src/lib/editorial-language-presentation.ts';
import {translationFields,translationRevision,translationStatus} from '../src/lib/translation-review.ts';
import {StructuredData,editorialStructuredDataValue} from '../src/components/shop/structured-data-markup.tsx';

const origin='https://www.rivyalivingart.com';
const article=()=>({id:'DB001',kind:'article',route:'/journal/room',title:'A room',eyebrow:'Spaces',description:'Plan the space.',image:'/media/scene.webp',imageAlt:'A table in a room',sections:[{id:'plan',heading:'Plan',paragraphs:['Keep the access route clear.']} ]});
function reviewed(document,locale){
 const prefix=locale==='hi'?'हिन्दी ':'ગુજરાતી ';
 const fields=Object.fromEntries(translationFields(document).map(field=>[field.path,prefix+field.source]));
 document.translations={...document.translations,[locale]:{fields,reviewedRevision:translationRevision(document,fields)}};
 return document;
}
function renderedArticle(document){
 const markup=renderToStaticMarkup(createElement(StructuredData,{value:editorialStructuredDataValue(document,origin)}));
 assert.equal((markup.match(/<script/g)||[]).length,1);
 const data=JSON.parse(markup.slice(markup.indexOf('>')+1,markup.lastIndexOf('</script>')));
 return data['@graph'].find(item=>item['@type']==='Article');
}

for(const locale of ['hi','gu']){
 test(`reviewed ${locale} content and rendered Article metadata agree before the translated review fingerprint changes`,()=>{
  const original=reviewed(article(),locale),before=JSON.stringify(original);
  const localized=localizeEditorialContent(original,locale);
  assert.equal(translationStatus(original,locale).state,'reviewed');
  assert.equal(translationStatus(localized,locale).state,'stale');
  assert.equal(localized.contentLanguage,locale);
  assert.notEqual(localized.title,original.title);
  const schema=renderedArticle(localized);
  assert.equal(schema.inLanguage,locale);
  assert.equal(schema.headline,localized.title);
  assert.equal(schema.description,localized.description);
  assert.equal(schema.url,origin+original.route);
  assert.equal(schema.image,origin+original.image);
  assert.equal(JSON.stringify(original),before);
 });

 for(const state of ['missing','needs review','incomplete','stale']){
  test(`${locale} ${state} translation retains English text and English rendered metadata`,()=>{
   const original=state==='missing'?article():reviewed(article(),locale);
   if(state==='needs review')delete original.translations[locale].reviewedRevision;
   if(state==='incomplete')delete original.translations[locale].fields['sections.0.paragraphs.0'];
   if(state==='stale')original.sections[0].paragraphs[0]='The English source changed.';
   const before=JSON.stringify(original),localized=localizeEditorialContent(original,locale);
   assert.equal(translationStatus(original,locale).state,state);
   assert.equal(localized.contentLanguage,'en');
   assert.equal(localized.title,original.title);
   assert.deepEqual(localized.sections,original.sections);
   const schema=renderedArticle(localized);
   assert.equal(schema.inLanguage,'en');
   assert.equal(schema.headline,original.title);
   assert.equal(JSON.stringify(original),before);
  });
 }
}

test('English selection remains English even when reviewed translations exist',()=>{
 const original=reviewed(reviewed(article(),'hi'),'gu');
 const localized=localizeEditorialContent(original,'en');
 assert.equal(localized.title,'A room');
 assert.equal(localized.contentLanguage,'en');
 assert.equal(renderedArticle(localized).inLanguage,'en');
});

test('captured cards use only the labels saved with their revision, preserving English fallback and crops',()=>{
 const original=reviewed(article(),'gu');
 const captured={...article(),localizedCopy:reviewedArticleLabels(original),imagePosition:'30% 60%'};
 const legacy={...article(),id:'DB002',route:'/journal/legacy',title:'Legacy English'};
 const snapshot={schemaVersion:1,articles:[captured,legacy],products:[],categories:[],mediaPaths:['/media/scene.webp'],dependencies:[{kind:'content',key:'DB001',version:2}],issues:[]};
 const before=JSON.stringify(snapshot);
 original.translations.gu.fields.title='A later unreviewed draft';
 const localized=localizeSnapshot(snapshot,'gu');
 const localizedCards=localized.articles.map(value=>({...value,contentLanguage:capturedEditorialLanguage(value,'gu')}));
 assert.equal(localizedCards[0].contentLanguage,'gu');
 assert.equal(localizedCards[0].title,'ગુજરાતી A room');
 assert.equal(localizedCards[0].imagePosition,'30% 60%');
 assert.equal(renderedArticle(localizedCards[0]).inLanguage,'gu');
 assert.equal(localizedCards[1].contentLanguage,'en');
 assert.equal(localizedCards[1].title,'Legacy English');
 assert.equal(renderedArticle(localizedCards[1]).inLanguage,'en');
 assert.equal(capturedEditorialLanguage(captured,'hi'),'en');
 assert.equal(capturedEditorialLanguage(captured,'en'),'en');
 assert.deepEqual(localized.dependencies,snapshot.dependencies);
 assert.equal(JSON.stringify(snapshot),before);
});

test('metadata never infers translation from translations attached to an unlocalized saved revision',()=>{
 const original=reviewed(article(),'hi');
 assert.equal(renderedArticle(original).inLanguage,'en');
 assert.equal(renderedArticle(original).headline,'A room');
});

test('editorial JSON-LD keeps administrator-supplied markup inside one escaped script element',()=>{
 const document={...article(),title:'A room </script><script>alert(1)</script>'};
 assert.equal(renderedArticle(document).headline,document.title);
});
