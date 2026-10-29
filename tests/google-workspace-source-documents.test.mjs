/** Synthetic fixtures + memory Drive emulator only. These are not Google
 * acceptance, migrated products, remote IDs or Netlify persistence evidence. */
import test,{mock} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {resolve,join} from 'node:path';
import {appendFile,readFile,writeFile,open} from 'node:fs/promises';
import {planSourceRecord} from '../tools/google-workspace/migration.mjs';
import {createSourceDocumentMigrationBridge,prepareSourceDocumentIntent,validateSourceDocumentPrivacy} from '../tools/google-workspace/source-document-migration.mjs';
import {openLocalSourceDocumentJournal} from '../tools/google-workspace/source-document-local-journal.mjs';
import {createGoogleDriveDocumentPrivacyReader} from '../tools/google-workspace/source-document-privacy-reader.mjs';
import {canonicalArtifactJson} from '../src/lib/google-workspace/record-codec.ts';

const table={sourceTable:'rivya_fixture_documents',workbook:'content',primaryKey:['id'],fields:[{name:'id',sqlType:'text',representation:'text',nullable:false},{name:'amount',sqlType:'bigint',representation:'decimal-string',nullable:false},{name:'payload',sqlType:'jsonb',representation:'preserved-json',nullable:false},{name:'updated_at',sqlType:'timestamp with time zone',representation:'text',nullable:false}],constraints:[{name:'fixture_pk',definition:'PRIMARY KEY (id)'}]};
const source=()=>({id:'0007',amount:'9007199254740993',payload:{text:'ગુજરાતી'.repeat(8000),formula:'=SUM(A1)',signedZero:-0},updated_at:'2026-10-29T00:00:00.000Z'});
const policy={ownerEmail:'owner@example.invalid',allowedUsers:['worker@example.invalid']};
const parentId='emulator_private_folder_001',fileId='emulator_document_0001';
function input(){const row=source(),plan=planSourceRecord(table,row);return {table,row,plan,registration:{fileId,parentId,purpose:'record-payload',ownerId:plan.recordId}};}
function privacy(id){return {metadata:{id,mimeType:id===parentId?'application/vnd.google-apps.folder':'application/json',parents:id===parentId?['emulator_private_root']:[parentId],trashed:false,owners:[{emailAddress:policy.ownerEmail}]},permissions:{permissions:[{type:'user',role:'owner',emailAddress:policy.ownerEmail},{type:'user',role:'writer',emailAddress:policy.allowedUsers[0]}]}};}
function fixture(){
  const files=new Map(),entries=new Map(),calls={create:0,metadata:0,read:0,privacy:0,journal:0};
  const journal={scope:'LOCAL_OPERATOR_JOURNAL',async read(key,phase){return entries.has(key+phase)?structuredClone(entries.get(key+phase)):null;},async putIfAbsent(key,phase,value){calls.journal++;const prior=entries.get(key+phase);if(prior&&canonicalArtifactJson(prior)!==canonicalArtifactJson(value))throw Error('fixture conflict');entries.set(key+phase,structuredClone(value));}};
  const io={async metadata(id){calls.metadata++;const bytes=files.get(id);return bytes?{id,mimeType:'application/json',parents:[parentId],trashed:false,size:bytes.length}:null;},async read(id){calls.read++;return new Uint8Array(files.get(id));},async create(request){calls.create++;if(files.has(request.fileId))throw Error('fixture conflict');files.set(request.fileId,new Uint8Array(request.bytes));}};
  const readPrivacy=async id=>{calls.privacy++;return privacy(id);};
  const bridge=(changes={},config={})=>createSourceDocumentMigrationBridge({mode:'local-operator',privacyPolicy:policy,...config},{journal,io,readPrivacy,...changes});
  return {files,entries,calls,journal,io,readPrivacy,bridge};
}
test('emulator bridge preserves complete oversized payload/stable identity and only stages a small reference after durable registration',async()=>{
  const h=fixture(),source=input(),result=await h.bridge().stage(source);
  assert.equal(result.record.recordId,source.plan.recordId);assert.equal(result.sourcePayloadSha256,source.plan.payloadSha256);assert.equal(result.artifact.sha256,source.plan.payloadSha256);assert.equal(result.canonicalWritten,false);assert.equal(result.authorityChanged,false);
  assert.equal(new TextDecoder().decode(h.files.get(fileId)),canonicalArtifactJson(source.row));assert.ok(result.cells.every(x=>x.length<=45000));assert.equal(h.entries.size,2);assert.equal(h.calls.create,1);
  const replay=await h.bridge().stage(source);assert.deepEqual(replay,result);assert.equal(h.calls.create,1);
});
test('registration, source-plan, unsupported size and operator-mode failures perform no provider writes',async()=>{
  const h=fixture(),source=input();
  assert.throws(()=>h.bridge({}, {mode:'production'}),{code:'INVALID_CONFIGURATION'});
  for(const patch of [{registration:{...source.registration,ownerId:'unrelated'}},{plan:{...source.plan,bytes:1}}])await assert.rejects(h.bridge().stage({...source,...patch}));
  const huge={...source.row,payload:{text:'x'.repeat(5*1024*1024)}};await assert.rejects(h.bridge().stage({...source,row:huge,plan:planSourceRecord(table,huge)}),{code:'RESUMABLE_UPLOAD_REQUIRED'});
  assert.deepEqual(h.calls,{create:0,metadata:0,read:0,privacy:0,journal:0});
});
test('public/incomplete/foreign owner privacy rejects; an uploaded but unverified file remains retryable at the same ID',async()=>{
  for(const mutate of [s=>s.permissions.permissions.push({type:'anyone',role:'reader'}),s=>s.permissions.nextPageToken='more',s=>s.metadata.owners[0].emailAddress='other@example.invalid',s=>s.permissions.permissions[1].pendingOwner=true]){
    const h=fixture();await assert.rejects(h.bridge({readPrivacy:async id=>{const s=privacy(id);mutate(s);return s;}}).stage(input()));assert.equal(h.calls.create,0);
  }
  const h=fixture();await assert.rejects(h.bridge({readPrivacy:async id=>{const s=privacy(id);if(id===fileId)s.permissions.permissions.push({type:'domain',role:'reader'});return s;}}).stage(input()),{code:'PRIVACY_MISMATCH'});
  assert.equal(h.calls.create,1);assert.equal(h.entries.size,1);await h.bridge().stage(input());assert.equal(h.calls.create,1);assert.equal(h.entries.size,2);
});
test('unknown create and journal acknowledgements reconcile the same immutable registration; failed registration blocks upload',async()=>{
  const h=fixture(),create=h.io.create,put=h.journal.putIfAbsent;
  h.io.create=async request=>{await create(request);throw Error('private provider details');};
  h.journal.putIfAbsent=async(...args)=>{await put(...args);throw Error('private journal details');};
  const result=await h.bridge().stage(input());assert.equal(result.status,'staged-document-reference');assert.equal(h.calls.create,1);
  const failed=fixture();failed.journal.putIfAbsent=async()=>{throw Error('private journal details');};await assert.rejects(failed.bridge().stage(input()),{code:'JOURNAL_OUTCOME_UNKNOWN'});assert.equal(failed.calls.create,0);assert.equal(failed.calls.privacy,0);
});
test('changed registration and changed remote bytes reject instead of overwriting or returning the stored success',async()=>{
  const h=fixture(),source=input();await h.bridge().stage(source);
  await assert.rejects(h.bridge().stage({...source,registration:{...source.registration,fileId:'emulator_other_document'}}),{code:'JOURNAL_CONFLICT'});
  h.files.get(fileId)[0]^=1;await assert.rejects(h.bridge().stage(source),{code:'ARTIFACT_MISMATCH'});assert.equal(h.calls.create,1);
});
test('source snapshot resists caller mutation during registration and concurrent attempts reuse one immutable object',async()=>{
  const h=fixture(),source=input(),expected=canonicalArtifactJson(source.row),put=h.journal.putIfAbsent;
  h.journal.putIfAbsent=async(...args)=>{await put(...args);source.row.payload.text='changed';};
  await h.bridge().stage(source);assert.equal(new TextDecoder().decode(h.files.get(fileId)),expected);
  const c=fixture(),results=await Promise.all([c.bridge().stage(input()),c.bridge().stage(input())]);assert.deepEqual(results[0],results[1]);assert.equal(c.files.size,1);
});
test('overall timeout stops ignored privacy IO without a reference or uploaded file',async()=>{
  const h=fixture();await assert.rejects(h.bridge({readPrivacy:async()=>new Promise(()=>{})},{timeoutMs:10}).stage(input()),{code:'TIMEOUT'});assert.equal(h.calls.create,0);assert.equal(h.entries.size,1);
});
test('monotonic deadlines deny synchronous timer starvation before upload and after final journal read',async()=>{
  let milliseconds=0;const clock=mock.method(performance,'now',()=>milliseconds);
  try{
    const h=fixture();await assert.rejects(h.bridge({readPrivacy:async id=>{milliseconds=10001;return privacy(id);}},{timeoutMs:10000}).stage(input()),{code:'TIMEOUT'});assert.equal(h.calls.create,0);
    milliseconds=0;const later=fixture(),read=later.journal.read;later.journal.read=async(key,phase)=>{const result=await read(key,phase);if(phase==='verified'&&result)milliseconds=30001;return result;};
    await assert.rejects(later.bridge({}, {timeoutMs:30000}).stage(input()),{code:'TIMEOUT'});assert.equal(later.calls.create,1);
    milliseconds=0;let fetched=0;const reader=createGoogleDriveDocumentPrivacyReader({registeredIds:[fileId],timeoutMs:10000},{token:async()=>{milliseconds=10001;return 'emulator-opaque-token';},fetch:async()=>{fetched++;return new Response('{}');}});await assert.rejects(reader(fileId),{code:'TIMEOUT'});assert.equal(fetched,0);
  }finally{clock.mock.restore();}
});
test('actual local operator journal survives close/reopen, excludes raw payloads, denies concurrent ownership and rejects corrupt/truncated history',async()=>{
  const directory=resolve('test-results','source-document-journal-fixture-'+randomUUID()),source=input(),h=fixture();
  let journal=await openLocalSourceDocumentJournal({mode:'local-operator',directory,create:true});
  try{
    await assert.rejects(openLocalSourceDocumentJournal({mode:'local-operator',directory}),{code:'JOURNAL_LOCKED'});
    const aborted=new AbortController();aborted.abort();await assert.rejects(journal.read(prepareSourceDocumentIntent(source).operationId,'registration',aborted.signal),{code:'ABORTED'});
    await h.bridge({journal}).stage(source);
  }finally{await journal.close();}
  const path=join(directory,'document-operations.jsonl'),original=await readFile(path,'utf8');assert.ok(!original.includes(source.row.payload.text));assert.ok(!original.includes('9007199254740993'));
  journal=await openLocalSourceDocumentJournal({mode:'local-operator',directory});try{await h.bridge({journal}).stage(source);assert.equal(h.calls.create,1);}finally{await journal.close();}
  await appendFile(path,'partial');await assert.rejects(openLocalSourceDocumentJournal({mode:'local-operator',directory}),{code:'JOURNAL_CORRUPT'});
  await writeFile(path,original.replace('rivya-source-document-intent-v1','rivya-source-document-intent-v2'));await assert.rejects(openLocalSourceDocumentJournal({mode:'local-operator',directory}));
  assert.throws(()=>prepareSourceDocumentIntent({...source,plan:{...source.plan,bytes:0}}),{code:'SOURCE_PLAN_MISMATCH'});
});
test('failed local fsync quarantines matching page-cache bytes and retains lock instead of authorizing an upload',async()=>{
  const directory=resolve('test-results','source-document-journal-sync-fixture-'+randomUUID()),h=fixture(),source=input();
  const journal=await openLocalSourceDocumentJournal({mode:'local-operator',directory,create:true});
  const observer=await open(join(directory,'document-operations.jsonl'),'r'),prototype=Object.getPrototypeOf(observer),original=prototype.sync;
  await observer.close();let injected=false;
  try{
    prototype.sync=async function(){if(!injected){injected=true;throw Error('synthetic fsync failure');}return original.call(this);};
    await assert.rejects(h.bridge({journal}).stage(source),{code:'JOURNAL_OUTCOME_UNKNOWN'});
  }finally{prototype.sync=original;}
  assert.equal(injected,true);assert.equal(h.calls.create,0);assert.equal(h.calls.privacy,0);
  const intent=prepareSourceDocumentIntent(source);
  await assert.rejects(journal.read(intent.operationId,'registration'),{code:'JOURNAL_OUTCOME_UNKNOWN'});
  await assert.rejects(journal.close(),{code:'JOURNAL_OUTCOME_UNKNOWN'});
  await assert.rejects(openLocalSourceDocumentJournal({mode:'local-operator',directory}),{code:'JOURNAL_LOCKED'});
});
test('privacy transport uses registered bounded GETs and completeness is validated without a private boolean shortcut',async()=>{
  const calls=[],reader=createGoogleDriveDocumentPrivacyReader({registeredIds:[parentId,fileId]},{token:async()=> 'emulator-opaque-token',fetch:async(url,init)=>{calls.push({url,init});const id=new URL(url).pathname.split('/')[4],s=privacy(id);return new Response(JSON.stringify(url.includes('/permissions?')?s.permissions:s.metadata),{headers:{'content-type':'application/json'}});}});
  const result=await reader(fileId,new AbortController().signal);assert.equal(validateSourceDocumentPrivacy(result,{id:fileId,mimeType:'application/json',parentId},policy),true);assert.equal(calls.length,2);assert.ok(calls.every(x=>x.init.method==='GET'&&x.init.redirect==='manual'));
  await assert.rejects(reader('unregistered_file_001'),{code:'REGISTRATION_MISMATCH'});
  assert.throws(()=>validateSourceDocumentPrivacy({private:true},{id:fileId,mimeType:'application/json',parentId},policy),{code:'PRIVACY_MISMATCH'});
});
test('privacy transport rejects redirect, oversized/truncated bodies and token errors without exposing details',async()=>{
  for(const response of [()=>new Response('',{status:302,headers:{location:'https://example.invalid'}}),()=>new Response('{}',{headers:{'content-type':'application/json','content-length':'999999'}}),()=>new Response('{}',{headers:{'content-type':'application/json','content-length':'3'}})]){
    const reader=createGoogleDriveDocumentPrivacyReader({registeredIds:[fileId]},{token:async()=> 'emulator-opaque-token',fetch:async()=>response()});await assert.rejects(reader(fileId),{code:'PRIVACY_UNAVAILABLE'});
  }
  const reader=createGoogleDriveDocumentPrivacyReader({registeredIds:[fileId]},{token:async()=>{throw Error('private secret');},fetch:async()=>{throw Error('should not run');}});await assert.rejects(reader(fileId),error=>error.code==='PRIVACY_UNAVAILABLE'&&!String(error).includes('secret'));
});
