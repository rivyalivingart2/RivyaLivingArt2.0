import fs from 'node:fs';
import path from 'node:path';
import {parseEnv} from 'node:util';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {createRequire} from 'node:module';
const repo=process.cwd(),load=createRequire(path.join(repo,'package.json'));
const output=path.resolve('test-results/release-qa');fs.mkdirSync(output,{recursive:true});
const {chromium}=load('@playwright/test'),{neon}=load('@neondatabase/serverless');
const qa=parseEnv(fs.readFileSync(repo+'/.env.qa.local','utf8'));assert.equal(new URL(qa.DATABASE_URL).pathname,'/rivya_qa_20260924');assert.equal(qa.RIVYA_DATA_MODE,'isolated');
const sql=neon(qa.DATABASE_URL),base='http://localhost:4187',out=output+'/',results=[];
const seed=JSON.parse(fs.readFileSync(out+'order-browser.json','utf8')),id=seed.orderId,ref=seed.referenceId;
const pass=name=>{results.push({name,status:'pass'});console.log('PASS',name)};
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.RIVYA_BROWSER_EXECUTABLE||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
 async function login(user,password){const c=await browser.newContext();const p=await c.newPage();await p.goto(base+'/studio/login');await p.getByLabel('Staff ID',{exact:true}).fill(user);await p.getByLabel('Password',{exact:true}).fill(password);await p.getByRole('button',{name:'Sign in',exact:true}).click();await p.waitForURL(base+'/studio',{timeout:30000});return c;}
 const admin=await login(qa.STUDIO_ADMIN_ID,qa.STUDIO_ADMIN_PASSWORD);
 const post=(ctx,path,data)=>ctx.request.post(base+path,{headers:{origin:base},data});
 const get=(ctx,path)=>ctx.request.get(base+path);
 const unauth=await browser.newContext();for(const path of ['/api/studio/workspace?view=inquiry&id='+id,'/api/studio/orders','/api/studio/cleanup','/api/studio/operations?view=settings'])assert.equal((await get(unauth,path)).status(),401);pass('Private APIs reject unauthenticated access');
 assert.equal((await admin.request.post(base+'/api/studio/inquiry-handoff',{headers:{origin:'https://untrusted.invalid'},data:{id,action:'recover',reason:'Isolated security check'}})).status(),403);pass('Cross-origin mutations rejected');
 const original=(await sql`SELECT schema_snapshot,answer_snapshot,summary,message_destination FROM rivya_inquiries WHERE id=${id}::uuid`)[0];
 await sql`UPDATE rivya_inquiries SET summary='',message_finalized_at=NULL,message_state='handoff_failed',message_failure_code='render_failed',message_attempts=5 WHERE id=${id}::uuid`;
 const exhausted=await (await get(admin,'/api/studio/inquiry-handoff?id='+id)).json();assert.equal(exhausted.receipt.recoveryRequired,true);assert.equal(exhausted.receipt.retryAvailable,false);pass('Five failed attempts show administrator recovery instead of impossible retry');
 assert.equal((await post(admin,'/api/studio/inquiry-handoff',{id,action:'recover',reason:'x'})).status(),400);pass('Recovery requires recorded investigation');
 const responses=await Promise.all([1,2].map(()=>post(admin,'/api/studio/inquiry-handoff',{id,action:'recover',reason:'Isolated test: valid original snapshot confirmed; transient render fault removed.'})));assert.deepEqual(responses.map(r=>r.status()).sort(),[200,409]);
 const audit=await sql`SELECT count(*)::int AS count FROM rivya_audit WHERE action='inquiry:message-recovery' AND entity::jsonb->>'id'=${id}`;assert.equal(audit[0].count,1);pass('Concurrent recovery resets allowance once and writes one audit event');
 const reset=(await sql`SELECT schema_snapshot,answer_snapshot,message_destination,message_attempts,message_state FROM rivya_inquiries WHERE id=${id}::uuid`)[0];assert.deepEqual(reset.schema_snapshot,original.schema_snapshot);assert.deepEqual(reset.answer_snapshot,original.answer_snapshot);assert.equal(reset.message_destination,original.message_destination);assert.equal(reset.message_state,'handoff_pending');assert.equal(reset.message_attempts,0);pass('Recovery preserves original brief and destination without sending');
 const prepared=await post(admin,'/api/studio/inquiry-handoff',{id,action:'prepare'});assert.equal(prepared.status(),200);assert.equal((await prepared.json()).receipt.state,'handoff_ready');
 const handoff=await(await get(admin,'/api/studio/inquiry-handoff?id='+id+'&open=1')).json();assert.equal(handoff.receipt.summary,original.summary);assert.equal(new URL(handoff.whatsappUrl).hostname,'wa.me');assert.equal(new URL(handoff.whatsappUrl).pathname,'/918320404132');pass('Preparation recovers exact saved summary and approved WhatsApp destination');
 const staff=[];for(let n=0;n<2;n++){const loginId='qa.editor.'+Date.now()+'.'+n,password=randomBytes(20).toString('base64url');assert.equal((await post(admin,'/api/studio/workspace',{action:'staff',login:loginId,name:'Isolated QA Editor '+n,role:'editor',active:true,password})).status(),200);const row=(await sql`SELECT id,version FROM rivya_staff WHERE login=${loginId}`)[0];staff.push({...row,ctx:await login(loginId,password)});}
 const detail=async ctx=>(await get(ctx,'/api/studio/workspace?view=inquiry&id='+id));
 assert.equal((await detail(staff[0].ctx)).status(),404);let version=(await sql`SELECT version FROM rivya_studio_orders WHERE id=${id}::uuid`)[0].version;
 assert.equal((await post(admin,'/api/studio/workspace',{action:'assign',id,version,assignee:staff[0].id,followUp:'2026-09-24'})).status(),200);assert.equal((await detail(staff[0].ctx)).status(),200);assert.equal((await detail(staff[1].ctx)).status(),404);assert.equal((await get(staff[1].ctx,'/api/studio/references/'+ref)).status(),404);assert.equal((await get(staff[0].ctx,'/api/studio/references/'+ref)).status(),200);pass('Editor inquiry and private image access follows assignment');
 for(const path of ['/api/studio/cleanup','/api/studio/operations?view=settings'])assert.equal((await get(staff[0].ctx,path)).status(),403);assert.equal((await post(staff[0].ctx,'/api/studio/inquiry-handoff',{id,action:'recover',reason:'Should never authorize editor recovery'})).status(),403);pass('Editor cannot access administrator maintenance or recovery');
 version=(await sql`SELECT version FROM rivya_studio_orders WHERE id=${id}::uuid`)[0].version;
 const moves=await Promise.all(['CONTACTED','QUALIFIED'].map(status=>post(staff[0].ctx,'/api/studio/orders',{action:'move',id,version,status})));assert.deepEqual(moves.map(r=>r.status()).sort(),[200,409]);pass('Concurrent Kanban changes preserve one versioned winner');
 assert.equal((await post(staff[0].ctx,'/api/studio/workspace',{action:'note',id,note:'Isolated QA internal note'})).status(),200);pass('Assigned editor appends internal note');
 version=(await sql`SELECT version FROM rivya_studio_orders WHERE id=${id}::uuid`)[0].version;assert.equal((await post(admin,'/api/studio/workspace',{action:'assign',id,version,assignee:staff[1].id,followUp:null})).status(),200);assert.equal((await detail(staff[0].ctx)).status(),404);assert.equal((await get(staff[0].ctx,'/api/studio/references/'+ref)).status(),404);pass('Reassignment immediately removes former editor access');
 assert.equal((await post(admin,'/api/studio/workspace',{action:'revoke-staff',id:staff[1].id,version:staff[1].version})).status(),200);assert.equal((await get(staff[1].ctx,'/api/studio/orders')).status(),401);pass('Session revocation applies immediately');
 await sql`UPDATE rivya_studio_sessions SET idle_expires_at=now()-interval '1 minute' WHERE staff_id=${staff[0].id}::uuid`;assert.equal((await get(staff[0].ctx,'/api/studio/orders')).status(),401);pass('Idle expiry rejects a previously authenticated session');
 fs.writeFileSync(out+'studio-browser.json',JSON.stringify({at:new Date().toISOString(),scope:'isolated QA only',results},null,2));
 }finally{await browser.close()}
})().catch(e=>{console.error('FAIL',e.message);fs.writeFileSync(out+'studio-browser-failure.json',JSON.stringify({results,error:e.message},null,2));process.exitCode=1});
