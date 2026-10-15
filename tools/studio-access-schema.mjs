import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {localTarget} from './old-design-migration/guard.mjs';
assert.equal(globalThis.__rivyaMigrationLocalSql,true,'Use the guarded localhost runner');
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_MIGRATION_PG_MODULE).href);
const client=new pg.Client(localTarget);await client.connect();
try{
 assert.equal((await client.query('select current_database() as db')).rows[0].db,localTarget.database);
 const schema=await readFile('scripts/studio-access-migration.sql','utf8');
 await client.query(schema);await client.query(schema);
 console.log('Access-request schema applied twice to isolated local QA only.');
}finally{await client.end();}
