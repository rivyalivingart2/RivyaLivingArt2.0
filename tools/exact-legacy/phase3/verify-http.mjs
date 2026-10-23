import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {target,verifyDatabase} from '../local-guard.mjs';
import {localApi,origin} from './local-api.mjs';
import {materialFilm} from '../../../src/lib/presentation-media.ts';
const root='test-results/exact-legacy-2026-10-21/phase3-implementation',checks=[];
const pass=(name,ok=true)=>{assert.ok(ok,name);checks.push(name);};
const {api,request}=await localApi();
const anonymous=await fetch(origin+'/api/studio/editorial-extensions');pass('Anonymous extension access rejected',anonymous.status===401);
pass('Cross-origin extension writes rejected',(await request('/api/studio/editorial-extensions',{method:'POST',headers:{Origin:'https://untrusted.invalid','Content-Type':'application/json'},body:'{}'})).status===403);
const initial=await api('/api/studio/editorial-extensions'),assets=await api('/api/studio/media'),category=initial.categories.find(c=>!initial.entries.some(e=>e.document.kind==='category'&&e.document.key===c));assert.ok(category,'Choose an unused current category for isolated rehearsal');
const approved=assets.media.filter(r=>r.published).map(r=>r.published),m=approved[0],mobile=approved[1];
const image={path:m.path,mobilePath:mobile.path,alt:'Local contract rehearsal image',caption:'Design visualization',desktop:{x:35,y:45,ratio:'4/3'},mobile:{x:65,y:55,ratio:'3/4'}};
const document={schemaVersion:1,kind:'category',key:category,description:'Local-only verification draft. No product records changed.',image,seoTitle:category};
const one=await api('/api/studio/editorial-extensions',{operation:'draft',version:0,document});pass('Category draft saved only for an existing category',one.version===1);
await api('/api/studio/editorial-extensions',{operation:'draft',version:0,document},409);pass('Repeated create cannot duplicate category metadata');
await api('/api/studio/editorial-extensions',{operation:'draft',version:0,document:{...document,key:'__NOT_A_CURRENT_CATEGORY__'}},409);pass('New category membership cannot be fabricated');
await api('/api/studio/editorial-extensions',{operation:'draft',version:1,document:{...document,image:{...image,mobilePath:'/editorial/00000000-0000-0000-0000-000000000000'}}},400);pass('Unpublished mobile image rejected');
await api('/api/studio/editorial-extensions',{operation:'draft',version:1,document:{...document,description:'Second local-only draft'}});
await api('/api/studio/editorial-extensions',{operation:'draft',version:1,document},409);pass('Stale edit cannot overwrite newer metadata');
const restored=await api('/api/studio/editorial-extensions',{operation:'restore',version:2,restoredFrom:1,document});pass('Server restores exact historical revision as a new draft',restored.version===3&&restored.document.description===document.description);
const history=await api('/api/studio/editorial-extensions?kind=category&key='+encodeURIComponent(category));pass('Revision history records create edit and recovery',history.revisions.length===3);
const preparation=JSON.parse(readFileSync(root+'/prepared-media-private.json','utf8')),registered=[];
for(const r of preparation.records){
 const headers={'X-Drive-File-Id':r.driveId,'X-File-Name':encodeURIComponent(r.filename),'Content-Type':'image/'+r.actualFormat,...(r.parentSha256?{'X-Editorial-Parent-Sha256':r.parentSha256,'X-Editorial-Edit-Note':encodeURIComponent(r.description)}:{})},bytes=readFileSync(resolve(root,r.path));
 let response=await request('/api/studio/editorial-assets',{method:'PUT',headers,body:bytes});let data=await response.json();assert.equal(response.status,200,data.error);const entry=data.entry;
 response=await request('/api/studio/editorial-assets',{method:'PUT',headers,body:bytes});data=await response.json();assert.equal(response.status,200);assert.equal(data.reused,true);assert.equal(data.entry.media.path,entry.media.path);
 const saved=await api('/api/studio/editorial-assets',{operation:'draft',path:entry.media.path,version:entry.version,alt:r.alt,caption:r.parentPath?'Edited visualization · private candidate':'Owner creation · private candidate',provenance:r.description,classification:r.classification,reviewNote:''});
 if(r.parentPath)await api('/api/studio/editorial-assets',{operation:'draft',path:entry.media.path,version:saved.version,alt:r.alt,caption:'',provenance:r.description,classification:'photography',reviewNote:''},400);
 pass('Owner asset '+r.index+' retained privately; exact replay reused original');
 registered.push({index:r.index,path:entry.media.path,sha256:r.sha256,version:saved.version,published:false});
 pass('Owner asset '+r.index+' is not publicly delivered',(await fetch(origin+entry.media.path)).status===404);
}
const video=materialFilm.sources.find(v=>v.type==='video/mp4'),videoBytes=readFileSync('public'+video.path);
const response=await request('/api/studio/editorial-extensions',{method:'PUT',headers:{'X-Drive-File-Id':video.driveId,'X-File-Name':'local-material-film.mp4','Content-Type':video.type},body:videoBytes});const uploaded=await response.json();assert.equal(response.status,200,uploaded.error);const motion=uploaded.entry;
pass('Known material film stored as an unreviewed private draft',motion.document.kind==='video'&&!motion.published);
await api('/api/studio/editorial-extensions',{operation:'publish',version:motion.version,document:motion.document},400);pass('Unreviewed film publication rejected');
pass('Anonymous private preview rejected',(await fetch(origin+'/editorial-file/'+motion.document.key+'?preview=1')).status===401);
pass('Unpublished film public delivery rejected',(await fetch(origin+'/editorial-file/'+motion.document.key)).status===404);
const range=await request('/editorial-file/'+motion.document.key+'?preview=1',{headers:{Range:'bytes=0-63'}});pass('Authenticated film range delivery supports seeking',range.status===206&&(await range.arrayBuffer()).byteLength===64);
pass('Invalid film range rejected',(await request('/editorial-file/'+motion.document.key+'?preview=1',{headers:{Range:'bytes=999999999-'}})).status===416);
const sourceCopy={...motion.document,title:'Private material illustration',description:'Existing material visualization retained for local playback verification.',poster:image,transcript:'Silent material visualization of blue resin and gold-toned pigment.',classification:'design-visualization',reviewNote:'Local delivery verification only. This does not approve business publication.'};
const saved=await api('/api/studio/editorial-extensions',{operation:'draft',version:motion.version,document:sourceCopy});
await api('/api/studio/editorial-extensions',{operation:'draft',version:saved.version,document:{...sourceCopy,source:{...sourceCopy.source,sha256:'f'.repeat(64)}}},400);pass('Original film identity cannot be rewritten');
// The category probe owns only newly created local rows. Remove it transactionally,
// preserving owner media drafts and all pre-existing rows, including publications.
const config=JSON.parse(readFileSync('test-results/exact-legacy-2026-10-21/runtime/config.json','utf8')),{default:pg}=await import(pathToFileURL(config.pgModule).href),db=new pg.Client(target);
try{await db.connect();await verifyDatabase(db);await db.query('BEGIN');await db.query('DELETE FROM rivya_editorial_extension_revisions WHERE kind=$1 AND entity_key=$2',['category',category]);await db.query('DELETE FROM rivya_editorial_extensions WHERE kind=$1 AND entity_key=$2 AND version=3 AND published IS NULL',['category',category]);await db.query('COMMIT');}finally{await db.end();}
pass('Temporary category rehearsal removed; current data unchanged');
writeFileSync(root+'/registered-assets-private.json',JSON.stringify({registered,videoKey:motion.document.key},null,2));
const receipt={at:new Date().toISOString(),scope:'loopback-only',buildId:readFileSync('.next/BUILD_ID','utf8').trim(),checks,passed:checks.length,failures:0,ownerMediaDrafts:registered.length,fileDrafts:1,productsAdded:0,archivedImports:0,published:0,productionAccess:false};
writeFileSync(root+'/http-verification.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
