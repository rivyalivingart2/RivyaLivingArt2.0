import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {neon} from '@neondatabase/serverless';
const config=parseEnv(readFileSync(process.env.RIVYA_PROTECTED_READ_CONFIG,'utf8'));
const url=new URL(config.DATABASE_URL);
assert.equal(url.hostname,'ep-delicate-silence-awjxadrd-pooler.c-12.us-east-1.aws.neon.tech');
assert.equal(url.pathname,'/neondb');assert.equal(url.username,'rivya_runtime_20260924');
const sql=neon(config.DATABASE_URL);
const rows=await sql.transaction([
 sql.query('SHOW transaction_read_only'),
 sql.query("SELECT has_schema_privilege(current_user,'public','CREATE') AS can_create, to_regclass('public.rivya_presentations') IS NOT NULL AS presentations, to_regclass('public.rivya_presentation_revisions') IS NOT NULL AS revisions")
],{readOnly:true,isolationLevel:'RepeatableRead'});
assert.equal(rows[0][0].transaction_read_only,'on');
const report={at:new Date().toISOString(),readOnly:true,...rows[1][0]};
writeFileSync('test-results/old-design-migration/release-schema.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
