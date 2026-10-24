/** Read-only loopback rehearsal. Does not import, upload or persist source records. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {target,verifyDatabase} from '../exact-legacy/local-guard.mjs';
import {planSourceRecord,reconcileSource,parseLosslessRow,verifySourceShape} from './migration.mjs';

const schema=JSON.parse(readFileSync('src/lib/google-workspace/schema.json','utf8'));
const run=process.argv[2]||'initial';assert.match(run,/^[a-z0-9-]{1,48}$/,'Run label must be a simple local identifier');
assert.equal(process.argv.length<=3,true,'Only an optional run label is accepted');
const output=resolve('test-results/google-workspace-2026-10-24',`rehearsal-${run}-private.json`);
assert.ok(!existsSync(output),'Preserve the prior rehearsal receipt; use a fresh explicit run path in a new checkpoint');
const config=JSON.parse(readFileSync('test-results/exact-legacy-2026-10-21/runtime/config.json','utf8'));
const {default:pg}=await import(pathToFileURL(config.pgModule).href),db=new pg.Client(target);
const source=Object.create(null),summaries=[];
try{
 await db.connect();await verifyDatabase(db);await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 const columns=(await db.query("SELECT table_name,column_name,data_type,is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name LIKE 'rivya_%' ORDER BY table_name,ordinal_position")).rows;
 const constraints=(await db.query("SELECT conrelid::regclass::text AS source_table,conname AS name,pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE contype IN ('f','p','u') AND connamespace='public'::regnamespace ORDER BY conrelid::regclass::text,conname")).rows;
 verifySourceShape(schema,columns,constraints);
 for(const table of schema.tables){
  assert.match(table.sourceTable,/^rivya_[a-z_]+$/);
  const expressions=table.fields.map(f=>{assert.match(f.name,/^[a-z_][a-z_0-9]*$/);return `'${f.name}',t."${f.name}"${f.sqlType==='bigint'?'::text':''}`;}).join(',');
  const rows=(await db.query(`SELECT jsonb_build_object(${expressions})::text AS document FROM "${table.sourceTable}" t`)).rows.map(row=>parseLosslessRow(row.document));
  source[table.sourceTable]=rows;
 }
 await db.query('ROLLBACK');
}finally{await db.end();}
const reconciliation=reconcileSource(schema,{...source});
for(const table of schema.tables){
 const rows=source[table.sourceTable],prepared=rows.map(row=>planSourceRecord(table,row)),inline=prepared.filter(p=>p.disposition==='inline'),artifacts=prepared.filter(p=>p.disposition==='drive-artifact-required');
 const digest=values=>createHash('sha256').update(JSON.stringify(values.sort())).digest('hex');
 summaries.push({sourceTable:table.sourceTable,workbook:table.workbook,rows:rows.length,stableIdsUnique:new Set(prepared.map(p=>p.disposition==='inline'?p.record.recordId:p.recordId)).size===rows.length,payloadSetHash:digest(prepared.map(p=>p.disposition==='inline'?p.record.payloadSha256:p.payloadSha256)),maxCellCharacters:Math.max(0,...inline.flatMap(p=>p.cells.map(c=>c.length))),inlineRoundTrips:inline.length,driveArtifactsRequired:artifacts.length,largestArtifactBytes:Math.max(0,...artifacts.map(p=>p.bytes)),allSourceRecordsAccountedFor:inline.length+artifacts.length===rows.length});
}
const receipt={at:new Date().toISOString(),revision:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),scope:'SYNTHETIC_LOOPBACK_READ_ONLY_IN_MEMORY',productionVerified:false,cloudCalls:0,recordsImported:0,sourceRecordsWritten:0,sourceRecordsPersisted:0,source:'Preserved populated restoration QA cluster; not a production export or lost legacy database',...reconciliation,tables:summaries};
mkdirSync(resolve('test-results/google-workspace-2026-10-24'),{recursive:true});writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({scope:receipt.scope,...reconciliation,allSourceRecordsAccountedFor:summaries.every(t=>t.allSourceRecordsAccountedFor&&t.stableIdsUnique),inlineRoundTrips:summaries.reduce((n,t)=>n+t.inlineRoundTrips,0),driveArtifactsRequired:summaries.reduce((n,t)=>n+t.driveArtifactsRequired,0),maxCellCharacters:Math.max(...summaries.map(t=>t.maxCellCharacters)),recordsImported:0,cloudCalls:0,sourceRecordsPersisted:0}));
