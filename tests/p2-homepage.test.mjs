import {test} from 'node:test';
import assert from 'node:assert/strict';
import {homeCandidate,validHomeHref,previewHref} from '../src/lib/homepage-model.ts';
import {baselineContent,validContent} from '../src/lib/content-model.ts';
import {baselineProducts} from '../src/lib/shop-model.ts';
import {approvedPublicMedia} from '../src/lib/public-media.ts';
import {compileHomepageSnapshot} from '../src/lib/homepage-dependencies.ts';
import {contentDifferences} from '../src/lib/content-diff.ts';
const row=(key,document)=>({key,document,version:1,fingerprint:'checked-'+key});
const source=()=>({products:baselineProducts.map(p=>row(p.id,p)),content:baselineContent.filter(d=>d.id!=='page:home').map(d=>row(d.id,d)),media:approvedPublicMedia.map(m=>row(m.path,m))});
test('only the registered homepage may use the root route',()=>{
 assert.equal(validContent(homeCandidate,homeCandidate),true);
 assert.equal(validContent({...homeCandidate,id:'page:other'},{...homeCandidate,id:'page:other'}),false);
 assert.equal(validContent({...homeCandidate,homepage:undefined},homeCandidate),false);
 assert.equal(validContent(homeCandidate),false);
});
test('homepage validation rejects malformed blocks, unsafe links and invalid crops without throwing',()=>{
 const bads=[d=>d.homepage.primary.href='javascript:alert(1)',d=>d.homepage.sections[2].image.mobile.x=101,d=>d.homepage.sections[2].image.path='/private/secret.jpg',d=>d.homepage.sections[3].items=[null],d=>d.homepage.sections[0].id='missing',d=>d.homepage.sections[0].productIds=['DP001','DP001'],d=>d.sections[0].paragraphs=['<script>alert(1)</script>'],d=>d.homepage.sections[0].type='html',d=>d.homepage.sections.push(d.homepage.sections[0])];
 for(const mutate of bads){const d=structuredClone(homeCandidate);mutate(d);assert.equal(validContent(d,homeCandidate),false);}
 for(const href of ['//evil.test','https://evil.test','/studio?token=x','/foo%0a','/foo/../bar'])assert.equal(validHomeHref(href),false);
 assert.equal(validHomeHref('/materials-care#care'),true);
});
test('snapshot contains only published public fields and leaves every protected input unchanged',()=>{
 const data=source();data.products[0].document={...data.products[0].document,privateNotes:'never render'};const before=JSON.stringify(data);
 const result=compileHomepageSnapshot(homeCandidate,data);
 assert.deepEqual(result.issues,[]);assert.ok(result.products.length>=3);assert.equal(JSON.stringify(result).includes('never render'),false);
 assert.equal(result.products.some(p=>p.fields),false);assert.equal(JSON.stringify(data),before);
 assert.ok(result.dependencies.some(d=>d.kind==='media'&&d.key==='/media/product-hero-026-4x5.webp'));
});
test('missing references and unknown CTA anchors block publication but remain repairable in drafts',()=>{
 const d=structuredClone(homeCandidate);d.homepage.heroProductId='MISSING';d.homepage.primary.href='/unpublished';d.homepage.secondary.href='/materials-care#missing';d.homepage.sections.find(s=>s.type==='journal').articleIds=['not-published'];
 const data=source();data.media=data.media.filter(m=>m.key!=='/media/product-hero-026-4x5.webp');
 assert.equal(validContent(d,homeCandidate),true);
 const issues=compileHomepageSnapshot(d,data).issues.join(' ');
 for(const term of ['MISSING','unpublished','missing section','not-published','image is not published'])assert.ok(issues.includes(term),term);
});
test('an editorial crop changes only its own usage and does not change global media or product membership',()=>{
 const d=structuredClone(homeCandidate),before=JSON.stringify(approvedPublicMedia);d.homepage.sections[2].image.mobile={x:72,y:36,ratio:'1/1'};
 assert.deepEqual(d.homepage.sections[2].image.desktop,{x:50,y:50,ratio:'4/5'});compileHomepageSnapshot(d,source());assert.equal(JSON.stringify(approvedPublicMedia),before);
});
test('hidden optional chapters do not require their missing references',()=>{
 const d=structuredClone(homeCandidate);d.homepage.sections[0].enabled=false;d.homepage.sections[0].productIds=['missing'];assert.deepEqual(compileHomepageSnapshot(d,source()).issues,[]);
});

test('public dependencies honor withdrawal while the saved preview snapshot stays unchanged',()=>{
 const d=structuredClone(homeCandidate),data=source(),article=data.content.find(r=>r.document.kind==='article');
 d.homepage.sections.find(s=>s.type==='journal').articleIds=[article.key];d.homepage.secondary={label:'Read the story',href:article.document.route};
 const saved=compileHomepageSnapshot(d,data),before=JSON.stringify(saved),hero=d.homepage.heroProductId;
 data.products=data.products.filter(r=>r.key!==hero);data.content=data.content.filter(r=>r.key!==article.key);data.media=data.media.filter(r=>r.key!==d.homepage.sections[2].image.path);
 const current=compileHomepageSnapshot(d,data);
 assert.ok(saved.products.some(p=>p.id===hero));assert.ok(!current.products.some(p=>p.id===hero));assert.equal(current.articles.length,0);
 assert.ok(!current.mediaPaths.includes(d.homepage.sections[2].image.path));assert.ok(current.unavailableActionHrefs.includes(article.document.route));assert.equal(JSON.stringify(saved),before);
});
test('diff preserves section identity and reports order, crop and reference changes',()=>{
 const d=structuredClone(homeCandidate);d.homepage.sections.reverse();d.homepage.sections.find(s=>s.id==='material').image.mobile.x=80;d.homepage.sections.find(s=>s.id==='selected').productIds.reverse();d.homeSnapshot={privateNotes:'not an editorial difference'};
 const fields=contentDifferences(homeCandidate,d).map(d=>d.field);
 assert.ok(fields.includes('homepage.sections.order'));assert.ok(fields.includes('homepage.sections.material.image.mobile.x'));assert.ok(fields.includes('homepage.sections.selected.productIds'));assert.ok(!fields.some(f=>f.startsWith('homeSnapshot')));
 assert.equal(previewHref('page:home',5,true),'/studio/preview?record=page%3Ahome&version=5&viewport=mobile');
});
