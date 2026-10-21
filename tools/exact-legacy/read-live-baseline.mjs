/** Owner-authorized read-only baseline. No credentials or raw row values in output. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {neon} from '@neondatabase/serverless';

const label=process.argv[2];assert.match(label||'',/^[a-z0-9-]+$/);
const config=parseEnv(readFileSync(process.env.RIVYA_PROTECTED_READ_CONFIG,'utf8'));
const url=new URL(config.DATABASE_URL);
// Same destination identity as the existing protected-snapshot tool. Never try
// an owner credential or a different deployment as a fallback.
assert.equal(url.hostname,'ep-delicate-silence-awjxadrd-pooler.c-12.us-east-1.aws.neon.tech');
assert.equal(url.pathname,'/neondb');assert.equal(url.username,'rivya_runtime_20260924');
const sql=neon(config.DATABASE_URL);
const root=resolve('test-results/exact-legacy-2026-10-21/live');mkdirSync(root,{recursive:true});
try{
 const schema=await sql.transaction([
  sql.query('SHOW transaction_read_only'),
  sql.query('SELECT current_database() AS database,current_user AS role'),
  sql.query("SELECT table_name,column_name,data_type,is_nullable,column_default FROM information_schema.columns WHERE table_schema='public' AND table_name LIKE 'rivya_%' ORDER BY table_name,ordinal_position"),
  sql.query("SELECT tc.table_name,tc.constraint_name,tc.constraint_type,kcu.column_name,ccu.table_name AS foreign_table,ccu.column_name AS foreign_column FROM information_schema.table_constraints tc LEFT JOIN information_schema.key_column_usage kcu ON tc.constraint_name=kcu.constraint_name AND tc.constraint_schema=kcu.constraint_schema LEFT JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name=ccu.constraint_name AND tc.constraint_schema=ccu.constraint_schema WHERE tc.table_schema='public' AND tc.table_name LIKE 'rivya_%' ORDER BY tc.table_name,tc.constraint_name,kcu.ordinal_position")
 ],{readOnly:true,isolationLevel:'RepeatableRead'});
 assert.equal(schema[0][0].transaction_read_only,'on');
 const tables=[...new Set(schema[2].map(r=>r.table_name))].filter(t=>!/(?:session|access_request|auth|token)/.test(t));
 for(const table of tables)assert.match(table,/^rivya_[a-z0-9_]+$/);
 const rows=await sql.transaction([sql.query('SHOW transaction_read_only'),...tables.map(t=>sql.query(`SELECT encode(sha256(convert_to(row_to_json(t)::text,'UTF8')),'hex') AS digest FROM "${t}" t ORDER BY digest LIMIT 20001`))],{readOnly:true,isolationLevel:'RepeatableRead'});
 assert.equal(rows[0][0].transaction_read_only,'on');
 const summary={};
 tables.forEach((table,i)=>{assert.ok(rows[i+1].length<=20000,'Reviewed pagination required');summary[table]={count:rows[i+1].length,digest:createHash('sha256').update(JSON.stringify(rows[i+1])).digest('hex')};});
 const receipt={at:new Date().toISOString(),readOnly:true,rawValuesExported:false,identity:schema[1][0],columns:schema[2],constraints:schema[3],summary,limitations:['Schema and row digests use separate read-only repeatable-read transactions.','Authentication/session/request tables are excluded from row hashing.','Digests are a preservation baseline, not a field-level migration export.']};
 writeFileSync(resolve(root,label+'-private.json'),JSON.stringify(receipt,null,2),{flag:'wx',mode:0o600});
 console.log(JSON.stringify({readOnly:true,rawValuesExported:false,tables:tables.length,columns:schema[2].length,counts:Object.fromEntries(Object.entries(summary).map(([t,v])=>[t,v.count]))}));
}catch(error){
 // Driver messages can contain connection details; keep failures bounded.
 console.error(JSON.stringify({readOnly:true,completed:false,errorName:error.name,errorCode:error.code||null}));process.exitCode=1;
}
