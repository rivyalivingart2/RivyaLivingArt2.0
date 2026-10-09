import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {neon} from '@neondatabase/serverless';
const label=process.argv[2];assert.match(label||'',/^[a-z0-9-]+$/);
const config=parseEnv(readFileSync(process.env.RIVYA_PROTECTED_READ_CONFIG,'utf8'));
const url=new URL(config.DATABASE_URL);
assert.equal(url.hostname,'ep-delicate-silence-awjxadrd-pooler.c-12.us-east-1.aws.neon.tech');
assert.equal(url.pathname,'/neondb');assert.equal(url.username,'rivya_runtime_20260924');
const sql=neon(config.DATABASE_URL);
const result=await sql.transaction([
 sql.query('SHOW transaction_read_only'),
 sql.query("SELECT current_database() AS database,current_user AS role,has_schema_privilege(current_user,'public','CREATE') AS schema_create"),
 sql.query("SELECT table_name,privilege_type FROM information_schema.role_table_grants WHERE grantee=current_user AND table_schema='public' AND table_name IN ('rivya_presentations','rivya_presentation_revisions') ORDER BY table_name,privilege_type"),
 sql.query("SELECT presentation_key,version,published_version,draft->'layout' AS draft_layout,published->'layout' AS public_layout,published->'media' AS media,(SELECT count(*) FROM rivya_presentation_revisions h WHERE h.presentation_key=p.presentation_key) AS history_count FROM rivya_presentations p ORDER BY presentation_key"),
 sql.query("SELECT table_name,column_name,data_type,is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('rivya_presentations','rivya_presentation_revisions') ORDER BY table_name,ordinal_position"),
 sql.query("SELECT c.relname AS table_name,c.relowner::regrole::text AS owner FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relname IN ('rivya_presentations','rivya_presentation_revisions') ORDER BY c.relname"),
 sql.query("SELECT presentation_key,version,operation FROM rivya_presentation_revisions ORDER BY presentation_key,version")
],{readOnly:true,isolationLevel:'RepeatableRead'});
assert.equal(result[0][0].transaction_read_only,'on');assert.equal(result[1][0].schema_create,false);
assert.deepEqual(result[2].map(r=>r.table_name+':'+r.privilege_type),[
 'rivya_presentation_revisions:INSERT','rivya_presentation_revisions:SELECT',
 'rivya_presentations:INSERT','rivya_presentations:SELECT','rivya_presentations:UPDATE'
]);
assert.deepEqual(result[4].map(c=>c.table_name+':'+c.column_name),[
 'rivya_presentation_revisions:presentation_key','rivya_presentation_revisions:version','rivya_presentation_revisions:document','rivya_presentation_revisions:actor','rivya_presentation_revisions:operation','rivya_presentation_revisions:created_at',
 'rivya_presentations:presentation_key','rivya_presentations:draft','rivya_presentations:published','rivya_presentations:version','rivya_presentations:published_version','rivya_presentations:updated_by','rivya_presentations:updated_at'
]);assert.equal(result[5].length,2);assert.ok(result[5].every(t=>t.owner==='neondb_owner'));
const report={at:new Date().toISOString(),readOnly:true,identity:result[1][0],grants:result[2],presentations:result[3],columns:result[4],owners:result[5],history:result[6]};
writeFileSync('test-results/old-design-migration/production-presentation-'+label+'.json',JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({readOnly:true,columns:result[4].length,tables:result[5].length,grants:result[2],presentations:result[3].map(p=>({key:p.presentation_key,version:p.version,publishedVersion:p.published_version,historyCount:p.history_count,film:p.public_layout?.film,pages:Object.keys(p.public_layout?.pages||{})})),history:result[6]}));
