import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {target,verifyDatabase} from '../local-guard.mjs';
const root='test-results/exact-legacy-2026-10-21/phase3-implementation';mkdirSync(root,{recursive:true});
const config=JSON.parse(readFileSync('test-results/exact-legacy-2026-10-21/runtime/config.json','utf8'));
const {default:pg}=await import(pathToFileURL(config.pgModule).href),db=new pg.Client(target);
const sql=readFileSync('scripts/restoration-phase3-schema.sql','utf8');
const names=['rivya_editorial_extensions','rivya_editorial_extension_revisions','rivya_restoration_crosswalk','rivya_restoration_conflicts'];
try{
 await db.connect();await verifyDatabase(db);
 // Schema replay is additive and independent of all original business tables.
 await db.query(sql);const columns=await db.query('SELECT table_name,column_name,data_type,is_nullable FROM information_schema.columns WHERE table_name=ANY($1) ORDER BY table_name,ordinal_position',[names]);
 await db.query(sql);assert.deepEqual((await db.query('SELECT table_name,column_name,data_type,is_nullable FROM information_schema.columns WHERE table_name=ANY($1) ORDER BY table_name,ordinal_position',[names])).rows,columns.rows);
 const counts=async()=>Object.fromEntries(await Promise.all(names.map(async name=>[name,Number((await db.query('SELECT count(*) AS count FROM '+name)).rows[0].count)])));
 const before=await counts();
 await db.query('BEGIN');
 const key='__transaction_rehearsal_only__',document={schemaVersion:1,kind:'category',key,description:'Transactional rollback probe; never committed'};
 await db.query('INSERT INTO rivya_editorial_extensions(kind,entity_key,draft,updated_by) VALUES($1,$2,$3,$4)',['category',key,document,'local-rehearsal']);
 const stale=await db.query('UPDATE rivya_editorial_extensions SET version=version+1 WHERE kind=$1 AND entity_key=$2 AND version=$3 RETURNING version',['category',key,99]);assert.equal(stale.rowCount,0);
 const changed=await db.query('UPDATE rivya_editorial_extensions SET version=version+1 WHERE kind=$1 AND entity_key=$2 AND version=$3 RETURNING version',['category',key,1]);assert.equal(changed.rows[0].version,2);
 await db.query('ROLLBACK');assert.deepEqual(await counts(),before);
 const receipt={at:new Date().toISOString(),scope:'isolated-loopback-only',schemaReplay:'passed',staleRevisionRejected:true,rollbackRestoredExactCounts:true,tables:names,columnCount:columns.rows.length,sourceRecordsImported:0,productWrites:0,productionAccess:false};
 writeFileSync(root+'/schema-verification.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt,null,2));
}finally{await db.end();}
