import fs from 'node:fs';
import path from 'node:path';
import {parseEnv} from 'node:util';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const load=createRequire(path.join(process.cwd(),'package.json')),{chromium}=load('@playwright/test'),{neon}=load('@neondatabase/serverless');
const qa=parseEnv(fs.readFileSync('.env.qa.local','utf8'));assert.equal(new URL(qa.DATABASE_URL).pathname,'/rivya_qa_20260924');assert.equal(qa.RIVYA_DATA_MODE,'isolated');
const sql=neon(qa.DATABASE_URL),base='http://localhost:4187',results=[],pass=name=>{results.push({name,status:'pass'});console.log('PASS',name)};
const browser=await chromium.launch({executablePath:process.env.RIVYA_BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const c=await browser.newContext(),p=await c.newPage();await p.goto(base+'/studio/login');await p.getByLabel('Staff ID',{exact:true}).fill(qa.STUDIO_ADMIN_ID);await p.getByLabel('Password',{exact:true}).fill(qa.STUDIO_ADMIN_PASSWORD);await p.getByRole('button',{name:'Sign in',exact:true}).click();await p.waitForURL(base+'/studio');
 const id=(await sql`SELECT id FROM rivya_inquiries ORDER BY created_at DESC LIMIT 1`)[0].id;
 await sql`UPDATE rivya_privacy_controls SET ongoing_follow_up=false,hold_reason='',hold_review_on=NULL,deletion_requested_at=NULL,identity_verified_at=NULL,version=version+1 WHERE order_id=${id}::uuid`;
 const get=async()=>{const r=await c.request.get(base+'/api/studio/privacy?id='+id);assert.equal(r.status(),200);return r.json()};
 const send=data=>c.request.post(base+'/api/studio/privacy',{headers:{origin:base},data});
 let state=await get();const fields=()=>({id,version:state.record.version,lastContactAt:new Date(state.record.lastContactAt).toISOString(),ongoingFollowUp:false,holdReason:'',holdReviewOn:null,recordDeletionRequest:false,verifyIdentity:false});
 const anonymous=await browser.newContext();assert.equal((await anonymous.request.get(base+'/api/studio/privacy?id='+id)).status(),401);pass('Retention data requires authentication');
 assert.equal((await send({...fields(),lastContactAt:new Date(Date.now()+3600000).toISOString()})).status(),400);assert.equal((await send({...fields(),lastContactAt:'2020-01-01T00:00:00.000Z'})).status(),409);assert.equal((await send({...fields(),verifyIdentity:true})).status(),409);pass('Future/backdated contact and verification without a request are rejected');
 const updates=await Promise.all([1,2].map(()=>send({...fields(),holdReason:'Isolated QA active complaint',holdReviewOn:'2026-09-25'})));assert.deepEqual(updates.map(r=>r.status()).sort(),[200,409]);state=await get();assert.equal(state.decision.blocked,'Documented retention hold');pass('Concurrent retention edits preserve one versioned change and honor the hold');
 assert.equal((await send({...fields(),ongoingFollowUp:true,recordDeletionRequest:true,verifyIdentity:true})).status(),200);state=await get();assert.equal(state.decision.blocked,'Customer-requested ongoing follow-up');assert.ok(state.record.deletionRequestedAt);assert.ok(state.record.identityVerifiedAt);assert.equal(state.deletionAvailable,false);pass('Verified deletion request is recorded; ongoing follow-up pauses policy deletion without claiming erasure');
 let order=(await sql`SELECT version,status FROM rivya_studio_orders WHERE id=${id}::uuid`)[0];
 const move=await c.request.post(base+'/api/studio/orders',{headers:{origin:base},data:{action:'move',id,version:order.version,status:'COMPLETED'}});assert.equal(move.status(),200);state=await get();assert.equal(state.record.becameOrder,true);assert.ok(state.record.closedAt);pass('Order closure automatically records the retention boundary');
 order=(await sql`SELECT version,status FROM rivya_studio_orders WHERE id=${id}::uuid`)[0];assert.equal((await c.request.post(base+'/api/studio/orders',{headers:{origin:base},data:{action:'move',id,version:order.version,status:'IN_PRODUCTION',reason:'Isolated QA reopen check'}})).status(),200);state=await get();assert.equal(state.record.closedAt,null);assert.equal(state.record.becameOrder,true);pass('Reopening preserves accepted-order classification and clears closure eligibility');
 for(const route of ['/studio/inquiries','/studio/follow-ups','/studio/products','/studio/content','/studio/media','/studio/activity','/studio/staff','/studio/settings'])assert.equal((await c.request.get(base+route)).status(),200,route);
 pass('Every current Studio navigation destination resolves for an authenticated administrator');
 await p.goto(base+'/studio/inquiries?record='+id);await p.getByRole('heading',{name:'Privacy & retention',exact:true}).waitFor({timeout:30000});await p.getByLabel('Last meaningful customer interaction (IST)').waitFor();pass('Administrator can view retention controls inside the actual inquiry dialog');
 fs.mkdirSync('test-results/release-qa',{recursive:true});fs.writeFileSync('test-results/release-qa/privacy.json',JSON.stringify({at:new Date().toISOString(),scope:'isolated QA only',results,limitation:'Controls verified; submitted-data erasure and restoration replay are separate pending work.'},null,2));
}finally{await browser.close()}
