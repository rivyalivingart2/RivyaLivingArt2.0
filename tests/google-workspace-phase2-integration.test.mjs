import assert from 'node:assert/strict';
import test from 'node:test';
import {createWriterGateway,createAppsScriptWriterProvider} from '../src/lib/google-workspace/writer-gateway.ts';
import {createCanonicalJobStore} from '../src/lib/google-workspace/canonical-job-store.ts';
import {createJob,createJobRunner,JobWorkError} from '../src/lib/google-workspace/durable-jobs.ts';
import {createDriveDocumentStore} from '../src/lib/google-workspace/drive-documents.ts';
import {gatewayHarness} from './helpers/google-workspace-gateway-harness.mjs';

test('job -> signed writer -> actual gateway source -> Drive document -> restart/resume produces one verified artifact',async()=>{
  const h=gatewayHarness(), fileId='local_fixture_reserved_document',parentId='local_fixture_private_folder';
  const registration={fileId,parentId,purpose:'record-payload',ownerId:'job-local-document'};
  const stored=new Map();let creates=0,dropFirstResponse=true;
  const io={
    metadata:async id=>stored.has(id)?{id,mimeType:'application/json',parents:[parentId],trashed:false,size:stored.get(id).length}:null,
    read:async id=>new Uint8Array(stored.get(id)),
    create:async ({fileId:id,bytes})=>{assert.equal(id,fileId);assert.ok(!stored.has(id));stored.set(id,new Uint8Array(bytes));creates++;},
  };
  const input={title:'Non-product local document',body:'કલા / कला '.repeat(6000)};
  const start=()=>{
    const gateway=createWriterGateway({endpoint:h.endpoint,keyId:'test',secret:h.secret},{fetch:h.fetch,now:()=>h.state.now});
    const provider={...createAppsScriptWriterProvider(gateway),now:()=>new Date(h.state.now).toISOString()};
    const store=createCanonicalJobStore({resource:h.resource,actor:{id:'worker-local'},clock:()=>h.state.now,authorize:({actor})=>actor.id==='worker-local'},provider);
    const documents=createDriveDocumentStore({registrations:[registration]},io);
    const runner=createJobRunner({owner:'worker-local',store,clock:()=>h.state.now,leaseMs:10000,pollMs:1000,maxRunMs:4000,retryDelayMs:100,outputs:{ensure:async({signal})=>{
      const ref=await documents.ensureJson(fileId,input,{signal});
      // File is complete, but worker crashes before saving its output reference.
      if(dropFirstResponse){dropFirstResponse=false;throw new JobWorkError('provider-unavailable');}
      return {id:ref.fileId,sha256:ref.sha256};
    }}});
    return {store,documents,runner};
  };
  let process=start();
  await process.runner.enqueue(createJob({id:'job-local-document',type:'document',inputId:'local-draft',inputRevision:1,inputSha256:'a'.repeat(64),maxAttempts:3,now:h.state.now}));
  const first=await process.runner.run('job-local-document',async context=>{await context.ensureOutput('document');});
  assert.equal(first.status,'retry_wait');assert.equal(creates,1);assert.equal(first.job.outputs.length,0);
  h.restart();h.state.now+=100;process=start();
  const resumed=await process.runner.run('job-local-document',async context=>{
    await context.ensureOutput('document');
    await context.checkpoint({sequence:1,key:'document-verified',data:{fileId}});
  });
  assert.equal(resumed.status,'succeeded');assert.equal(resumed.job.attempts,2);assert.equal(resumed.job.outputs.length,1);assert.equal(creates,1);
  assert.equal(resumed.job.checkpoint.sequence,1);
  const refreshed=await process.store.load('job-local-document',new AbortController().signal);
  assert.equal(refreshed.job.state,'succeeded');assert.equal(refreshed.job.outputs[0].id,fileId);
  const ref=await process.documents.ensureJson(fileId,input);assert.deepEqual(await process.documents.readJson(ref),input);
  const records=h.state.sheets.get(1),ledger=h.state.sheets.get(2),audit=h.state.sheets.get(3),history=h.state.sheets.get(4);
  assert.equal(records.length,2);assert.equal(ledger.length,audit.length);assert.equal(ledger.length,history.length);assert.ok(history.length>=7);
});
