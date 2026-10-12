import {validHomeEditorial} from '../src/lib/home-editorial-model.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {captureHomeEditorial} from '../src/lib/home-editorial.ts';
import {compileHomeReference,localizeHomeReference} from '../src/lib/home-reference-dependencies.ts';
import {defaultHomepageLayout,validHomepageLayout} from '../src/lib/presentation-model.ts';
import {approvedPublicMedia} from '../src/lib/public-media.ts';
import {translationFields,translationRevision} from '../src/lib/translation-review.ts';

const batch=kind=>JSON.parse(readFileSync(new URL('../docs/editorial-production/m9/batches/'+kind+'-01.json',import.meta.url)));
const row=(document,version=2)=>({key:document.id||document.path,document,version,fingerprint:'saved-'+version+'-'+(document.id||document.path)});
function fixture(){
 const portfolio=batch('portfolio').slice(0,2),testimonial=batch('testimonials')[0],media={...approvedPublicMedia[0],focalX:23,focalY:71};
 for(const d of portfolio){delete d.headerImage;delete d.review;d.image=media.path;d.imageAlt=media.alt;}
 return {portfolio,testimonial,source:{products:[],content:[...portfolio,testimonial].map(d=>row(d)),media:[row(media)]},selection:{portfolio:portfolio.map(d=>d.id).reverse(),testimonials:[testimonial.id]}};
}
function reviewed(d,locale){const fields=Object.fromEntries(translationFields(d).map(f=>[f.path,(locale==='hi'?'हिन्दी ':'ગુજરાતી ')+f.source]));d.translations={...d.translations,[locale]:{fields,reviewedRevision:translationRevision(d,fields)}};}

test('homepage selections are optional, explicit, unique, bounded and validated with the layout',()=>{
 const {selection}=fixture();assert.ok(validHomepageLayout(defaultHomepageLayout));assert.ok(validHomepageLayout({...defaultHomepageLayout,editorial:selection}));
 for(const invalid of [{...selection,portfolio:['page:home']},{...selection,portfolio:Array(4).fill(selection.portfolio[0])},{...selection,testimonials:[selection.testimonials[0],selection.testimonials[0]]},{...selection,automatic:true},{portfolio:[]}])assert.equal(validHomeEditorial(invalid),false);
 assert.ok(validHomeEditorial({portfolio:[],testimonials:[]}));
});

test('explicit order captures existing crops, labels and public statements without modifying sources',()=>{
 const {source,selection,testimonial}=fixture(),before=JSON.stringify(source),captured=captureHomeEditorial(source,selection);
 assert.deepEqual(captured.issues,[]);assert.deepEqual(captured.portfolio.map(p=>p.id),selection.portfolio);
 assert.equal(captured.portfolio[0].classification,'concept');assert.equal(captured.portfolio[0].image.desktop.x,23);assert.equal(captured.portfolio[0].image.mobile.y,71);
 assert.equal(captured.feedback[0].classification,'fictional-sample');assert.equal(captured.feedback[0].quote,testimonial.sections.find(s=>s.id==='sample').paragraphs[0]);assert.equal(captured.feedback[0].attribution,'');
 assert.equal(captured.feedback[0].href,testimonial.route);assert.equal(captured.dependencies.length,4);assert.equal(captured.mediaPaths.length,1);assert.equal(JSON.stringify(source),before);
 assert.deepEqual(captureHomeEditorial(source).portfolio,[]);assert.deepEqual(captureHomeEditorial(source).feedback,[]);
});

test('unavailable or wrong-kind records and unapproved genuine evidence cannot fill homepage slots',()=>{
 const {source,selection,portfolio}=fixture();source.content=source.content.filter(r=>r.key!==selection.portfolio[0]);
 let captured=captureHomeEditorial(source,selection);assert.equal(captured.portfolio.length,1);assert.equal(captured.issues.length,1);
 assert.equal(captureHomeEditorial(source,{portfolio:selection.testimonials,testimonials:[]}).portfolio.length,0);
 portfolio[0].editorial.classification='genuine';captured=captureHomeEditorial(source,selection);assert.equal(captured.portfolio.length,0);assert.equal(captured.issues.length,2);
});

test('unpublished media blocks publication and cannot leak through a homepage image reference',()=>{
 const {source,selection}=fixture();source.media=[];const captured=captureHomeEditorial(source,selection);
 assert.equal(captured.issues.length,2);assert.ok(captured.portfolio.every(p=>!p.image));assert.deepEqual(captured.mediaPaths,[]);
});

test('saved home references retain exact dependency revisions and current reviewed translations',()=>{
 const {source,selection,portfolio,testimonial}=fixture();reviewed(portfolio[1],'hi');reviewed(testimonial,'hi');
 const snapshot=compileHomeReference(source,{},selection),before=JSON.stringify(snapshot),translated=localizeHomeReference(snapshot,'hi');
 assert.deepEqual(snapshot.issues,[]);assert.notEqual(translated.portfolio[0].title,portfolio[1].title);assert.notEqual(translated.feedback[0].quote,snapshot.feedback[0].quote);assert.deepEqual(translated.portfolio[0].image.desktop,snapshot.portfolio[0].image.desktop);
 assert.deepEqual(localizeHomeReference(snapshot,'gu').feedback,snapshot.feedback);assert.equal(JSON.stringify(translated).includes('reviewedRevision'),false);assert.equal(JSON.stringify(translated).includes('evidence'),false);
 portfolio[1].title='Changed source';source.content.find(r=>r.key===portfolio[1].id).version=3;
 const current=compileHomeReference(source,{},selection);assert.equal(current.dependencies.find(d=>d.key===portfolio[1].id).version,3);assert.equal(localizeHomeReference(current,'hi').portfolio[0].title,'Changed source');
 assert.equal(JSON.stringify(snapshot),before);assert.equal(snapshot.dependencies.find(d=>d.key===portfolio[1].id).version,2);
});

test('empty testimonial prose is held, with no substitute quote or attribution invented',()=>{
 const {source,selection,testimonial}=fixture();testimonial.sections.find(s=>s.id==='sample').paragraphs=[];
 const captured=captureHomeEditorial(source,selection);assert.equal(captured.feedback.length,0);assert.ok(captured.issues.length);
});
