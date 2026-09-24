import fs from 'node:fs';
import path from 'node:path';
import {parseEnv} from 'node:util';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createRequire} from 'node:module';
const repo=process.cwd(),load=createRequire(path.join(repo,'package.json'));
const {chromium}=load('@playwright/test'),{neon}=load('@neondatabase/serverless');
const qa=parseEnv(fs.readFileSync('.env.qa.local','utf8')),live=parseEnv(fs.readFileSync('.env.local','utf8'));
assert.equal(new URL(qa.DATABASE_URL).pathname,'/rivya_qa_20260924');assert.equal(qa.RIVYA_DATA_MODE,'isolated');assert.notEqual(qa.DATABASE_URL,live.DATABASE_URL);
const sql=neon(qa.DATABASE_URL),base='http://localhost:4187',results=[];
const pass=name=>{results.push({name,status:'pass'});console.log('PASS',name)};
const browser=await chromium.launch({executablePath:process.env.RIVYA_BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const c=await browser.newContext(),p=await c.newPage();await p.goto(base+'/studio/login');await p.getByLabel('Staff ID',{exact:true}).fill(qa.STUDIO_ADMIN_ID);await p.getByLabel('Password',{exact:true}).fill(qa.STUDIO_ADMIN_PASSWORD);await p.getByRole('button',{name:'Sign in',exact:true}).click();await p.waitForURL(base+'/studio');
 const post=data=>c.request.post(base+'/api/studio/cleanup',{headers:{origin:base},data});
 const run=randomUUID(),expired='qa-expired-'+run,active='qa-active-'+run,empty=randomUUID(),retained=randomUUID();
 await sql`INSERT INTO rivya_studio_login_limits(key,attempts,reset_at) VALUES(${expired},3,now()-interval '2 days'),(${active},7,now()+interval '1 hour')`;
 await sql`INSERT INTO rivya_inquiry_upload_sessions(request_key,guest_hash,created_at) VALUES(${empty}::uuid,'isolated-maintenance',now()-interval '2 days'),(${retained}::uuid,'isolated-maintenance',now())`;
 const metadata=await post({confirm:'delete-expired-access-metadata'});assert.equal(metadata.status(),200);assert.equal((await sql`SELECT key FROM rivya_studio_login_limits WHERE key=${expired}`).length,0);assert.equal((await sql`SELECT attempts FROM rivya_studio_login_limits WHERE key=${active}`)[0].attempts,7);assert.equal((await sql`SELECT request_key FROM rivya_inquiry_upload_sessions WHERE request_key=${empty}::uuid`).length,0);assert.equal((await sql`SELECT request_key FROM rivya_inquiry_upload_sessions WHERE request_key=${retained}::uuid`).length,1);pass('Expired metadata is removed while active counters and forms remain');
 const blocked=randomUUID(),stale=randomUUID(),fresh=randomUUID(),retry=randomUUID();
 // Paths have no objects. Idempotent provider deletion is exercised without customer images.
 for(const [id,age,lease,invalid] of [[blocked,48,true,false],[stale,48,false,false],[fresh,1,false,false],[retry,48,false,true]]){
  await sql`INSERT INTO rivya_inquiry_upload_sessions(request_key,guest_hash,used_slots,created_at) VALUES(${id}::uuid,'isolated-maintenance',1,now()-(${age}*interval '1 hour'))`;
  await sql`INSERT INTO rivya_references(id,guest_hash,request_key,pathname,bytes,state,storage_provider,created_at,write_expires_at,write_token) VALUES(${id}::uuid,'isolated-maintenance',${id}::uuid,${invalid?'invalid-qa-path-'+id:'references/'+id+'.jpg'},1,'pending','vercel',now()-(${age}*interval '1 hour'),${lease?new Date(Date.now()+300000).toISOString():null}::timestamptz,${lease?randomUUID():null}::uuid)`;
 }
 await sql`UPDATE rivya_storage_budget SET bytes=bytes+4 WHERE id=1`;
 const linkedBefore=(await sql`SELECT count(*)::int AS count FROM rivya_references WHERE inquiry_id IS NOT NULL`)[0].count;
 const cleanup=await post({confirm:'delete-expired-unsubmitted'});assert.equal(cleanup.status(),200);const result=await cleanup.json();assert.ok(result.removed>=1);assert.ok(result.failed>=1);
 assert.equal((await sql`SELECT id FROM rivya_references WHERE id=${stale}::uuid`).length,0);
 for(const id of [blocked,fresh,retry])assert.equal((await sql`SELECT id FROM rivya_references WHERE id=${id}::uuid`).length,1);
 assert.equal((await sql`SELECT count(*)::int AS count FROM rivya_references WHERE inquiry_id IS NOT NULL`)[0].count,linkedBefore);pass('Cleanup excludes active uploads, recent uploads and saved references; uncertain deletion remains retryable');
 await sql`UPDATE rivya_references SET pathname=${'references/'+retry+'.jpg'} WHERE id=${retry}::uuid`;
 assert.equal((await post({confirm:'delete-expired-unsubmitted'})).status(),200);assert.equal((await sql`SELECT id FROM rivya_references WHERE id=${retry}::uuid`).length,0);pass('Retry completes retained deletion without double-removing quota');
 const linkedAfter=(await sql`SELECT COALESCE(sum(bytes),0)::bigint AS bytes FROM rivya_references`)[0].bytes,budget=(await sql`SELECT bytes FROM rivya_storage_budget WHERE id=1`)[0].bytes;assert.equal(String(budget),String(linkedAfter));pass('Storage quota matches retained reference reservations');
 fs.mkdirSync('test-results/release-qa',{recursive:true});fs.writeFileSync('test-results/release-qa/maintenance.json',JSON.stringify({at:new Date().toISOString(),scope:'isolated QA only',results},null,2));
}finally{await browser.close()}
