/** Read-only existing loopback -> complete in-memory Drive document round trip.
 * No Google calls, file exports, source writes or product imports. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {target,verifyDatabase} from '../exact-legacy/local-guard.mjs';
import {planSourceRecord,reconcileSource,parseLosslessRow,verifySourceShape} from './migration.mjs';
import {createDriveDocumentStore} from '../../src/lib/google-workspace/drive-documents.ts';
import {canonicalArtifactJson,encodeRecord,decodeRecord} from '../../src/lib/google-workspace/record-codec.ts';

const run=process.argv[2];assert.match(run??'',/^[a-z0-9-]{1,48}$/,'Supply a fresh local run label');
assert.equal(process.argv.length,3,'Only a run label is accepted; no external database or destination');
const folder=resolve('test-results/google-workspace-phase2-2026-10-24'),output=resolve(folder,`documents-${run}-private.json`);
assert.ok(!existsSync(output),'Prior receipts are immutable; choose a fresh run label');
const schema=JSON.parse(readFileSync('src/lib/google-workspace/schema.json','utf8'));
const config=JSON.parse(readFileSync('test-results/exact-legacy-2026-10-21/runtime/config.json','utf8'));
const {default:pg}=await import(pathToFileURL(config.pgModule).href),db=new pg.Client(target);
const source=Object.create(null);
try{
 await db.connect();await verifyDatabase(db);await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 const columns=(await db.query("SELECT table_name,column_name,data_type,is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name LIKE 'rivya_%' ORDER BY table_name,ordinal_position")).rows;
 const constraints=(await db.query("SELECT conrelid::regclass::text AS source_table,conname AS name,pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE contype IN ('f','p','u') AND connamespace='public'::regnamespace ORDER BY conrelid::regclass::text,conname")).rows;
 verifySourceShape(schema,columns,constraints);
 for(const table of schema.tables){
  assert.match(table.sourceTable,/^rivya_[a-z_]+$/);
  const expressions=table.fields.map(f=>{assert.match(f.name,/^[a-z_][a-z_0-9]*$/);return `'${f.name}',t."${f.name}"${f.sqlType==='bigint'?'::text':''}`;}).join(',');
  source[table.sourceTable]=(await db.query(`SELECT jsonb_build_object(${expressions})::text AS document FROM "${table.sourceTable}" t`)).rows.map(row=>parseLosslessRow(row.document));
 }
 await db.query('ROLLBACK');
}finally{await db.end();}
const reconciliation=reconcileSource(schema,{...source});
const artifacts=[];let inline=0,index=0;
for(const table of schema.tables){for(const payload of source[table.sourceTable]){
 const plan=planSourceRecord(table,payload);
 if(plan.disposition==='inline'){inline++;continue;}
 // These are explicitly emulator IDs, never claimed or persisted as Drive IDs.
 const fileId=`memory_fixture_document_${++index}`,parentId='memory_fixture_private_folder';
 const bytes=new Map();let creates=0;
 const io={
  metadata:async id=>bytes.has(id)?{id,mimeType:'application/json',parents:[parentId],trashed:false,size:bytes.get(id).length}:null,
  read:async id=>new Uint8Array(bytes.get(id)),
  create:async request=>{assert.equal(request.fileId,fileId);assert.equal(request.parentId,parentId);assert.ok(!bytes.has(fileId));bytes.set(fileId,new Uint8Array(request.bytes));creates++;},
 };
 const registration={fileId,parentId,purpose:'record-payload',ownerId:plan.recordId};
 const documents=createDriveDocumentStore({registrations:[registration]},io);
 const metadata={recordId:plan.recordId,revision:1,sourceUpdatedAt:payload.updated_at??payload.created_at??null,archivedAt:null,lastMutationId:`memory_${plan.recordId}`};
 const record=await documents.makePayloadRecord(metadata,fileId,payload);
 const cells=encodeRecord(record),decoded=decodeRecord(cells);
 const restarted=createDriveDocumentStore({registrations:[registration]},io);
 const restored=await restarted.resolvePayload(decoded);
 assert.equal(canonicalArtifactJson(restored),canonicalArtifactJson(payload));
 const ref=await restarted.ensureJson(fileId,payload);assert.equal(ref.sha256,plan.payloadSha256);assert.equal(ref.bytes,plan.bytes);assert.equal(creates,1);
 artifacts.push({sourceTable:table.sourceTable,bytes:ref.bytes,sha256:createHash('sha256').update(canonicalArtifactJson(restored)).digest('hex'),cellCharacters:cells.map(c=>c.length),roundTrip:true,retryReusesSameArtifact:true,actualDriveFileId:null});
 bytes.clear();
}}
const receipt={at:new Date().toISOString(),revision:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),scope:'SYNTHETIC_LOOPBACK_READ_ONLY_WITH_MEMORY_DRIVE_EMULATOR',...reconciliation,inlineRoundTrips:inline,artifactRoundTrips:artifacts.length,allRecordsRoundTripped:inline+artifacts.length,artifacts,cloudCalls:0,recordsImported:0,sourceRecordsWritten:0,sourceRecordsPersisted:0,actualGoogleVerified:false};
mkdirSync(folder,{recursive:true});writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({...receipt,artifacts:artifacts.map(({sourceTable,bytes,roundTrip,retryReusesSameArtifact,actualDriveFileId})=>({sourceTable,bytes,roundTrip,retryReusesSameArtifact,actualDriveFileId}))}));
