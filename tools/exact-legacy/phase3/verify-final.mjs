/** Read-only delivery/format verification against the final guarded local build. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {unzipSync} from 'fflate';
import sharp from 'sharp';
import {localApi,origin} from './local-api.mjs';
const root='test-results/exact-legacy-2026-10-21/phase3-implementation';
const read=name=>JSON.parse(readFileSync(root+'/'+name,'utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const {registered,videoKey}=read('registered-assets-private.json'),prepared=read('prepared-media-private.json');
const checks=[],pass=(name,condition)=>{assert.ok(condition,name);checks.push(name);};
const {api,request}=await localApi();
const assets=await api('/api/studio/editorial-assets'),files=await api('/api/studio/editorial-extensions');
pass('All 14 retained owner image drafts present',registered.length===14&&registered.every(r=>assets.media.some(e=>e.media.path===r.path&&!e.published&&e.media.products.length===0)));
pass('No category or file metadata published',files.entries.every(e=>!e.published));
pass('Anonymous metadata blocked',(await fetch(origin+'/api/studio/editorial-extensions')).status===401);
pass('Cross-origin mutations blocked',(await request('/api/studio/editorial-extensions',{method:'POST',headers:{Origin:'https://untrusted.invalid','Content-Type':'application/json'},body:'{}'})).status===403);
for(const r of prepared.records){
 pass('Immutable prepared source '+r.index,hash(readFileSync(root+'/'+r.path))===r.sha256);
 const saved=registered.find(v=>v.index===r.index);pass('Unpublished public image '+r.index,(await fetch(origin+saved.path)).status===404);
 if(r.selectedBranded){
  const entry=assets.media.find(e=>e.media.path===saved.path),id=entry.media.editorial.id;
  const preview='/api/studio/editorial-assets/image?id='+id;
  pass('Anonymous private image denied '+r.index,(await fetch(origin+preview)).status===401);
  const response=await request(preview),bytes=Buffer.from(await response.arrayBuffer()),meta=await sharp(bytes).metadata();
  pass('Authenticated portrait derivative '+r.index,response.status===200&&meta.width/meta.height===.8);
  pass('Original parent provenance '+r.index,entry.media.editorial.edit.parentSha256===r.parentSha256&&entry.media.editorial.classification==='design-visualization');
 }
}
pass('Unpublished film delivery denied',(await fetch(origin+'/editorial-file/'+videoKey)).status===404);
pass('Anonymous film preview denied',(await fetch(origin+'/editorial-file/'+videoKey+'?preview=1')).status===401);
const range=await request('/editorial-file/'+videoKey+'?preview=1',{headers:{Range:'bytes=0-63'}});
pass('Authenticated film seeking',range.status===206&&(await range.arrayBuffer()).byteLength===64);
const archive=readFileSync(root+'/rivya-ocean-product-images.zip'),entries=unzipSync(archive);
pass('ZIP contains six JPEG and eighteen WebP files',Object.keys(entries).filter(p=>p.endsWith('.jpg')).length===6&&Object.keys(entries).filter(p=>p.endsWith('.webp')).length===18);
for(const [name,bytes] of Object.entries(entries))if(/\.(jpg|webp)$/.test(name)){
 const match=/(\d+)x(\d+)\.(jpg|webp)$/.exec(name),meta=await sharp(bytes).metadata();
 pass('Export dimensions '+name,meta.width===Number(match[1])&&meta.height===Number(match[2])&&meta.width/meta.height===.8);
 pass('ZIP matches saved export '+name,hash(bytes)===hash(readFileSync(root+'/product-image-pack/'+name)));
}
const download=await fetch('http://127.0.0.1:4214/rivya-ocean-product-images.zip');
pass('Preview download serves the exact verified archive',download.status===200&&hash(Buffer.from(await download.arrayBuffer()))===hash(archive));
const receipt={at:new Date().toISOString(),buildId:readFileSync('.next/BUILD_ID','utf8').trim(),passed:checks.length,failures:0,checks,productsAdded:0,archivedImports:0,publications:0,productionAccess:false};
writeFileSync(root+'/final-delivery-verification.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify({buildId:receipt.buildId,passed:checks.length,failures:0}));
