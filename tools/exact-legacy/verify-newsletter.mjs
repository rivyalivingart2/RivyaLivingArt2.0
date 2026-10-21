import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {target,verifyDatabase} from './local-guard.mjs';
const config=JSON.parse(readFileSync('test-results/exact-legacy-2026-10-21/runtime/config.json','utf8'));
const {default:pg}=await import(pathToFileURL(config.pgModule).href),db=new pg.Client(target);await db.connect();
const root='http://127.0.0.1:4210',checks=[];
const send=(body,origin=root)=>fetch(root+'/api/newsletter',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
const input={email:'phase12-api@example.invalid',source:'footer',honeypot:''};
try{
 await verifyDatabase(db);
 assert.equal((await db.query('SELECT count(*)::int AS count FROM rivya_newsletter_subscribers WHERE email=$1',['phase12-browser@example.invalid'])).rows[0].count,1);checks.push('Browser submission persisted once');
 assert.equal((await send(input,'https://untrusted.invalid')).status,403);checks.push('Foreign origin refused');
 assert.equal((await send({...input,email:'invalid'})).status,400);checks.push('Invalid email refused');
 assert.equal((await send({...input,source:'untrusted'})).status,400);checks.push('Unknown source refused');
 assert.equal((await send({...input,email:'phase12-honeypot@example.invalid',honeypot:'bot'})).status,200);
 assert.equal((await db.query('SELECT count(*)::int AS count FROM rivya_newsletter_subscribers WHERE email=$1',['phase12-honeypot@example.invalid'])).rows[0].count,0);checks.push('Honeypot does not persist');
 const a=await send(input),b=await send({...input,email:'Phase12-API@Example.invalid'});assert.equal(a.status,200);assert.equal(b.status,200);assert.deepEqual(await a.json(),await b.json());
 assert.equal((await db.query('SELECT count(*)::int AS count FROM rivya_newsletter_subscribers WHERE email=$1',[input.email])).rows[0].count,1);checks.push('Repeat and mixed-case email are idempotent and do not reveal membership');
 await db.query('ALTER TABLE rivya_newsletter_subscribers RENAME TO rivya_newsletter_subscribers_failure_fixture');
 try{const failure=await send({...input,email:'phase12-unavailable@example.invalid'});assert.equal(failure.status,503);checks.push('Database failure returns honest retryable error');}
 finally{await db.query('ALTER TABLE rivya_newsletter_subscribers_failure_fixture RENAME TO rivya_newsletter_subscribers');}
 const receipt={at:new Date().toISOString(),scope:'isolated-loopback',checks,externalMessages:0,productionWrites:0};
 writeFileSync('test-results/exact-legacy-2026-10-21/newsletter-verification.json',JSON.stringify(receipt,null,2));console.log(receipt);
}finally{await db.end();}
