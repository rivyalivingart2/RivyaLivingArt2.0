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
 await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 assert.equal((await db.query('SHOW transaction_read_only')).rows[0].transaction_read_only,'on');
 assert.equal((await db.query('SELECT title FROM "Product" WHERE id=\'synthetic-reference-draft\'')).rows[0].title,'Synthetic reference draft');
 assert.equal((await db.query('SELECT count(*)::int AS count FROM "Subscriber" WHERE email=\'old-reference-browser@example.invalid\'')).rows[0].count,1);
 await db.query('ROLLBACK');
 const http=[];
 for(const route of ['/en/product/synthetic-reference-draft','/en/product/synthetic-reference-archived','/en/portfolio/phase1-missing-project']){
  const response=await fetch('http://127.0.0.1:4212'+route,{redirect:'manual',signal:AbortSignal.timeout(15000)});
  http.push({route,status:response.status,location:response.headers.get('location')});await response.body?.cancel();
 }
 const receipt={at:new Date().toISOString(),scope:'SYNTHETIC_LOCAL_OLD_REFERENCE_ONLY',productionSourceBaseline:false,readOnlyVerification:true,checks:{discardedTitleUnchanged:true,subscriberSavedExactlyOnce:true},http,limitations:['Real old database credentials and exports are still unavailable.','System-component preview bypasses only the broken local status rewrite; it is not HTTP-status verification.']};
 writeFileSync(resolve(root,'observations.json'),JSON.stringify(receipt,null,2));console.log(receipt);
}finally{await db.end();}
