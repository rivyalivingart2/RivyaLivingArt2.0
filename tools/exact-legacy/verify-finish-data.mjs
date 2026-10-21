/** Read-only verification of synthetic local browser submissions. Never live data. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {target,verifyDatabase} from './local-guard.mjs';
const root='test-results/exact-legacy-2026-10-21';
const config=JSON.parse(readFileSync(root+'/runtime/config.json','utf8'));
const {default:pg}=await import(pathToFileURL(config.pgModule).href);
const db=new pg.Client(target);
try{
 await db.connect();await verifyDatabase(db);
 await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 assert.equal((await db.query('SHOW transaction_read_only')).rows[0].transaction_read_only,'on');
 const browserCount=(await db.query('SELECT count(*)::int AS count FROM rivya_newsletter_subscribers WHERE email=$1',['phase12-final-browser@example.invalid'])).rows[0].count;
 assert.equal(browserCount,1);
 await db.query('ROLLBACK');
 const receipt={at:new Date().toISOString(),scope:'SYNTHETIC_LOOPBACK_ONLY',readOnly:true,latestBrowserSubscriptionPersistedExactlyOnce:true,productionBaseline:false};
 writeFileSync(root+'/finish-data-verification.json',JSON.stringify(receipt,null,2)+'\n');console.log(receipt);
}finally{await db.end();}
