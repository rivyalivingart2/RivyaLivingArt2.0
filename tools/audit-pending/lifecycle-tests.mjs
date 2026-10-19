import assert from 'node:assert/strict';
import {randomUUID,randomBytes,createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {writeFileSync} from 'node:fs';
import {pool,network,target} from './lifecycle-transport.mjs';
import * as fakeBlob from './lifecycle-blob.mjs';

const report={at:new Date().toISOString(),scope:'Wholly synthetic, new disposable local PostgreSQL. Actual services and route handlers; cookie/cache context and Blob SDK are test adapters, not a browser, HTTP-server or cloud-provider test.',target,checks:[],limitations:['No real Blob byte/permission/deletion certification.','No production data, protected QA data or private fixtures copied.','CMS handlers receive Web Requests directly; framework cookie context and cache invalidation are adapters.','External fetch and alternate SQL targets are refused by the test transport; this is not an OS-wide egress firewall.'],network};
const pass=(name,details={})=>report.checks.push({name,status:'pass',...details});
const origin='http://127.0.0.1:4207';
globalThis.__lifecycleCookie='';globalThis.__lifecycleInvalidations=[];
const adapters=registerHooks({resolve(specifier,context,next){
 if(specifier==='server-only')return {url:'data:text/javascript,export{}',shortCircuit:true};
 if(specifier==='@vercel/blob')return {url:pathToFileURL(resolve('tools/audit-pending/lifecycle-blob.mjs')).href,shortCircuit:true};
 if(specifier==='next/headers')return {url:'data:text/javascript,'+encodeURIComponent('export async function headers(){return new Headers()} export async function cookies(){return {get(){return globalThis.__lifecycleCookie?{value:globalThis.__lifecycleCookie}:undefined;}}}'),shortCircuit:true};
 if(specifier==='next/cache')return {url:'data:text/javascript,'+encodeURIComponent('export function revalidatePath(...args){globalThis.__lifecycleInvalidations.push(args)}'),shortCircuit:true};
 return next(specifier,context);
}});
const {studioDb}=await import('../../src/lib/studio-db.ts');
const {eraseOrderData,replayErasureLedger,ErasureConflict}=await import('../../src/lib/erasure-execution.ts');
const {saveReference,readReference}=await import('../../src/lib/reference-storage.ts');
const {readOrder}=await import('../../src/lib/order-handoff.ts');
const {createStudioSession,hashStaffPassword,authenticateStaff}=await import('../../src/lib/studio-auth.ts');
const content=await import('../../src/app/api/studio/content/route.ts');
const revisions=await import('../../src/app/api/studio/revisions/route.ts');
const privacy=await import('../../src/app/api/studio/privacy/route.ts');
const reference=await import('../../src/app/api/studio/references/[id]/route.ts');
const {readPublishedSource}=await import('../../src/lib/published-source.ts');
const sql=studioDb();
const hash=value=>createHash('sha256').update(value).digest('hex');
const query=(text,values=[])=>pool.query(text,values);
const one=async(text,values=[])=>(await query(text,values)).rows[0];
const fingerprints=async()=>{
 const names=(await query("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'rivya_%' AND tablename NOT IN('rivya_studio_sessions','rivya_studio_login_limits') ORDER BY tablename")).rows;
 const out={};for(const {tablename} of names){assert.match(tablename,/^rivya_[a-z0-9_]+$/);const rows=(await query(`SELECT md5(row_to_json(t)::text) AS hash FROM ${tablename} t ORDER BY 1`)).rows;out[tablename]=hash(JSON.stringify(rows));}return out;
};
async function staff(role){const id=randomUUID(),login='synthetic-lifecycle-'+role,password=randomBytes(24).toString('hex');await query('INSERT INTO rivya_staff(id,login,name,password_hash,role) VALUES($1,$2,$3,$4,$5)',[id,login,'SYNTHETIC LOCAL '+role,await hashStaffPassword(password),role]);const identity=await authenticateStaff(login,password);assert.equal(identity.staffId,id);return {id,cookie:await createStudioSession(identity)};}
async function handler(module,method,path,cookie,body,requestOrigin=origin){globalThis.__lifecycleCookie=cookie;const request=new Request(origin+path,{method,headers:{Origin:requestOrigin,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});const response=await module[method](request);return {status:response.status,headers:response.headers,value:await response.json()};}
async function refRequest(id,cookie){globalThis.__lifecycleCookie=cookie;return reference.GET(new Request(origin+'/api/studio/references/'+id),{params:Promise.resolve({id})});}
async function fixture({withReference=false,contract=1}={}){
 const id=randomUUID(),key=randomUUID(),guest=hash(randomUUID()),refId=randomUUID(),path='references/'+refId+'.jpg';
 await query("INSERT INTO rivya_studio_orders(id,client,title) VALUES($1,'SYNTHETIC PERSON','SYNTHETIC PRIVATE BRIEF')",[id]);
 if(contract===1)await query("INSERT INTO rivya_inquiries(id,reference,guest_hash,request_key,payload_hash,product_id,product_snapshot,name,phone,email,answers,notes,summary) VALUES($1,$2,$3,$4,$3,'synthetic-piece',$5,'SYNTHETIC PERSON','0000000000','synthetic@example.invalid',$6,'SYNTHETIC NOTE','SYNTHETIC PRIVATE BRIEF')",[id,'LOCAL-'+id,guest,key,{id:'synthetic-piece',name:'SYNTHETIC PIECE'},{detail:'SYNTHETIC ANSWER'}]);
 else await query("INSERT INTO rivya_inquiries(id,reference,guest_hash,request_key,payload_hash,product_id,product_snapshot,name,phone,email,answers,notes,summary,contract_version,request_kind,schema_id,schema_version,schema_snapshot,answer_snapshot,submission_source,source_route,consent_version,consent_accepted_at,reference_count,message_state,message_template_version,message_destination,destination_config_version,message_finalized_at) VALUES($1,$2,$3,$4,$3,NULL,NULL,'SYNTHETIC PERSON','0000000000','synthetic@example.invalid',$5,'SYNTHETIC NOTE','SYNTHETIC PRIVATE BRIEF',2,'bespoke','synthetic-schema',1,'{}','[]','website','/commission','synthetic-consent',now(),$6,'handoff_ready','synthetic-template','919000000000',1,now())",[id,'LOCAL-'+id,guest,key,{detail:'SYNTHETIC ANSWER'},withReference?1:0]);
 await query("INSERT INTO rivya_inquiry_notes(inquiry_id,actor,body) VALUES($1,'synthetic-operator','SYNTHETIC PRIVATE NOTE')",[id]);
 await query("INSERT INTO rivya_studio_order_events(order_id,actor,to_status,version,reason) VALUES($1,'synthetic-operator','NEW',1,'SYNTHETIC PRIVATE REASON')",[id]);
 await query("INSERT INTO rivya_audit(actor,action,entity) VALUES('synthetic-operator','inquiry:message-recovery',$1)",[JSON.stringify({id,reason:'SYNTHETIC PRIVATE REASON'})]);
 if(withReference){await query('INSERT INTO rivya_inquiry_upload_sessions(request_key,guest_hash,used_slots,finalized) VALUES($1,$2,1,true)',[key,guest]);await query("INSERT INTO rivya_references(id,guest_hash,request_key,pathname,bytes,inquiry_id,storage_provider,state,normalized_mime,linked_at) VALUES($1,$2,$3,$4,128,$5,'vercel','ready','image/jpeg',now())",[refId,guest,key,path,id]);await query('UPDATE rivya_storage_budget SET bytes=bytes+128 WHERE id=1');}
 return {id,key,guest,refId,path};
}
async function verifyRequest(f){await query('UPDATE rivya_privacy_controls SET deletion_requested_at=now(),identity_verified_at=now() WHERE order_id=$1',[f.id]);}
async function version(f){return (await one('SELECT version FROM rivya_privacy_controls WHERE order_id=$1',[f.id])).version;}
async function erased(f){const i=await one('SELECT * FROM rivya_inquiries WHERE id=$1',[f.id]),o=await one('SELECT * FROM rivya_studio_orders WHERE id=$1',[f.id]);assert.equal(i.name,'[ERASED]');assert.equal(i.phone,'');assert.equal(i.email,'');assert.equal(i.notes,'');assert.deepEqual(i.answers,{});assert.equal(i.assignee,null);assert.equal(i.follow_up,null);assert.notEqual(i.guest_hash,f.guest);assert.notEqual(i.payload_hash,f.guest);assert.equal(o.client,'[ERASED]');assert.equal((await one('SELECT count(*)::int AS n FROM rivya_inquiry_notes WHERE inquiry_id=$1',[f.id])).n,0);assert.equal((await one('SELECT count(*)::int AS n FROM rivya_studio_order_events WHERE order_id=$1 AND reason IS NOT NULL',[f.id])).n,0);assert.equal((await one("SELECT entity::jsonb->>'reason' AS reason FROM rivya_audit WHERE action='inquiry:message-recovery' AND entity::jsonb->>'id'=$1",[f.id])).reason,'[Personal details removed by erasure]');assert.equal(await readOrder(f.id,{kind:'guest',guest:f.guest,key:f.key}),undefined);assert.equal(await readOrder(f.id,{kind:'staff',admin:true,staffId:null}),undefined);}

try{
 await assert.rejects(()=>fetch('https://example.invalid/'),/refuses external/);pass('External fetch calls are refused by the test transport');
 await assert.rejects(()=>fetch('https://unused.invalid/sql',{headers:{'Neon-Connection-String':'postgresql://rivya_migration_qa@localhost:55439/rivya_migration_local'},body:'{}'}),/every other database/);pass('Original protected QA connection is refused');
 await assert.rejects(()=>sql.transaction([sql`INSERT INTO rivya_audit(actor,action,entity) VALUES('synthetic','readonly','test')`],{readOnly:true}));assert.equal((await one("SELECT count(*)::int AS n FROM rivya_audit WHERE action='readonly'")).n,0);pass('Transport enforces read-only transactions');
 await assert.rejects(()=>sql.transaction([sql`INSERT INTO rivya_audit(actor,action,entity) VALUES('synthetic','rollback','test')`,sql`SELECT 1/0`]));assert.equal((await one("SELECT count(*)::int AS n FROM rivya_audit WHERE action='rollback'")).n,0);pass('Transport rolls back a failed transaction');
 const admin=await staff('admin'),editor=await staff('editor');
 const f=await fixture({withReference:true,contract:2});
 await query('UPDATE rivya_inquiries SET assignee=$1,follow_up=current_date WHERE id=$2',[editor.id,f.id]);
 assert.equal((await refRequest(f.refId,'')).status,401);pass('Private reference handler denies anonymous access');
 process.env.BLOB_READ_WRITE_TOKEN=fakeBlob.token;
 const bytes=Buffer.alloc(128,17);await saveReference(f.path,bytes,'vercel');
 await assert.rejects(()=>saveReference(f.path,bytes,'vercel'),/duplicate/);pass('Fake SDK: reference adapter preserves no-overwrite private upload contract');
 assert.deepEqual(Buffer.from(await new Response(await readReference(f.path,'vercel')).arrayBuffer()),bytes);pass('Fake SDK: stored private bytes round-trip through real reference adapter');
 const allowed=await refRequest(f.refId,editor.cookie);assert.equal(allowed.status,200);assert.equal(allowed.headers.get('cache-control'),'private, no-store');assert.equal(allowed.headers.get('x-content-type-options'),'nosniff');assert.deepEqual(Buffer.from(await allowed.arrayBuffer()),bytes);pass('Fake SDK: assigned editor reads reference bytes with private response headers');
 await query('UPDATE rivya_inquiries SET assignee=NULL WHERE id=$1',[f.id]);assert.equal((await refRequest(f.refId,editor.cookie)).status,404);pass('Private reference handler denies unassigned editor');
 assert.equal((await refRequest(f.refId,admin.cookie)).status,200);pass('Fake SDK: administrator can read synthetic reference');
 await query('UPDATE rivya_inquiries SET assignee=$1 WHERE id=$2',[editor.id,f.id]);
 const before=await fingerprints();await assert.rejects(()=>eraseOrderData(f.id,'synthetic','customer_request',1),ErasureConflict);assert.deepEqual(await fingerprints(),before);pass('Missing identity/request verification denies erasure without mutation');
 await verifyRequest(f);
 for(const [field,value,label] of [['hold_reason','SYNTHETIC HOLD','documented hold'],['ongoing_follow_up',true,'ongoing follow-up'],['became_order',true,'open accepted order']]){await query(`UPDATE rivya_privacy_controls SET ${field}=$1 WHERE order_id=$2`,[value,f.id]);const saved=await fingerprints();await assert.rejects(()=>eraseOrderData(f.id,'synthetic','customer_request',1),ErasureConflict);assert.deepEqual(await fingerprints(),saved);await query(`UPDATE rivya_privacy_controls SET ${field}=$1 WHERE order_id=$2`,[typeof value==='boolean'?false:'',f.id]);pass(label+' denies erasure without mutation');}
 const staleBefore=await fingerprints();await assert.rejects(()=>eraseOrderData(f.id,'synthetic','customer_request',999),ErasureConflict);assert.deepEqual(await fingerprints(),staleBefore);pass('Stale privacy revision denies erasure without mutation');
 const erasedBody={id:f.id,version:1,action:'erase',confirm:'confirm-erasure',reason:'customer_request'};
 assert.equal((await handler(privacy,'POST','/api/studio/privacy',editor.cookie,erasedBody)).status,403);pass('Privacy handler refuses editor erasure');
 assert.equal((await handler(privacy,'POST','/api/studio/privacy',admin.cookie,erasedBody,'https://example.invalid')).status,403);pass('Privacy handler refuses mismatched origin');
 assert.equal((await handler(privacy,'POST','/api/studio/privacy',admin.cookie,{...erasedBody,confirm:'wrong'})).status,400);pass('Privacy handler requires exact destructive confirmation');
 await query("INSERT INTO rivya_managed_exports(actor,row_count,criteria) VALUES('synthetic',1,'{\"synthetic\":true}')");
 delete process.env.BLOB_READ_WRITE_TOKEN;
 const pending=await handler(privacy,'POST','/api/studio/privacy',admin.cookie,erasedBody);assert.equal(pending.status,200);assert.equal(pending.value.erased,false);assert.equal(pending.value.result.pendingReferences,1);await erased(f);pass('Actual privacy handler anonymizes and revokes access despite missing provider; reports pending deletion');
 const refPending=await one('SELECT * FROM rivya_references WHERE id=$1',[f.refId]);assert.equal(refPending.state,'deleting');assert.notEqual(refPending.guest_hash,f.guest);assert.equal((await one('SELECT bytes FROM rivya_storage_budget WHERE id=1')).bytes,'128');assert.equal((await one('SELECT used_slots FROM rivya_inquiry_upload_sessions WHERE request_key=$1',[f.key])).used_slots,1);assert.equal((await refRequest(f.refId,admin.cookie)).status,404);pass('Failed provider deletion retains inaccessible metadata and quota for retry');
 const exportState=await one('SELECT * FROM rivya_managed_exports');assert.ok(exportState.invalidated_at);assert.deepEqual(exportState.criteria,{});pass('Erasure invalidates synthetic export metadata');
 let ledger=await one('SELECT * FROM rivya_erasure_ledger WHERE order_id=$1',[f.id]);assert.equal(ledger.notes_purged,1);assert.equal(ledger.references_deleted,0);assert.equal(ledger.reason,'customer_request');pass('Erasure ledger records minimal local completion and pending reference counts');
 process.env.BLOB_READ_WRITE_TOKEN=fakeBlob.token;fakeBlob.failDeletes.add(f.path);
 const retryFail=await eraseOrderData(f.id,'synthetic','customer_request',await version(f));assert.equal(retryFail.pendingReferences,1);assert.equal((await one('SELECT bytes FROM rivya_storage_budget WHERE id=1')).bytes,'128');pass('Fake SDK: retry failure preserves metadata and quota');
 fakeBlob.failDeletes.delete(f.path);
 const retries=await Promise.all([eraseOrderData(f.id,'synthetic','customer_request',await version(f)),eraseOrderData(f.id,'synthetic','customer_request',await version(f))]);assert.ok(retries.every(r=>r.success));assert.equal((await one('SELECT bytes FROM rivya_storage_budget WHERE id=1')).bytes,'0');assert.equal((await one('SELECT used_slots FROM rivya_inquiry_upload_sessions WHERE request_key=$1',[f.key])).used_slots,0);ledger=await one('SELECT * FROM rivya_erasure_ledger WHERE order_id=$1',[f.id]);assert.equal(ledger.references_deleted,1);assert.equal(fakeBlob.objects.has(f.path),false);pass('Fake SDK: concurrent retries release bytes/slot and count deletion only once');
 await eraseOrderData(f.id,'synthetic','customer_request',await version(f));assert.equal((await one('SELECT count(*)::int AS n FROM rivya_erasure_ledger WHERE order_id=$1',[f.id])).n,1);pass('Completed erasure retry does not duplicate its ledger');
 const due=await fixture();await query("UPDATE rivya_privacy_controls SET last_contact_at=now()-interval '100 days' WHERE order_id=$1",[due.id]);const expiry=await eraseOrderData(due.id,'synthetic','retention_expiry',1);assert.equal(expiry.success,true);await erased(due);pass('Actual retention expiry erases due fictional inquiry without customer-request evidence');
 const fresh=await fixture();const freshBefore=await fingerprints();await assert.rejects(()=>eraseOrderData(fresh.id,'synthetic','retention_expiry',1),ErasureConflict);assert.deepEqual(await fingerprints(),freshBefore);pass('Recent inquiry cannot be erased by premature retention expiry');
 await query("UPDATE rivya_inquiries SET name='SYNTHETIC RESTORED',phone='0000000000',email='restored@example.invalid',notes='SYNTHETIC RESTORED',answers='{\"restored\":true}',guest_hash=$2,payload_hash=$2 WHERE id=$1",[f.id,f.guest]);await query("UPDATE rivya_studio_orders SET client='SYNTHETIC RESTORED',title='SYNTHETIC RESTORED' WHERE id=$1",[f.id]);await query("INSERT INTO rivya_inquiry_notes(inquiry_id,actor,body) VALUES($1,'synthetic','SYNTHETIC RESTORED')",[f.id]);await query("UPDATE rivya_audit SET entity=$2 WHERE action='inquiry:message-recovery' AND entity::jsonb->>'id'=$1",[f.id,JSON.stringify({id:f.id,reason:'SYNTHETIC RESTORED'})]);
 const replay=await replayErasureLedger('synthetic-recovery');assert.equal(replay.complete,true);assert.equal(replay.replayedCount,2);await erased(f);assert.equal((await one('SELECT count(*)::int AS n FROM rivya_erasure_ledger WHERE order_id=$1',[f.id])).n,1);pass('Actual ledger replay re-erases fictional restored personal data without duplicate ledger');
 const again=await replayErasureLedger('synthetic-recovery');assert.equal(again.complete,true);await erased(f);pass('Repeated restoration replay remains complete and leaves no restored private fields');

 const newPage=label=>({id:'custom-page:'+randomUUID(),kind:'page',route:'/p/synthetic-'+label,title:'SYNTHETIC '+label,eyebrow:'Local test only',description:'Wholly fictional lifecycle verification.',sections:[{id:'intro',heading:'Synthetic section',paragraphs:['Wholly fictional text. No customer data.']}]});
 const cms=async(cookie,body)=>handler(content,'POST','/api/studio/content',cookie,body);
 const row=async d=>one('SELECT * FROM rivya_content WHERE content_key=$1',[d.id]);
 const doc=newPage('lifecycle');
 assert.equal((await cms('',{operation:'draft',version:0,document:doc})).status,401);pass('CMS handler denies anonymous mutations');
 const draft1=await cms(editor.cookie,{operation:'draft',version:0,document:doc});assert.equal(draft1.status,200);assert.equal(draft1.value.version,1);assert.deepEqual(draft1.value.issues,[]);assert.equal((await row(doc)).visible,false);assert.equal((await readPublishedSource()).content.some(c=>c.key===doc.id),false);pass('Editor draft creation saves captured snapshot and remains unpublished');
 assert.equal((await cms(editor.cookie,{operation:'publish',version:1,document:draft1.value.document})).status,403);pass('CMS handler refuses editor publication');
 assert.equal((await handler(content,'POST','/api/studio/content',admin.cookie,{operation:'publish',version:1,document:draft1.value.document},'https://example.invalid')).status,403);pass('CMS handler refuses mismatched-origin publication');
 const p1=await cms(admin.cookie,{operation:'publish',version:1,document:draft1.value.document});assert.equal(p1.status,200);assert.equal((await row(doc)).published_version,2);assert.equal((await readPublishedSource()).content.find(c=>c.key===doc.id).document.title,doc.title);pass('Administrator publication reaches the actual public SQL projection');
 const changed={...draft1.value.document,title:'SYNTHETIC revised title'};
 assert.equal((await cms(admin.cookie,{operation:'publish',version:2,document:changed})).status,409);pass('Unsaved CMS change cannot be published');
 const d3=await cms(editor.cookie,{operation:'draft',version:2,document:changed});assert.equal(d3.status,200);assert.equal((await readPublishedSource()).content.find(c=>c.key===doc.id).document.title,doc.title);pass('Editing a published page keeps its previous public revision');
 const cmsStale=await row(doc);assert.equal((await cms(editor.cookie,{operation:'draft',version:2,document:changed})).status,409);assert.deepEqual(await row(doc),cmsStale);pass('Stale CMS save conflicts without modifying the current record');
 const p4=await cms(admin.cookie,{operation:'publish',version:3,document:d3.value.document});assert.equal(p4.status,200);assert.equal((await readPublishedSource()).content.find(c=>c.key===doc.id).document.title,changed.title);pass('Explicit later publication changes public content');
 assert.equal((await cms(admin.cookie,{operation:'draft',version:4,restoredFrom:999,document:draft1.value.document})).status,400);pass('Invalid recovery revision is refused');
 await query('DELETE FROM rivya_revisions WHERE kind=\'content\' AND entity_key=$1 AND version=3',[doc.id]);
 assert.equal((await cms(admin.cookie,{operation:'draft',version:4,restoredFrom:3,document:d3.value.document})).status,400);pass('Missing recovery revision is refused');
 const restore=await cms(admin.cookie,{operation:'draft',version:4,restoredFrom:1,document:draft1.value.document});assert.equal(restore.status,200);assert.equal(restore.value.version,5);assert.equal((await row(doc)).draft.title,doc.title);assert.equal((await row(doc)).published.title,changed.title);assert.equal((await readPublishedSource()).content.find(c=>c.key===doc.id).document.title,changed.title);pass('Revision restore creates a new draft without silently rolling back publication');
 const history=await handler(revisions,'GET','/api/studio/revisions?kind=content&key='+encodeURIComponent(doc.id),admin.cookie);assert.equal(history.status,200);assert.equal(history.value.revisions.find(r=>r.version===5).operation,'draft:restore:1');pass('CMS restored revision history identifies its source');
 const republish=await cms(admin.cookie,{operation:'publish',version:5,document:restore.value.document});assert.equal(republish.status,200);assert.equal((await readPublishedSource()).content.find(c=>c.key===doc.id).document.title,doc.title);pass('Explicit republish makes restored content public');
 const hide=await cms(admin.cookie,{operation:'hide',version:6,document:restore.value.document});assert.equal(hide.status,200);assert.equal((await row(doc)).visible,false);assert.equal((await readPublishedSource()).content.some(c=>c.key===doc.id),false);pass('Hide withdraws the public page while preserving draft and revisions');
 const dep=newPage('dependency');let result=await cms(admin.cookie,{operation:'draft',version:0,document:dep});assert.equal(result.status,200);assert.equal((await cms(admin.cookie,{operation:'publish',version:1,document:result.value.document})).status,200);
 const linked=newPage('linked');linked.sections[0].action={label:'Synthetic dependency',href:dep.route};const linkedDraft=await cms(admin.cookie,{operation:'draft',version:0,document:linked});assert.equal(linkedDraft.status,200);assert.ok(linkedDraft.value.document.pageSnapshot.dependencies.some(d=>d.key===dep.id));
 result=await cms(admin.cookie,{operation:'draft',version:2,document:{...dep,title:'SYNTHETIC changed dependency'}});assert.equal(result.status,200);assert.equal((await cms(admin.cookie,{operation:'publish',version:3,document:result.value.document})).status,200);
 const captured=await row(linked);const dependencyConflict=await cms(admin.cookie,{operation:'publish',version:1,document:linkedDraft.value.document});assert.equal(dependencyConflict.status,409);assert.deepEqual(await row(linked),captured);pass('Changed published dependency prevents stale snapshot publication atomically');
 // Six successful publication/withdrawal operations above: four for the main
 // fictional page, then two for its dependency. Drafts and rejected writes must
 // add no invalidation. Assert the exact paths and order, not mere activity.
 const expectedInvalidations=[...Array(4).fill(doc.route),...Array(2).fill(dep.route)].flatMap(route=>[[route],['/journal'],['/'],['/sitemap.xml']]);
 assert.deepEqual(globalThis.__lifecycleInvalidations,expectedInvalidations);
 report.cacheInvalidations={operations:6,calls:globalThis.__lifecycleInvalidations,frameworkPropagationVerified:false};
 pass('Six successful publications/withdrawals request exact page, Journal, home and sitemap invalidations; drafts and refusals add none',{calls:24});
 report.status='pass';report.syntheticCounts=(await query("SELECT 'orders' AS scope,count(*)::int AS count FROM rivya_studio_orders UNION ALL SELECT 'content',count(*)::int FROM rivya_content UNION ALL SELECT 'staff',count(*)::int FROM rivya_staff UNION ALL SELECT 'ledger',count(*)::int FROM rivya_erasure_ledger")).rows;
}catch(error){report.status='fail';report.error={name:error.name,message:error.message,stack:error.stack};process.exitCode=1;}
finally{delete process.env.BLOB_READ_WRITE_TOKEN;adapters.deregister();report.completedAt=new Date().toISOString();report.fakeProvider={label:'test SDK only; no remote provider requests',remainingObjects:fakeBlob.objects.size,operations:fakeBlob.calls.map(c=>c.operation)};const output=resolve(process.env.RIVYA_LIFECYCLE_OUTPUT,'results.json');writeFileSync(output,JSON.stringify(report,null,2));await pool.end();console.log(JSON.stringify({status:report.status,checks:report.checks.length,error:report.error?.message,output}));}
