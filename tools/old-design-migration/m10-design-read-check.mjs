import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {writeFileSync} from 'node:fs';
import {localTarget} from './guard.mjs';
import {publishedDesignQuery} from '../../src/lib/published-design-query.ts';
import {candidateFingerprint} from './candidate-fingerprint.mjs';

assert.equal(globalThis.__rivyaMigrationLocalSql,true,'Use the guarded local runner');
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_MIGRATION_PG_MODULE).href);
const client=new pg.Client(localTarget),checks=[];
const check=name=>{checks.push(name);console.log('Passed: '+name);};
await client.connect();
try {
 await client.query('BEGIN');
 // A temporary relation shadows the application table only on this connection.
 await client.query('CREATE TEMP TABLE rivya_presentations (presentation_key text PRIMARY KEY, draft jsonb, published jsonb, version integer, published_version integer) ON COMMIT DROP');
 await client.query('SET LOCAL search_path = pg_temp');
 const read=async()=>(await client.query(publishedDesignQuery)).rows[0];
 assert.deepEqual(await read(),{presentation:null,orders:[]});check('Empty design store has no invented selection or order');
 const put=async(key,draft,published,version=9,publishedVersion=2)=>client.query('INSERT INTO rivya_presentations VALUES ($1,$2,$3,$4,$5)',[key,draft,published,version,publishedVersion]);
 await put('presentation:home',{layout:{hero:'draft-only'}},{layout:{hero:'cinematic'},home:{title:'Saved preview only'},dependencies:['private-fixture']});
 await put('editorial-order:archive:journal',{ids:['draft-only']},{scope:{key:'archive:journal',candidates:['candidate-only']},ids:['second','first'],entries:[{title:'Captured preview only'}],sourceStamp:{private:'fixture'}});
 await put('editorial-order:archive:portfolio',{ids:['unpublished']},null);
 await put('unrelated:fixture',null,{scope:{key:'ignored'},ids:['not-an-editorial-order']});
 assert.deepEqual(await read(),{presentation:{layout:{hero:'cinematic'},version:2},orders:[{scope:'archive:journal',ids:['second','first']}]});check('Published versions and exact order only; no draft or saved preview bodies');
 await client.query("UPDATE rivya_presentations SET draft=$1,version=10 WHERE presentation_key='presentation:home'",[{layout:{hero:'another-draft'}}]);
 assert.equal((await read()).presentation.layout.hero,'cinematic');check('Saving a draft cannot change public display');
 await client.query("UPDATE rivya_presentations SET published=$1,published_version=11 WHERE presentation_key='presentation:home'",[{layout:{hero:'split'}}]);
 await client.query("UPDATE rivya_presentations SET published=$1,published_version=12 WHERE presentation_key='editorial-order:archive:journal'",[{scope:{key:'archive:journal'},ids:['first','second']}]);
 assert.deepEqual(await read(),{presentation:{layout:{hero:'split'},version:11},orders:[{scope:'archive:journal',ids:['first','second']}]});check('A fresh read immediately sees new published layout and order');
 await client.query("UPDATE rivya_presentations SET published=NULL WHERE presentation_key IN ('presentation:home','editorial-order:archive:journal')");
 assert.deepEqual(await read(),{presentation:null,orders:[]});check('Withdrawal immediately removes both published projections');
 await client.query('ROLLBACK');
 const original=await client.query("SELECT to_regclass('public.rivya_presentations') IS NOT NULL AS retained");assert.equal(original.rows[0].retained,true);check('Temporary fixture rolled back; original presentation table retained');
 writeFileSync('test-results/old-design-migration/m10-loading-design-read.json',JSON.stringify({at:new Date().toISOString(),candidate:candidateFingerprint(),checks,passed:true,scope:'Isolated transaction with temporary fixtures; no original record changed'},null,2));
}finally{await client.query('ROLLBACK');await client.end();}
