/** Add only named synthetic cases to the already prepared, isolated old app. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=resolve('test-results/exact-legacy-2026-10-21/old-runtime');
const current=JSON.parse(readFileSync('test-results/exact-legacy-2026-10-21/runtime/config.json','utf8'));
const {default:pg}=await import(pathToFileURL(current.pgModule).href);
const db=new pg.Client({host:'127.0.0.1',port:55444,user:'rivya_old_reference',database:'rivya_old_reference'});
try{
 await db.connect();
 assert.equal(resolve((await db.query('SHOW data_directory')).rows[0].data_directory).toLowerCase(),resolve(root,'pgdata').toLowerCase());
 assert.equal((await db.query('SELECT inet_server_port() AS port')).rows[0].port,55444);
 await db.query('BEGIN');
 for(const status of ['DRAFT','ARCHIVED']){
  const slug='synthetic-reference-'+status.toLowerCase();
  await db.query('INSERT INTO "Product"(id,title,slug,description,status,"categoryId","updatedAt") VALUES($1,$2,$3,$4,$5,\'local-reference-category\',now()) ON CONFLICT(id) DO NOTHING',[slug,'Synthetic reference '+status.toLowerCase(),slug,'Isolated workflow fixture; not a genuine product.',status]);
 }
 // Explicit concept label in the source template, equivalent to the new preview.
 const project=await db.query('SELECT id,title,"resultsMeta" FROM "Portfolio"');
 assert.equal(project.rows.length,1);assert.equal(project.rows[0].id,'local-reference-project');
 assert.equal(project.rows[0].title,'Synthetic reference project');
 await db.query('UPDATE "Portfolio" SET "resultsMeta"=$1 WHERE id=\'local-reference-project\'',[JSON.stringify({...project.rows[0].resultsMeta,kind:'concept-study'})]);
 await db.query('COMMIT');
 const counts=(await db.query('SELECT (SELECT count(*)::int FROM "User") AS users,(SELECT count(*)::int FROM "Category") AS categories,(SELECT count(*)::int FROM "Portfolio") AS projects,(SELECT count(*)::int FROM "Product") AS products')).rows[0];
 assert.deepEqual(counts,{users:1,categories:1,projects:1,products:2});
 const receipt=JSON.parse(readFileSync(resolve(root,'receipt.json'),'utf8'));
 receipt.fixtures=counts;receipt.extendedAt=new Date().toISOString();
 receipt.limitations=[...new Set([...receipt.limitations,'English /en prefix used in isolated dev routing; deployed URL parity not claimed'])];
 writeFileSync(resolve(root,'receipt.json'),JSON.stringify(receipt,null,2));
 console.log(JSON.stringify({synthetic:true,productionAccess:false,counts}));
}catch(error){await db.query('ROLLBACK').catch(()=>{});throw error;}finally{await db.end();}
