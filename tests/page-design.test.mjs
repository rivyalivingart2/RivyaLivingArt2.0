import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {defaultPageDesign,validPageDesigns,pageDesignSource,pageDesignIssues,makingSlots,materialSlots,designPages} from '../src/lib/page-design-model.ts';
import {defaultHomepageLayout,validHomepageLayout,presentationPreviewHref} from '../src/lib/presentation-model.ts';
import {materialFilm,validSavedFilm} from '../src/lib/presentation-media.ts';
import {baselineContent} from '../src/lib/content-model.ts';
import {baselineProducts} from '../src/lib/shop-model.ts';
import {approvedPublicMedia} from '../src/lib/public-media.ts';
import {compileHomeReference} from '../src/lib/home-reference-dependencies.ts';
import {discoveryPreviewUrl} from '../src/lib/discovery-preview-url.ts';
import {defaultWorkshopTemplate,validServiceTemplates,workshopSlots} from '../src/lib/service-template-model.ts';
const row=(key,document)=>({key,document,version:1,fingerprint:'checked-'+key});
const source=()=>({products:baselineProducts.map(p=>row(p.id,p)),content:baselineContent.map(d=>row(d.id,d)),media:approvedPublicMedia.map(m=>row(m.path,m))});

test('page layouts accept only finite presentation choices, never content or coercible arrays',()=>{
 const pages=Object.fromEntries(designPages.map(p=>[p.route,defaultPageDesign(p.route)]));
 assert.equal(validPageDesigns(pages),true);assert.equal(validHomepageLayout({...defaultHomepageLayout,pages,film:'resin-pour'}),true);
 for(const patch of [{hero:['split']},{chapters:['numbered']},{text:'new words'},{styles:{section:'<script>'}},{shared:['process','process']},{film:'https://example.com/video.mp4'}])assert.equal(validPageDesigns({'/our-story':{...defaultPageDesign('/our-story'),...patch}}),false);
 assert.equal(validPageDesigns({'/privacy':defaultPageDesign('/our-story')}),false);
 assert.equal(validPageDesigns({'/contact':{...defaultPageDesign('/contact'),shared:['materials']}}),false);
});
test('the ten making and four material slots cannot fabricate evidence or reuse customer steps',()=>{
 assert.equal(makingSlots.length,10);assert.equal(materialSlots.length,4);
 const d=pageDesignSource(baselineContent.find(d=>d.route==='/process')),id=d.sections[0].id;
 assert.equal(pageDesignIssues({...defaultPageDesign('/process'),bindings:{concept:id}},d).length,1);
 const capable={...d,sections:d.sections.map(s=>({...s,stage:'making'}))};
 assert.deepEqual(pageDesignIssues({...defaultPageDesign('/process'),bindings:{concept:id}},capable),[]);
 assert.equal(validPageDesigns({'/process':{...defaultPageDesign('/process'),bindings:{concept:id,casting:id}}}),false);
 const m=pageDesignSource(baselineContent.find(d=>d.route==='/materials-care'));
 assert.equal(pageDesignIssues({...defaultPageDesign('/materials-care'),bindings:{'epoxy-resin':m.sections[0].id}},m).length,1);
});
test('page design captures preserve originals and include actual commission catalogue only when selected',()=>{
 const data=source(),before=JSON.stringify(data),pages=Object.fromEntries(designPages.map(p=>[p.route,defaultPageDesign(p.route)]));
 const captured=compileHomeReference(data,pages);assert.equal(JSON.stringify(data),before);assert.deepEqual(captured.issues,[]);
 assert.equal(captured.pages.length,7);assert.equal(captured.pages.find(p=>p.document.route==='/commission').document.pageSnapshot.products.length,120);
 for(const p of captured.pages){const old=data.content.find(r=>r.key===p.document.id).document;assert.deepEqual(p.document.sections,old.sections);assert.deepEqual(p.document.translations,old.translations);assert.deepEqual(p.document.headerImage,old.headerImage);}
 const withdrawn={...data,content:data.content.filter(r=>r.document.route!=='/process')};
 assert.ok(compileHomeReference(withdrawn,{'/our-story':defaultPageDesign('/our-story')}).issues.includes('/process: Published page is unavailable.'));
 assert.ok(compileHomeReference(data,{'/process':{...defaultPageDesign('/process'),styles:{missing:'statement'}}}).issues.some(i=>i.includes('no longer published')));
});
test('saved film metadata survives JSONB key ordering and rejects changed source bytes',()=>{
 const reorder=(v)=>Array.isArray(v)?v.map(reorder):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).reverse().map(([k,x])=>[k,reorder(x)])):v;
 assert.equal(validSavedFilm(reorder(materialFilm)),true);
 const changed=structuredClone(materialFilm);changed.sources[0].sha256='0'.repeat(64);assert.equal(validSavedFilm(changed),false);
 for(const file of [materialFilm.poster,...materialFilm.sources]){const bytes=readFileSync('public'+file.path);assert.equal(bytes.length,file.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256);}
});
test('saved mobile page previews retain exact revision, locale and page',()=>{
 const u=new URL(presentationPreviewHref(17,'gu',true,'/process'),'https://example.com');
 assert.equal(u.searchParams.get('version'),'17');assert.equal(u.searchParams.get('locale'),'gu');assert.equal(u.searchParams.get('page'),'/process');assert.equal(u.searchParams.get('viewport'),'mobile');
 for(const path of ['/studio/presentation/preview','/studio/presentation/preview/frame']){
  const params=new URLSearchParams({version:'17',locale:'gu',page:'/commission'});
  const filtered=new URL(discoveryPreviewUrl('/commission?q=river',path,params),'https://example.com');
  assert.equal(filtered.pathname,path);assert.equal(filtered.searchParams.get('version'),'17');assert.equal(filtered.searchParams.get('page'),'/commission');assert.equal(filtered.searchParams.get('locale'),'gu');assert.equal(filtered.searchParams.get('q'),'river');
 }
});
test('private workshop structure has seven source slots and cannot supply dates, pricing or a publish switch',()=>{
 assert.deepEqual(workshopSlots.map(s=>s.key),['hero','facts','why','session','sessions','private','room']);
 assert.equal(validServiceTemplates({workshops:defaultWorkshopTemplate()}),true);
 for(const patch of [{hidden:['hero']},{hidden:['facts','facts']},{hero:['full']},{price:500},{published:true}])assert.equal(validServiceTemplates({workshops:{...defaultWorkshopTemplate(),...patch}}),false);
});
