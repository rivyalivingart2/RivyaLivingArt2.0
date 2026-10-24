import test from 'node:test';
import assert from 'node:assert/strict';
import {createDriveDocumentStore} from '../src/lib/google-workspace/drive-documents.ts';
import {buildPublicationBundle,validatePublicationBundle,publishPublication,readPinnedPublication} from '../src/lib/google-workspace/publication-bundle.ts';
const parentId='publication_folder_01',fileId='publication_reserved_01',otherFile='publication_reserved_02';
const asset={id:'media:one',fileId:'approved_media_0001',mimeType:'image/webp',bytes:100,sha256:'a'.repeat(64)};
const input=(version='version:one')=>({version,source:{title:'Published page',draft:'private draft',staff:'private staff'},shell:{logo:'retained-logo'},design:{color:'#08283a'},assets:[asset]});
const policy={authorize:()=>true,projectSource:value=>({title:value.title}),projectShell:value=>value,projectDesign:value=>value,projectAssets:value=>value,validate:bundle=>Object.keys(bundle.source.value).join(',')==='title',verifyAsset:async value=>value.fileId===asset.fileId&&value.sha256===asset.sha256};
function setup(){
 const files=new Map();let active=null;const calls={readPointer:0,cas:0,create:0};
 const io={metadata:async id=>files.has(id)?files.get(id).meta:null,read:async id=>files.get(id).bytes,create:async r=>{calls.create++;if(files.has(r.fileId))throw Error('exists');files.set(r.fileId,{meta:{id:r.fileId,mimeType:r.mimeType,parents:[r.parentId],size:r.bytes.length,trashed:false},bytes:new Uint8Array(r.bytes)});}};
 const documents=createDriveDocumentStore({registrations:[{fileId,parentId,purpose:'publication-bundle',ownerId:'version:one'},{fileId:otherFile,parentId,purpose:'publication-bundle',ownerId:'version:two'}]},io);
 const pointers={read:async()=>{calls.readPointer++;return structuredClone(active);},compareAndSwap:async(expected,next)=>{calls.cas++;if(JSON.stringify(expected)!==JSON.stringify(active))return 'conflict';active=structuredClone(next);return 'committed';}};
 const dependencies={documents,policy:{...policy},pointers};
 return {files,calls,io,documents,pointers,dependencies,get active(){return active;},set active(value){active=value;}};
}

test('trusted policies make explicit public projections and one immutable coherent version',()=>{
 const bundle=buildPublicationBundle(input(),policy);assert.deepEqual(bundle.source.value,{title:'Published page'});
 assert.ok(Object.isFrozen(bundle));assert.ok(Object.isFrozen(bundle.source.value));
 for(const part of ['source','shell','design','assets'])assert.equal(bundle[part].version,bundle.version);
 assert.equal(JSON.stringify(bundle).includes('private staff'),false);
});

test('untrusted, leaking or mixed-version projections are rejected',()=>{
 assert.throws(()=>buildPublicationBundle(input(),{...policy,authorize:()=>false}),{code:'UNAUTHORIZED'});
 assert.throws(()=>buildPublicationBundle(input(),{...policy,projectSource:v=>v}),{code:'INVALID_BUNDLE'});
 const mixed=structuredClone(buildPublicationBundle(input(),policy));mixed.design.version='version:two';assert.throws(()=>validatePublicationBundle(mixed,policy),{code:'INVALID_BUNDLE'});
 assert.throws(()=>buildPublicationBundle({...input(),assets:[{...asset,private:true}]},policy),{code:'INVALID_BUNDLE'});
});

test('verified artifact and asset precede a single expected-pointer commit',async()=>{
 const h=setup(),result=await publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies);
 assert.equal(result.status,'activated');assert.equal(h.active.version,'version:one');assert.equal(h.active.revision,1);assert.equal(h.calls.cas,1);assert.equal(h.files.size,1);
 assert.deepEqual((await readPinnedPublication(h.dependencies)).bundle,result.bundle);
});

test('artifact corruption and unverified assets leave the old active pointer unchanged',async()=>{
 const h=setup();const first=await publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies);const before=structuredClone(h.active);
 h.dependencies.policy.verifyAsset=async()=>false;
 await assert.rejects(publishPublication({input:input('version:two'),fileId:otherFile,expectedPointer:first.pointer},h.dependencies),{code:'ASSET_UNVERIFIED'});
 assert.deepEqual(h.active,before);assert.equal(h.calls.cas,1);
 const broken=setup();broken.io.read=async()=>new Uint8Array([0]);
 const documents=createDriveDocumentStore({registrations:[{fileId,parentId,purpose:'publication-bundle',ownerId:'version:one'}]},broken.io);
 await assert.rejects(publishPublication({input:input(),fileId,expectedPointer:null},{...broken.dependencies,documents}),{code:'ARTIFACT_MISMATCH'});assert.equal(broken.calls.cas,0);assert.equal(broken.active,null);
});

test('wrong reserved purpose/version and stale expected pointer fail before creation',async()=>{
 const h=setup();await assert.rejects(publishPublication({input:input('version:two'),fileId,expectedPointer:null},h.dependencies),{code:'INVALID_BUNDLE'});assert.equal(h.calls.create,0);
 await publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies);
 await assert.rejects(publishPublication({input:input('version:two'),fileId:otherFile,expectedPointer:null},h.dependencies),{code:'POINTER_CONFLICT'});assert.equal(h.calls.create,1);
});

test('explicit atomic no-write outcome verifies that the previous pointer remains active',async()=>{
 const h=setup();await publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies);const before=structuredClone(h.active);
 h.pointers.compareAndSwap=async()=> 'conflict';
 await assert.rejects(publishPublication({input:input('version:two'),fileId:otherFile,expectedPointer:before},h.dependencies),{code:'POINTER_UNAVAILABLE'});assert.deepEqual(h.active,before);
});

test('old read-back after a lost or invalid CAS response stays unknown because a late commit can still apply',async()=>{
 for(const response of ['throw','invalid']){
  const h=setup();await publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies);const before=structuredClone(h.active);let pending;
  h.pointers.compareAndSwap=async(expected,next)=>{pending={expected,next};if(response==='throw')throw Error('provider secret');return 'unexpected-provider-response';};
  await assert.rejects(publishPublication({input:input('version:two'),fileId:otherFile,expectedPointer:before},h.dependencies),error=>error.code==='POINTER_OUTCOME_UNKNOWN'&&!String(error).includes('provider secret'));
  assert.deepEqual(h.active,before);assert.deepEqual(pending.expected,before);
  // The same dispatched CAS can finish after the caller already read the old
  // pointer. Reporting it as definitely uncommitted would have been false.
  if(JSON.stringify(h.active)===JSON.stringify(pending.expected))h.active=structuredClone(pending.next);
  assert.equal(h.active.version,'version:two');assert.equal(h.active.revision,before.revision+1);
 }
});

test('lost commit acknowledgement is recovered and replay does not advance the pointer again',async()=>{
 const h=setup(),cas=h.pointers.compareAndSwap;h.pointers.compareAndSwap=async(a,b)=>{await cas(a,b);throw Error('response lost');};
 const recovered=await publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies);assert.equal(recovered.status,'recovered');
 const replay=await publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies);assert.equal(replay.status,'replayed');assert.equal(h.calls.cas,1);assert.equal(h.calls.create,1);
});

test('unreadable pointer after an ambiguous commit reports unknown, never a fabricated rollback',async()=>{
 const h=setup(),read=h.pointers.read;let attempted=false;
 h.pointers.compareAndSwap=async()=>{attempted=true;throw Error('network lost');};h.pointers.read=async()=>{if(attempted)throw Error('offline');return read();};
 await assert.rejects(publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies),{code:'POINTER_OUTCOME_UNKNOWN'});
});

test('a competing publisher is never overwritten or rolled back after a failed CAS',async()=>{
 const h=setup(),one=await publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies);
 const competing={...one.pointer,revision:3};h.pointers.compareAndSwap=async()=>{h.active=competing;return 'conflict';};
 await assert.rejects(publishPublication({input:input('version:two'),fileId:otherFile,expectedPointer:one.pointer},h.dependencies),{code:'POINTER_CONFLICT'});assert.deepEqual(h.active,competing);
});

test('initial pointer read failure is sanitized and makes no artifact or pointer writes',async()=>{
 const h=setup();h.pointers.read=async()=>{throw Error('private credential in provider');};
 await assert.rejects(publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies),error=>error.code==='POINTER_READ_UNAVAILABLE'&&!String(error).includes('private credential'));
 assert.equal(h.calls.create,0);assert.equal(h.calls.cas,0);
});

test('one request pins one pointer even when it advances before artifact loading finishes',async()=>{
 const h=setup(),one=await publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies);const two=await publishPublication({input:input('version:two'),fileId:otherFile,expectedPointer:one.pointer},h.dependencies);
 h.active=one.pointer;let reads=0;h.pointers.read=async()=>{reads++;const pinned=structuredClone(h.active);h.active=two.pointer;return pinned;};
 const result=await readPinnedPublication(h.dependencies);assert.equal(reads,1);assert.equal(result.pointer.version,'version:one');for(const part of ['source','shell','design','assets'])assert.equal(result.bundle[part].version,'version:one');assert.equal(h.active.version,'version:two');
});

test('provider cancellation is bounded and cannot activate a candidate still checking assets',async()=>{
 const h=setup();h.dependencies.timeoutMs=15;h.dependencies.policy.verifyAsset=async()=>new Promise(()=>{});
 await assert.rejects(publishPublication({input:input(),fileId,expectedPointer:null},h.dependencies),{code:'TIMEOUT'});assert.equal(h.calls.cas,0);assert.equal(h.active,null);
});
