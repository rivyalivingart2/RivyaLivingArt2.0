import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createDriveDocumentStore,canonicalDocumentBytes,parseCanonicalDocument,validateDriveJsonRef} from '../src/lib/google-workspace/drive-documents.ts';
import {canonicalArtifactJson,encodeRecord,decodeRecord,makeRecord} from '../src/lib/google-workspace/record-codec.ts';
const registration={fileId:'reserved_payload_0001',parentId:'registered_folder_001',purpose:'record-payload',ownerId:'cms:one'};
const recordMetadata={recordId:'cms:one',revision:3,sourceUpdatedAt:'2026-10-24T00:00:00Z',archivedAt:null,lastMutationId:'migration:one'};
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function setup(config={}){
 const files=new Map(),calls={metadata:0,read:0,create:0};
 const io={metadata:async id=>{calls.metadata++;const entry=files.get(id);return entry?structuredClone(entry.meta):null;},read:async id=>{calls.read++;return new Uint8Array(files.get(id).bytes);},create:async input=>{calls.create++;if(files.has(input.fileId))throw Error('already exists');files.set(input.fileId,{meta:{id:input.fileId,mimeType:input.mimeType,parents:[input.parentId],trashed:false,size:input.bytes.length},bytes:new Uint8Array(input.bytes)});}};
 return {files,calls,io,store:createDriveDocumentStore({registrations:[registration],...config},io)};
}
const rejects=(promise,code)=>assert.rejects(promise,{code});

test('oversized multilingual CMS document round trips exactly through a small verified Sheets envelope',async()=>{
 const h=setup(),payload={id:'0001',draft:{text:'ગુજરાતી தமிழ்'.repeat(6000),formula:'=1+1',number:-0},published:null};
 const record=await h.store.makePayloadRecord(recordMetadata,registration.fileId,payload);
 const cells=encodeRecord(record);assert.ok(cells.every(cell=>cell.length<=45000));
 const restored=await h.store.resolvePayload(decodeRecord(cells));
 assert.equal(canonicalArtifactJson(restored),canonicalArtifactJson(payload));assert.ok(Object.is(restored.draft.number,-0));
 assert.equal(record.payload.artifact.sha256,hash(canonicalDocumentBytes(payload)));
 assert.notEqual(record.payloadSha256,record.payload.artifact.sha256);assert.equal(h.calls.create,1);
});

test('inline records retain their original payload and need no artifact IO',async()=>{
 const h=setup(),record=makeRecord({...recordMetadata,payload:{title:'Existing page',id:'0007'}});
 assert.deepEqual(await h.store.resolvePayload(record),record.payload);assert.deepEqual(h.calls,{metadata:0,read:0,create:0});
});

test('same reserved ID is reused and differing contents are never overwritten',async()=>{
 const h=setup(),first=await h.store.ensureJson(registration.fileId,{title:'One'}),again=await h.store.ensureJson(registration.fileId,{title:'One'});
 assert.deepEqual(first,again);assert.equal(h.calls.create,1);
 await rejects(h.store.ensureJson(registration.fileId,{title:'Two'}),'ARTIFACT_MISMATCH');assert.equal(h.calls.create,1);
});

test('concurrent creates and ambiguous acknowledgement recover the same stable ID without filename lookup',async()=>{
 const h=setup();const results=await Promise.all([h.store.ensureJson(registration.fileId,{same:true}),h.store.ensureJson(registration.fileId,{same:true})]);
 assert.deepEqual(results[0],results[1]);assert.equal(h.files.size,1);
 const recovered=setup(),create=recovered.io.create;recovered.io.create=async input=>{await create(input);throw Error('network response lost');};
 const store=createDriveDocumentStore({registrations:[registration]},recovered.io);
 assert.equal((await store.ensureJson(registration.fileId,{same:true})).fileId,registration.fileId);assert.equal(recovered.calls.create,1);
});

test('partial attempt stays recoverable at the registered ID without returning an unverified envelope',async()=>{
 const h=setup(),read=h.io.read;let broken=true;
 h.io.read=async id=>{if(broken)throw Error('provider secret');return read(id);};const store=createDriveDocumentStore({registrations:[registration]},h.io);
 await rejects(store.makePayloadRecord(recordMetadata,registration.fileId,{text:'x'.repeat(46000)}),'PROVIDER_UNAVAILABLE');
 assert.equal(h.files.size,1);broken=false;
 const record=await store.makePayloadRecord(recordMetadata,registration.fileId,{text:'x'.repeat(46000)});assert.equal(h.calls.create,1);assert.equal((await store.resolvePayload(record)).text.length,46000);
});

test('bounded unsuccessful creation returns no reference and sanitizes provider errors',async()=>{
 const h=setup();h.io.create=async()=>{h.calls.create++;throw Error('private token');};const store=createDriveDocumentStore({registrations:[registration],createAttempts:2},h.io);
 await assert.rejects(store.ensureJson(registration.fileId,{a:1}),error=>error.code==='PROVIDER_UNAVAILABLE'&&!String(error).includes('private token'));
 assert.equal(h.calls.create,2);assert.equal(h.files.size,0);
});

test('unregistered IDs, forged owners and malformed refs fail before provider IO',async()=>{
 const h=setup();await rejects(h.store.ensureJson('https://evil.invalid',{}),'UNREGISTERED_ARTIFACT');
 await rejects(h.store.makePayloadRecord({...recordMetadata,recordId:'cms:other'},registration.fileId,{}),'UNREGISTERED_ARTIFACT');
 const valid={...registration,format:'rivya-drive-json-v1',mimeType:'application/json',bytes:2,sha256:hash(new TextEncoder().encode('{}'))};
 for(const patch of [{ownerId:'cms:other'},{parentId:'other_folder_123'},{purpose:'publication-bundle'}])await rejects(h.store.readJson({...valid,...patch}),'UNREGISTERED_ARTIFACT');
 assert.throws(()=>validateDriveJsonRef({...valid,url:'https://evil.invalid'}),{code:'INVALID_REFERENCE'});
 assert.deepEqual(h.calls,{metadata:0,read:0,create:0});
});

test('metadata changes in ID, MIME, parent, trash or length prevent artifact use',async()=>{
 for(const patch of [{id:'other_file_123'},{mimeType:'text/html'},{parents:['other_folder_123']},{trashed:true},{size:999}]){
  const h=setup(),ref=await h.store.ensureJson(registration.fileId,{a:1});Object.assign(h.files.get(registration.fileId).meta,patch);
  await rejects(h.store.readJson(ref),'ARTIFACT_MISMATCH');
 }
});

test('body corruption or missing file cannot resolve an existing envelope',async()=>{
 const h=setup(),ref=await h.store.ensureJson(registration.fileId,{a:1});h.files.get(registration.fileId).bytes[1]=88;
 await rejects(h.store.readJson(ref),'ARTIFACT_MISMATCH');h.files.clear();await rejects(h.store.readJson(ref),'ARTIFACT_NOT_FOUND');
});

test('strict UTF8, canonical byte equality, duplicate keys and precision-sensitive JSON are validated',()=>{
 for(const bytes of [new Uint8Array([0xff]),new TextEncoder().encode('{"a":1,"a":2}'),new TextEncoder().encode('{ "a":1}'),new TextEncoder().encode('{"a":9007199254740993}'),new TextEncoder().encode('\ufeff{}')])assert.throws(()=>parseCanonicalDocument(bytes),{code:'INVALID_JSON'});
 const good=canonicalDocumentBytes({text:'ગુજરાતી',value:-0});assert.equal(canonicalArtifactJson(parseCanonicalDocument(good)),new TextDecoder().decode(good));
});

test('even a matching registered hash cannot authorize invalid UTF8 artifact data',async()=>{
 const h=setup(),bytes=new Uint8Array([0xff]);h.files.set(registration.fileId,{meta:{id:registration.fileId,mimeType:'application/json',parents:[registration.parentId],trashed:false,size:1},bytes});
 await rejects(h.store.readJson({...registration,format:'rivya-drive-json-v1',mimeType:'application/json',bytes:1,sha256:hash(bytes)}),'INVALID_JSON');
});

test('byte budgets never truncate payloads and invalid objects execute no getters',async()=>{
 const h=setup({maxBytes:100});await rejects(h.store.ensureJson(registration.fileId,{text:'界'.repeat(60)}),'ARTIFACT_TOO_LARGE');
 let ran=false;const payload={get text(){ran=true;return 'x';}};await rejects(h.store.ensureJson(registration.fileId,payload),'INVALID_JSON');assert.equal(ran,false);assert.equal(h.calls.create,0);
});

test('timeout and caller cancellation stop ignored IO without inventing successful persistence',async()=>{
 const h=setup(),store=createDriveDocumentStore({registrations:[registration],timeoutMs:15},{...h.io,metadata:async()=>new Promise(()=>{})});
 await rejects(store.ensureJson(registration.fileId,{}),'TIMEOUT');
 const abort=new AbortController();abort.abort();await rejects(h.store.ensureJson(registration.fileId,{}, {signal:abort.signal}),'ABORTED');assert.equal(h.calls.create,0);
});
