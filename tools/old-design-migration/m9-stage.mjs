import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {localApi} from './local-api.mjs';
assert.equal(globalThis.__rivyaMigrationLocalSql,true);
const root='docs/editorial-production/m9/',receiptPath='test-results/old-design-migration/m9/intake-receipts.json';
const {api}=await localApi();let receipts=[];try{receipts=JSON.parse(await readFile(receiptPath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
const refresh=process.argv.includes('--refresh-known-snapshots'),selected=process.argv.slice(2).filter(s=>!s.startsWith('--')),files=(await readdir(root+'batches')).filter(f=>f.endsWith('.json')&&(!selected.length||selected.includes(f))).sort();
for(const file of files){
 const docs=JSON.parse(await readFile(root+'batches/'+file,'utf8'));assert.equal(docs.length,10);
 let found=await Promise.all(docs.map(d=>api('/api/studio/content?record='+encodeURIComponent(d.id)).then(v=>v.entries.find(e=>e.document.id===d.id))));
 if(found.every(e=>!e)){
  const check=await api('/api/studio/content-intake',{mode:'dry-run',documents:docs});assert.equal(check.records.length,10);
  const saved=await api('/api/studio/content-intake',{mode:'create',documents:docs,token:check.token,expires:check.expires});assert.equal(saved.ids.length,10);assert.equal(saved.published,0);
  found=await Promise.all(docs.map(d=>api('/api/studio/content?record='+encodeURIComponent(d.id)).then(v=>v.entries.find(e=>e.document.id===d.id))));
 }else assert.ok(found.every(Boolean),'Partial batch exists; inspect before changing anything: '+file);
 for(let i=0;i<docs.length;i++){
  let entry=found[i];const {pageSnapshot,...document}=entry.document;assert.deepEqual(document,docs[i]);assert.ok(entry.version>=1);assert.equal(entry.publishedVersion,0);assert.equal(entry.visible,false);assert.equal(entry.published,null);
  if(pageSnapshot.issues.length&&refresh){await api('/api/studio/content',{operation:'draft',version:entry.version,document:docs[i]});entry=(await api('/api/studio/content?record='+encodeURIComponent(docs[i].id))).entries.find(e=>e.document.id===docs[i].id);const {pageSnapshot:updated,...copy}=entry.document;assert.deepEqual(copy,docs[i]);assert.deepEqual(updated.issues,[]);}else assert.deepEqual(pageSnapshot.issues,[]);
  const hash=createHash('sha256').update(JSON.stringify(docs[i])).digest('hex');
  const prior=receipts.find(r=>r.id===docs[i].id);if(prior)assert.equal(prior.hash,hash);const receipt={id:docs[i].id,batch:file,hash,version:entry.version,publishedVersion:0,visible:false,snapshotIssues:entry.document.pageSnapshot.issues,verifiedAt:new Date().toISOString(),target:'isolated-local-only'};if(prior)Object.assign(prior,receipt);else receipts.push(receipt);
 }
 await writeFile(receiptPath,JSON.stringify(receipts,null,2)+'\n');console.log(JSON.stringify({batch:file,verifiedDrafts:10,total:receipts.length,published:0}));
}
