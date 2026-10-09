import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {localTarget} from './guard.mjs';
assert.equal(globalThis.__rivyaMigrationLocalSql,true,'Use the guarded local runner');
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_MIGRATION_PG_MODULE).href);
const client=new pg.Client(localTarget);await client.connect();
try{
 const identity=(await client.query('SELECT current_database() AS database,current_user AS role')).rows[0];
 assert.deepEqual(identity,{database:localTarget.database,role:localTarget.user});
 const schema=readFileSync('scripts/presentation-schema.sql','utf8');
 for(let i=0;i<2;i++){await client.query('BEGIN');await client.query(schema);await client.query('COMMIT');}
 const tables=(await client.query("SELECT table_name FROM information_schema.tables WHERE table_name IN ('rivya_presentations','rivya_presentation_revisions') ORDER BY table_name")).rows.map(r=>r.table_name);
 assert.equal(tables.length,2);
 writeFileSync('test-results/old-design-migration/m3-schema.json',JSON.stringify({at:new Date().toISOString(),target:'dedicated loopback QA',applications:2,tables,existingRecordsUpdated:0},null,2)+'\n');
 console.log('Additive presentation schema applied twice to isolated local QA.');
}finally{await client.end();}
