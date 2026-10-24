/** Register selected, inspected edits as private drafts only on the guarded loopback Studio. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {localApi,origin} from './local-api.mjs';
const root='test-results/exact-legacy-2026-10-21/phase3-implementation';
const prepared=JSON.parse(readFileSync(root+'/prepared-media-private.json','utf8'));
const receipt=JSON.parse(readFileSync(root+'/registered-assets-private.json','utf8'));
const {api,request}=await localApi();let checks=0;
for(const r of prepared.records.filter(r=>r.selectedBranded)){
 assert.equal(r.width,1600);assert.equal(r.height,2000);assert.equal(r.assignment,null);assert.equal(r.publicationApproved,false);
 const response=await request('/api/studio/editorial-assets',{method:'PUT',headers:{'X-Drive-File-Id':r.driveId,'X-File-Name':encodeURIComponent(r.filename),'Content-Type':'image/png','X-Editorial-Parent-Sha256':r.parentSha256,'X-Editorial-Edit-Note':encodeURIComponent(r.description)},body:readFileSync(resolve(root,r.path))});
 const data=await response.json();assert.equal(response.status,200,data.error);const entry=data.entry;
 const saved=receipt.registered.find(v=>v.index===r.index);
 if(saved){assert.equal(entry.media.path,saved.path);assert.equal(entry.media.editorial.sha256,r.sha256);assert.equal(data.reused,true);checks++;continue;}
 const updated=await api('/api/studio/editorial-assets',{operation:'draft',path:entry.media.path,version:entry.version,alt:r.alt,caption:'Edited visualization · ocean palette · 4:5',provenance:r.description,classification:'design-visualization',reviewNote:''});
 assert.equal((await fetch(origin+entry.media.path)).status,404);
 await api('/api/studio/editorial-assets',{operation:'draft',path:entry.media.path,version:updated.version,alt:r.alt,caption:'',provenance:r.description,classification:'photography',reviewNote:''},400);
 receipt.registered.push({index:r.index,path:entry.media.path,sha256:r.sha256,version:updated.version,published:false});checks+=3;
 writeFileSync(root+'/registered-assets-private.json',JSON.stringify(receipt,null,2));
}
const report={at:new Date().toISOString(),checks,selectedBrandedDrafts:6,totalOwnerImageDrafts:receipt.registered.length,productsAdded:0,associationsWritten:0,published:0,productionAccess:false};
writeFileSync(root+'/branded-http-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
