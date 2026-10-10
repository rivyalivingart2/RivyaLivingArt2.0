import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {localApi} from './local-api.mjs';
assert.equal(globalThis.__rivyaMigrationLocalSql,true);
const root='docs/editorial-production/m9/',copies=JSON.parse(await readFile(root+'drive-media.json','utf8')),observations=JSON.parse(await readFile(root+'image-observations.json','utf8'));
const {api,request}=await localApi(),files=await readdir('test-results/old-design-migration/m9/sources');
const entries=[];
for(const c of copies){
 const filename=files.find(f=>f.startsWith(c.key+'-'));assert.ok(filename);
 const bytes=await readFile('test-results/old-design-migration/m9/sources/'+filename);
 const upload=await request('/api/studio/editorial-assets',{method:'PUT',headers:{'x-drive-file-id':c.id,'x-file-name':encodeURIComponent(filename),'Content-Type':c.mimeType},body:bytes});
 const result=await upload.json();assert.equal(upload.status,200,JSON.stringify(result));let entry=result.entry;
 assert.equal(entry.media.editorial.sha256,createHash('sha256').update(bytes).digest('hex'));
 // A retry reuses the identical hash and never overwrites source bytes.
 if(!entry.published){
  const reviewed=await api('/api/studio/editorial-assets',{path:entry.media.path,version:entry.version,operation:'review',alt:observations[c.key],caption:'Design visualization — reference only, not a completed customer project.',provenance:`Owner-supplied Drive reference ${c.sourceId}; M9 copy ${c.id}. Original associations unchanged.`,classification:'design-visualization',reviewNote:'Codex AI visual inspection, 9 October 2026: observed the supplied image; no customer, installation or material-performance claim. Isolated local preview approval only. Owner rights and final crop approval remain pending.'});
  await api('/api/studio/editorial-assets',{path:entry.media.path,version:reviewed.version,operation:'publish'});
 }
 const current=(await api('/api/studio/editorial-assets')).media.find(m=>m.media.path===entry.media.path);assert.ok(current?.published);
 for(const w of [640,960,1600]){const response=await request(current.media.path+'?width='+w);assert.equal(response.status,200);const data=Buffer.from(await response.arrayBuffer());assert.equal(createHash('sha256').update(data).digest('hex'),current.media.editorial.derivatives[[640,960,1600].indexOf(w)].sha256);}
 entries.push({key:c.key,sourceDriveId:c.sourceId,deliveryDriveId:c.id,path:current.media.path,version:current.version,alt:observations[c.key],metadata:current.media.editorial,localOnly:true,ownerRightsApproval:'Pending',cropApproval:'Pending'});
 await writeFile(root+'media-manifest.json',JSON.stringify(entries,null,2)+'\n');console.log(JSON.stringify({key:c.key,localMedia:current.media.path,hashVerified:true}));
}
