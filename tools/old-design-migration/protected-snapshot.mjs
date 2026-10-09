import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {neon} from '@neondatabase/serverless';
import {assertLocalConfig} from './guard.mjs';

const mode=process.argv[2],label=process.argv[3]||'before';
assert.ok(['local','live-read-only'].includes(mode));assert.match(label,/^[a-z0-9-]+$/);
const config=parseEnv(readFileSync(mode==='local'?'test-results/old-design-migration/.env.qa':process.env.RIVYA_PROTECTED_READ_CONFIG,'utf8'));
if(mode==='local'){assertLocalConfig(config);assert.equal(globalThis.__rivyaMigrationLocalSql,true);}
else {assert.ok(!globalThis.__rivyaMigrationLocalSql);const url=new URL(config.DATABASE_URL);assert.equal(url.pathname,'/neondb');assert.equal(url.hostname,'ep-delicate-silence-awjxadrd-pooler.c-12.us-east-1.aws.neon.tech');assert.equal(url.username,'rivya_runtime_20260924');assert.equal(config.RIVYA_DATA_MODE,'shared');}
const sql=neon(config.DATABASE_URL);
// Fixed identifiers, no supplied SQL. Raw documents and customer values stay at
// the server. Even a mistakenly privileged connection is transaction read-only.
const scopes={rivya_catalogue:'product_id',rivya_content:'content_key',rivya_public_media:'path',rivya_business_settings:'id',rivya_revisions:"(kind || ':' || entity_key || ':' || version)",rivya_inquiries:'id',rivya_studio_orders:'id',rivya_studio_order_events:'id',rivya_inquiry_notes:'id',rivya_references:'id',rivya_staff:'id',rivya_privacy_controls:'order_id',rivya_erasure_ledger:'id'};
const queries=[sql.query('SHOW transaction_read_only'),sql.query('SELECT current_database() AS database,current_user AS role'),...Object.entries(scopes).map(([table,key])=>sql.query(`SELECT ${key}::text AS id, encode(sha256(convert_to(row_to_json(t)::text,'UTF8')),'hex') AS digest FROM ${table} t ORDER BY ${key} LIMIT 2001`)),sql.query('SELECT content_key AS id,kind,route,version,published_version,visible FROM rivya_content ORDER BY content_key LIMIT 2001')];
const result=await sql.transaction(queries,{readOnly:true,isolationLevel:'RepeatableRead'});
assert.equal(result[0][0].transaction_read_only,'on');
const records={},summary={};
Object.keys(scopes).forEach((table,i)=>{const rows=result[i+2];assert.ok(rows.length<=2000,'Scope exceeds bounded inventory; use reviewed pagination');records[table]=Object.fromEntries(rows.map(row=>[row.id,row.digest]));summary[table]={count:rows.length,digest:createHash('sha256').update(JSON.stringify(rows)).digest('hex')};});
const privateReport={at:new Date().toISOString(),mode,readOnly:true,identity:result[1][0],records,contentIdentities:result.at(-1)};
const output=resolve('test-results/old-design-migration');mkdirSync(output,{recursive:true});
writeFileSync(resolve(output,`${mode}-${label}-private.json`),JSON.stringify(privateReport,null,2),{flag:'wx',mode:0o600});
const report={at:privateReport.at,mode,readOnly:true,rawValuesExported:false,summary};
writeFileSync(resolve(output,`${mode}-${label}-summary.json`),JSON.stringify(report,null,2),{flag:'wx'});
console.log(JSON.stringify({mode,readOnly:true,counts:Object.fromEntries(Object.entries(summary).map(([k,v])=>[k,v.count]))}));
