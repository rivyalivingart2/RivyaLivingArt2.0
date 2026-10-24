import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {localApi,origin} from '../phase3/local-api.mjs';
const checks=[];
async function check(name,run){await run();checks.push(name);}
const {request,api}=await localApi();
const targetFile='test-results/exact-legacy-2026-10-21/phase4/test-selection-private.json';
if(!existsSync(targetFile)){
 const hashes=new Set((await api('/api/studio/editorial-assets')).media.map(e=>e.media.editorial.sha256));
 const selection=JSON.parse(readFileSync('test-results/exact-legacy-2026-10-21/phase3-website-selection/selection-private.json'));
 const image=[6,7,8,...selection.images.map(i=>i.index)].map(index=>selection.images.find(i=>i.index===index)).find(i=>!hashes.has(i.variants.find(v=>v.width===1600).sha256));
 assert.ok(image,'A new selected draft is needed to test metadata without touching an existing record');
 writeFileSync(targetFile,JSON.stringify({index:image.index}));
}
const {index}=JSON.parse(readFileSync(targetFile));
await check('anonymous subscriber and selected-media reads require login',async()=>{for(const path of ['/api/studio/subscribers','/api/studio/owner-creations'])assert.equal((await fetch(origin+path)).status,401);});
await check('invalid filters are rejected',async()=>{for(const suffix of ['page=0','source=archive','from=2026-02-29','from=2026-10-25&to=2026-10-24','format=html'])assert.equal((await request('/api/studio/subscribers?'+suffix)).status,400);});
const email='phase4-local-capture@example.invalid',formula='=phase4-local-csv@example.invalid';
await check('local public newsletter captures and deduplicates two synthetic test signups',async()=>{for(const value of [email,email,formula]){const response=await request('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:value,source:value===email?'footer':'journal',honeypot:''})});assert.equal(response.status,200);}});
let list;
await check('saved subscribers reload, search and sort',async()=>{list=await api('/api/studio/subscribers?q=phase4-local&sort=email');assert.equal(list.total,2);assert.equal(list.rows.length,2);assert.deepEqual(list.rows.map(r=>r.email),[formula,email]);assert.ok(list.rows.every(r=>Number.isFinite(Date.parse(r.createdAt))));});
await check('source filter and out-of-range pagination retain correct counts',async()=>{const value=await api('/api/studio/subscribers?q=phase4-local&source=footer&page=9999999');assert.equal(value.total,1);assert.equal(value.page,1);assert.equal(value.rows[0].email,email);});
await check('empty and literal wildcard searches are not SQL patterns',async()=>{for(const q of ['phase4-never-created','%','_']){const value=await api('/api/studio/subscribers?q='+encodeURIComponent(q));assert.equal(value.total,0);assert.deepEqual(value.rows,[]);}});
await check('UTC date filter includes saved date and excludes prior dates',async()=>{const day=list.rows[0].createdAt.slice(0,10);assert.equal((await api('/api/studio/subscribers?q=phase4-local&from='+day+'&to='+day)).total,2);assert.equal((await api('/api/studio/subscribers?q=phase4-local&to=2000-01-01')).total,0);});
await check('filtered CSV downloads all matching records with formula protection',async()=>{const response=await request('/api/studio/subscribers?q=phase4-local&page=999&format=csv');assert.match(response.headers.get('content-disposition'),/^attachment;/);assert.equal(response.headers.get('cache-control'),'private, no-store');const csv=await response.text();assert.ok(csv.includes('"\'=phase4-local-csv@example.invalid"'));assert.equal(csv.trim().split('\r\n').length,3);});
await check('selected collection exposes all 169 selected image identities',async()=>{const value=await api('/api/studio/owner-creations');assert.equal(value.images.length,169);assert.equal(new Set(value.images.map(i=>i.index)).size,169);});
await check('media creation rejects external origins and arbitrary file or product input',async()=>{assert.equal((await request('/api/studio/owner-creations',{method:'POST',headers:{Origin:'https://example.invalid','Content-Type':'application/json'},body:'{"index":6}'})).status,404);for(const body of [{index:0},{index:170},{index:'6'},{index:6,path:'../../secret'},{index:6,products:['new']}])await api('/api/studio/owner-creations',body,400);});
let path;
await check('simultaneous selected image preparation reuses one draft',async()=>{const values=await Promise.all([api('/api/studio/owner-creations',{index}),api('/api/studio/owner-creations',{index})]);assert.equal(values[0].path,values[1].path);path=values[0].path;assert.ok(values.some(r=>r.reused));});
let entry;
await check('prepared selected image has original lineage, no products and no publication',async()=>{const values=(await api('/api/studio/editorial-assets')).media;entry=values.find(v=>v.media.path===path);assert.ok(entry);assert.equal(entry.published,null);assert.deepEqual(entry.media.products,[]);assert.equal(entry.media.editorial.classification,'design-visualization');assert.equal(entry.media.editorial.edit.method,'ai-edit');assert.equal(entry.media.editorial.width,1600);assert.equal(entry.media.editorial.height,2000);assert.deepEqual(entry.media.editorial.derivatives.map(d=>[d.width,d.height]),[[640,800],[960,1200],[1600,2000]]);});
await check('private Studio preview serves the exact selected 960-pixel export',async()=>{const response=await request('/api/studio/editorial-assets/image?id='+entry.media.editorial.id);assert.equal(response.status,200);const digest=createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');assert.equal(digest,entry.media.editorial.derivatives[1].sha256);const selected=await fetch(origin+'/api/local-creations/'+String(index).padStart(3,'0')+'/960');assert.equal(createHash('sha256').update(Buffer.from(await selected.arrayBuffer())).digest('hex'),digest);});
await check('new metadata draft persists and stale version cannot overwrite it',async()=>{
 const body={path,version:entry.version,operation:'draft',alt:'Owner-selected photo keepsake on ocean and champagne background',caption:'AI-enhanced design visualization',provenance:entry.media.provenance,classification:'design-visualization',reviewNote:'Local presentation draft only. This does not verify photographed people, lettering or customer review claims.'};
 await api('/api/studio/editorial-assets',body);await api('/api/studio/editorial-assets',body,409);
 const saved=(await api('/api/studio/editorial-assets')).media.find(v=>v.media.path===path);assert.equal(saved.media.alt,body.alt);assert.equal(saved.version,entry.version+1);assert.equal(saved.published,null);
 await api('/api/studio/owner-creations',{index});const reused=(await api('/api/studio/editorial-assets')).media.find(v=>v.media.path===path);assert.deepEqual(reused,saved);
});
await check('unpublished selected Studio draft is not exposed through the public editorial route',async()=>{assert.equal((await fetch(origin+path)).status,404);});
const receipt={at:new Date().toISOString(),buildId:readFileSync('.next/BUILD_ID','utf8').trim(),checks,passed:checks.length,scope:'GUARDED_LOCAL_ONLY',productsAdded:0,archivedImports:0,publication:0};
writeFileSync('test-results/exact-legacy-2026-10-21/phase4/workflows.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
