/**
 * Run ONLY through tools/old-design-migration/run-local.mjs after reviewing this file.
 * Exercises current services and the actual loopback application with new fictional
 * records. Never uses a hosted DB, Blob credentials, a real account or WhatsApp.
 * Cleanup is restricted to generated request keys, exact logins and their child IDs.
 * Identity sequences may advance; existing record bytes must remain unchanged.
 */
import assert from 'node:assert/strict';
import {createHash, randomBytes, randomUUID} from 'node:crypto';
import {mkdir, writeFile} from 'node:fs/promises';
import {registerHooks} from 'node:module';
import {pathToFileURL} from 'node:url';
import {assertLocalConfig, localTarget} from '../old-design-migration/guard.mjs';

assert.equal(globalThis.__rivyaMigrationLocalSql, true);
assertLocalConfig(process.env);
assert.equal(process.env.RIVYA_ORDER_INTAKE_ENABLED, 'true');
assert.equal(process.env.RIVYA_ORDER_MESSAGE_RETRY_ENABLED, 'true');
assert.ok(!process.env.BLOB_READ_WRITE_TOKEN);
const origin = 'http://127.0.0.1:4199';
const output = 'test-results/rivya-master-audit/workflow.json';
const marker = registerHooks({resolve(specifier, context, next) {
  return specifier === 'server-only'
    ? {url:'data:text/javascript,export%20{}', shortCircuit:true}
    : next(specifier, context);
}});
const {commitOrder} = await import('../../src/lib/order-persistence.ts');
const {acceptedOrderInput} = await import('../../src/lib/order-input.ts');
const {bespokeDefinition, productDefinition} = await import('../../src/lib/inquiry-definition.ts');
const {fieldVisible} = await import('../../src/lib/product-form.ts');
const {orderConsentVersion} = await import('../../src/lib/order-consent.ts');
const {readOrder, finalizeOrderMessage, authorizedHandoff} = await import('../../src/lib/order-handoff.ts');
const {requestStudioAccess, decideAccessRequest, redeemAccessLink} = await import('../../src/lib/studio-access.ts');
const {hashStaffPassword, authenticateStaff, studioSessionFromToken} = await import('../../src/lib/studio-auth.ts');
const {privateHash} = await import('../../src/lib/request-security.ts');
const {canErasePersonalData} = await import('../../src/lib/erasure-policy.ts');
marker.deregister();
const {default:pg} = await import(pathToFileURL(process.env.RIVYA_MIGRATION_PG_MODULE).href);
const db = new pg.Client(localTarget);
await db.connect();
const identity = (await db.query('SELECT current_database() AS database,current_user AS role,host(inet_server_addr()) AS host,inet_server_port() AS port')).rows[0];
assert.deepEqual(identity, {database:localTarget.database, role:localTarget.user, host:localTarget.host, port:localTarget.port});

const run = 'master-audit-' + randomUUID();
const logins = [run+'-admin', run+'-editor', run+'-other'];
const keys = [randomUUID(), randomUUID(), randomUUID()];
const referenceId = randomUUID();
const guestToken = randomBytes(32).toString('base64url');
const guest = privateHash(guestToken);
const checks = [], observations = [];
const report = {
  at:new Date().toISOString(), scope:'Guarded loopback PostgreSQL and HTTP only; new fictional records',
  baseline:identity, checks, observations, messagesSent:0,
  privateStorage:'No remote Blob credential. A labelled metadata-only fixture verifies access decisions; uploaded bytes and provider deletion are not certified.',
  erasure:'Only pure policy checks. Real erasure is excluded from this reused QA database because it invalidates existing managed-export metadata.',
};
const pass = (name, condition=true) => {assert.ok(condition, name); checks.push({name,status:'pass'});};
const digest = value => createHash('sha256').update(value).digest('hex');
const staffIds = new Set(), orderIds = new Set(), requestIds = new Set();
const actors = new Set(logins);
let before;
async function fingerprints() {
  // Authentication metadata is expected to change during concurrent read-only UI checks.
  const names = (await db.query("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'rivya_%' AND tablename NOT IN ('rivya_studio_sessions','rivya_studio_login_limits') ORDER BY tablename")).rows.map(r=>r.tablename);
  const result = {};
  for (const name of names) {
    assert.match(name,/^rivya_[a-z0-9_]+$/);
    const rows = (await db.query(`SELECT md5(row_to_json(t)::text) AS fingerprint FROM public.${name} t ORDER BY 1`)).rows;
    result[name] = {count:rows.length,sha256:digest(rows.map(r=>r.fingerprint).join('\n'))};
  }
  return result;
}
async function sessionCookieFor(id, login, password, role) {
  const hash = await hashStaffPassword(password);
  await db.query('INSERT INTO rivya_staff(id,login,name,password_hash,role,active) VALUES($1,$2,$3,$4,$5,true)',[id,login,'LOCAL MASTER AUDIT — fictional '+role,hash,role]);
  staffIds.add(id);
  const identity = await authenticateStaff(login,password);
  assert.equal(identity?.staffId,id);
  assert.equal(identity?.role,role);
  return sessionFor(identity);
}
async function sessionFor(identity) {
  const token=randomBytes(32).toString('base64url');
  // Only this new account's session; avoid global expired-session cleanup.
  await db.query("INSERT INTO rivya_studio_sessions(token_hash,credential_version,expires_at,idle_expires_at,staff_id) VALUES($1,$2,now()+interval '8 hours',now()+interval '30 minutes',$3)",[digest(token),String(identity.credentialVersion),identity.staffId]);
  assert.equal((await studioSessionFromToken(token))?.staffId,identity.staffId);
  return {token,cookie:'__Host-rivya-studio='+token};
}
async function http(path, {cookie='',body,requestOrigin=origin}={}) {
  assert.ok(path.startsWith('/')&&!path.startsWith('//'));
  const response=await fetch(origin+path,{redirect:'manual',signal:AbortSignal.timeout(20000),headers:{Origin:requestOrigin,...(cookie?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{method:'POST',body:JSON.stringify(body)}:{})});
  const type=response.headers.get('content-type')||'';
  const value=type.includes('json')?await response.json():await response.text();
  return {status:response.status,value,headers:response.headers};
}
function formInput(definition,key,refs=[]) {
  const form=new FormData();
  for (const [fieldKey,value] of Object.entries({kind:definition.kind,schemaId:definition.schemaId,schemaVersion:String(definition.schemaVersion),requestKey:key,name:'LOCAL MASTER AUDIT — fictional brief',phone:'+919000000000',email:'fictional-audit@example.invalid',notes:'Synthetic local verification. Do not contact anyone or send a message.',consent:'on',consentVersion:orderConsentVersion,website:''})) form.set(fieldKey,value);
  if(definition.product){form.set('productId',definition.product.id);form.set('revision',String(definition.schemaVersion));}
  const values={};
  for(const field of definition.fields){
    if(!fieldVisible(field,values))continue;
    const value=field.type==='select'?field.options[0]:field.type==='number'?String(field.min??1):'Fictional local audit';
    values[field.id]=value;form.set('answer_'+field.id,value);
  }
  refs.forEach(id=>form.append('reference',id));
  const input=acceptedOrderInput(form,definition);
  assert.deepEqual(input.errors,{});
  return {form,input};
}
async function currentRequest(kind) {return (await db.query('SELECT id,version,status,staff_id,name FROM rivya_access_requests WHERE login=$1 AND kind=$2 ORDER BY created_at DESC LIMIT 1',[logins[1],kind])).rows[0];}

try {
  before=await fingerprints();
  pass('Protected record fingerprint baseline captured',Object.keys(before).length>10);
  const availability=await fetch(origin+'/robots.txt',{signal:AbortSignal.timeout(10000)});pass('Local application is available',availability.status===200);
  const adminId=randomUUID(),otherId=randomUUID(),password=randomBytes(24).toString('base64url');
  const admin=await sessionCookieFor(adminId,logins[0],password,'admin');
  const other=await sessionCookieFor(otherId,logins[2],password,'editor');
  const adminSession={adminId:logins[0],staffId:adminId,role:'admin'};
  pass('Two new fictional staff fixture passwords authenticate with actual service');

  const accessInput={kind:'access',login:logins[1],name:'LOCAL MASTER AUDIT — fictional access request',contact:'fictional-audit@example.invalid'};
  await requestStudioAccess(accessInput);await requestStudioAccess({...accessInput,name:'Duplicate must not overwrite'});
  let request=await currentRequest('access');requestIds.add(request.id);
  pass('Duplicate public request preserves the original request',request.name===accessInput.name);
  pass('Public request alone creates no staff account',(await db.query('SELECT id FROM rivya_staff WHERE login=$1',[logins[1]])).rowCount===0);
  await assert.rejects(()=>decideAccessRequest({...adminSession,role:'editor'},request.id,request.version,'approve'));
  pass('Editor cannot approve an access request');
  pass('Stale access decision is refused',await decideAccessRequest(adminSession,request.id,request.version+1,'approve')===null);
  const issued=await decideAccessRequest(adminSession,request.id,request.version,'approve');assert.ok(issued?.token);
  let member=(await db.query('SELECT id,role,active,version FROM rivya_staff WHERE login=$1',[logins[1]])).rows[0];staffIds.add(member.id);
  pass('Approval starts a disabled editor, without self-selected privileges',member.role==='editor'&&!member.active);
  pass('Unredeemed account cannot sign in',await authenticateStaff(logins[1],password)===null);
  const stored=(await db.query('SELECT token_hash,expires_at FROM rivya_access_requests WHERE id=$1',[request.id])).rows[0];
  pass('Access link is stored as a hash with a bounded expiry',stored.token_hash===digest(issued.token)&&new Date(stored.expires_at)-Date.now()<=30*60000);
  const redemption=await Promise.all([redeemAccessLink(issued.token,password),redeemAccessLink(issued.token,password)]);
  pass('Concurrent access-link redemption succeeds exactly once',redemption.filter(Boolean).length===1);
  pass('Consumed link is refused',!await redeemAccessLink(issued.token,password));
  const editorIdentity=await authenticateStaff(logins[1],password);assert.ok(editorIdentity);
  const editor=await sessionFor(editorIdentity);
  pass('Approved editor can authenticate and hold a valid versioned session');

  const business=(await db.query('SELECT details,version FROM rivya_business_settings WHERE id=1')).rows[0];
  assert.ok(business?.details?.whatsapp);
  const destination={number:business.details.whatsapp,version:Number(business.version)};
  await db.query('INSERT INTO rivya_inquiry_upload_sessions(request_key,guest_hash,used_slots) VALUES($1,$2,1),($3,$2,0),($4,$2,0)',[keys[0],guest,keys[1],keys[2]]);
  // Metadata-only stand-in for a previously normalized upload. No fake provider
  // success is asserted, no blob exists, and the global byte budget is untouched.
  await db.query("INSERT INTO rivya_references(id,guest_hash,request_key,upload_key,pathname,bytes,state,storage_provider,normalized_mime,upload_sha256) VALUES($1,$2,$3,$4,$5,1,'ready','vercel','image/jpeg',$6)",[referenceId,guest,keys[0],randomUUID(),'references/'+referenceId+'.jpg',digest('explicit metadata-only fixture')]);
  const {input}=formInput(bespokeDefinition(),keys[0],[referenceId]);
  const saved=await Promise.all([commitOrder(input,guest,keys[0],destination),commitOrder(input,guest,keys[0],destination)]);
  pass('Concurrent commits create exactly one saved custom inquiry',saved.filter(Boolean).length===1);
  const inquiryId=saved.find(Boolean);orderIds.add(inquiryId);
  const counts=(await db.query('SELECT (SELECT count(*) FROM rivya_inquiries WHERE request_key=$1) AS inquiries,(SELECT count(*) FROM rivya_studio_order_events WHERE order_id=$2) AS events',[keys[0],inquiryId])).rows[0];
  pass('One inquiry and one initial event persisted',Number(counts.inquiries)===1&&Number(counts.events)===1);
  const reference=(await db.query('SELECT inquiry_id,linked_at FROM rivya_references WHERE id=$1',[referenceId])).rows[0];
  pass('Reference metadata links atomically to the saved inquiry',reference.inquiry_id===inquiryId&&!!reference.linked_at);
  const access={kind:'guest',guest,key:keys[0]};
  let row=await readOrder(inquiryId,access);
  pass('Stage A saves before message preparation',row.message_state==='handoff_pending'&&row.summary==='');
  pass('Guest ownership rejects a different browser identity',await readOrder(inquiryId,{...access,guest:privateHash(randomBytes(32).toString('base64url'))})===undefined);
  await finalizeOrderMessage(inquiryId,access);
  row=await readOrder(inquiryId,access);
  pass('Saved message is generated from the persisted brief',row.message_state==='handoff_ready'&&row.summary.includes('fictional-audit@example.invalid'));
  pass('Private reference URLs and storage paths are excluded from message',!row.summary.includes('references/')&&!row.summary.includes('/api/studio/')&&!row.summary.includes(referenceId));
  const handoff=await authorizedHandoff(inquiryId,access);
  pass('Explicit handoff resolves the saved destination',handoff.receipt.handoffAllowed&&handoff.whatsappUrl.startsWith('https://wa.me/'+destination.number+'?text='));
  const frozenSummary=row.summary;await finalizeOrderMessage(inquiryId,access);
  pass('Ready message remains immutable on repeated preparation',(await readOrder(inquiryId,access)).summary===frozenSummary);
  const receipt=await http('/api/inquiry/receipt?key='+keys[0],{cookie:'__Host-rivya-inquiry='+guestToken});
  pass('Actual HTTP receipt is private and available to its guest',receipt.status===200&&receipt.value.receipt.handoffAllowed&&receipt.headers.get('cache-control').includes('no-store'));
  pass('Receipt GET does not return an automatic open link',!Object.hasOwn(receipt.value,'whatsappUrl'));
  pass('Anonymous browser cannot read the receipt',(await http('/api/inquiry/receipt?key='+keys[0])).status===404);

  const product=(await db.query('SELECT published,published_version FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL ORDER BY product_id LIMIT 1')).rows[0];
  assert.ok(product);const definition=productDefinition({...product.published,revision:Number(product.published_version)});
  const productInput=formInput(definition,keys[1]).input;
  const productId=await commitOrder(productInput,guest,keys[1],destination);assert.ok(productId);orderIds.add(productId);
  pass('Published product inquiry uses its current saved schema');
  const invalidInput=structuredClone(productInput);invalidInput.snapshot.schemaVersion=Number(product.published_version)+1000;
  pass('Stale product publication cannot commit',await commitOrder(invalidInput,guest,keys[2],destination)===undefined);

  const assignment=await http('/api/studio/workspace',{cookie:admin.cookie,body:{action:'assign',id:inquiryId,version:1,assignee:member.id,followUp:null}});
  pass('Admin assignment succeeds for the new inquiry',assignment.status===200);
  const detail=await http('/api/studio/workspace?view=inquiry&id='+inquiryId,{cookie:editor.cookie});
  pass('Assigned editor can read the saved inquiry and reference metadata',detail.status===200&&detail.value.refs.some(r=>r.id===referenceId));
  pass('Unassigned editor cannot read another inquiry',(await http('/api/studio/workspace?view=inquiry&id='+inquiryId,{cookie:other.cookie})).status===404);
  pass('Guest cannot stream a private reference',(await http('/api/studio/references/'+referenceId)).status===401);
  pass('Unassigned editor cannot stream a private reference',(await http('/api/studio/references/'+referenceId,{cookie:other.cookie})).status===404);
  pass('Editor cannot publish content',(await http('/api/studio/content',{cookie:editor.cookie,body:{operation:'publish',version:1,document:{id:'fictional-audit'}}})).status===403);
  pass('Editor cannot administer staff',(await http('/api/studio/workspace',{cookie:editor.cookie,body:{action:'staff'}})).status===403);
  pass('Cross-origin operation is refused before mutation',(await http('/api/studio/orders',{cookie:admin.cookie,requestOrigin:'https://example.invalid',body:{action:'move',id:inquiryId,version:detail.value.inquiry.version,status:'CONTACTED'}})).status===403);
  const orderVersion=detail.value.inquiry.version;
  pass('Assigned editor can move its inquiry stage',(await http('/api/studio/orders',{cookie:editor.cookie,body:{action:'move',id:inquiryId,version:orderVersion,status:'CONTACTED'}})).status===200);
  pass('Stale stage update conflicts instead of overwriting',(await http('/api/studio/orders',{cookie:editor.cookie,body:{action:'move',id:inquiryId,version:orderVersion,status:'QUALIFIED'}})).status===409);
  pass('Original saved message survives operational updates',(await readOrder(inquiryId,access)).summary===frozenSummary);
  const version=(await db.query('SELECT version FROM rivya_studio_orders WHERE id=$1',[inquiryId])).rows[0].version;
  const follow=await http('/api/studio/workspace',{cookie:admin.cookie,body:{action:'follow-up',id:inquiryId,version,followUp:'2026-12-01'}});
  assert.equal(follow.status,200);
  const afterFollow=(await db.query('SELECT assignee FROM rivya_inquiries WHERE id=$1',[inquiryId])).rows[0];
  const note=(await db.query('SELECT body FROM rivya_inquiry_notes WHERE inquiry_id=$1 ORDER BY id DESC LIMIT 1',[inquiryId])).rows[0];
  pass('Follow-up-only update preserves actual assignment',afterFollow.assignee===member.id);
  pass('Follow-up note describes the date without claiming reassignment',note.body==='Follow-up updated: 2026-12-01.');
  observations.push({id:'SEC-OBS-01',name:'Follow-up-only note accuracy',reproduced:note.body.includes('Staff: '+adminId),expected:'A follow-up change describes the date change without implying reassignment.',source:'src/app/api/studio/workspace/route.ts'});
  const currentVersion=(await db.query('SELECT version FROM rivya_studio_orders WHERE id=$1',[inquiryId])).rows[0].version;
  const invalidDate=await http('/api/studio/workspace',{cookie:admin.cookie,body:{action:'follow-up',id:inquiryId,version:currentVersion,followUp:'2026-02-30'}});
  observations.push({id:'SEC-OBS-02',name:'Invalid follow-up calendar date',reproduced:invalidDate.status===503,actualStatus:invalidDate.status,expectedStatus:400,source:'src/app/api/studio/workspace/route.ts:128-134'});
  pass('Impossible calendar date returns actionable validation',invalidDate.status===400&&invalidDate.value.error==='Choose a valid follow-up date.');
  pass('Invalid date does not change the saved inquiry',(await db.query('SELECT version FROM rivya_studio_orders WHERE id=$1',[inquiryId])).rows[0].version===currentVersion);
  pass('Non-leap February 29 is refused',(await http('/api/studio/workspace',{cookie:admin.cookie,body:{action:'follow-up',id:inquiryId,version:currentVersion,followUp:'2025-02-29'}})).status===400);
  pass('Year zero is refused before the PostgreSQL date cast',(await http('/api/studio/workspace',{cookie:admin.cookie,body:{action:'follow-up',id:inquiryId,version:currentVersion,followUp:'0000-01-01'}})).status===400);
  pass('Rejected calendar dates preserve the saved version',(await db.query('SELECT version FROM rivya_studio_orders WHERE id=$1',[inquiryId])).rows[0].version===currentVersion);
  pass('Valid leap-day follow-up is accepted',(await http('/api/studio/workspace',{cookie:admin.cookie,body:{action:'follow-up',id:inquiryId,version:currentVersion,followUp:'2028-02-29'}})).status===200);
  pass('Follow-up can still be cleared',(await http('/api/studio/workspace',{cookie:admin.cookie,body:{action:'follow-up',id:inquiryId,version:currentVersion+1,followUp:null}})).status===200);

  await requestStudioAccess({...accessInput,kind:'recovery'});request=await currentRequest('recovery');requestIds.add(request.id);
  const recovery=await decideAccessRequest(adminSession,request.id,request.version,'approve');assert.ok(recovery?.token);
  const newPassword=randomBytes(24).toString('base64url');
  pass('Recovery link changes only the approved fictional account',await redeemAccessLink(recovery.token,newPassword));
  pass('Recovery revokes the prior session',await studioSessionFromToken(editor.token)===null);
  pass('Old password fails and new password preserves editor role',await authenticateStaff(logins[1],password)===null&&(await authenticateStaff(logins[1],newPassword))?.role==='editor');
  const renewed=await sessionFor(await authenticateStaff(logins[1],newPassword));
  await db.query('UPDATE rivya_staff SET version=version+1 WHERE id=$1',[member.id]);
  pass('Credential-version change revokes an otherwise unexpired session',await studioSessionFromToken(renewed.token)===null);
  const currentIdentity=await authenticateStaff(logins[1],newPassword);const expiring=await sessionFor(currentIdentity);
  await db.query("UPDATE rivya_studio_sessions SET idle_expires_at=now()-interval '1 second' WHERE token_hash=$1",[digest(expiring.token)]);
  pass('Idle-expired session is refused',await studioSessionFromToken(expiring.token)===null);
  const policy={lastContactAt:'2026-01-01T00:00:00Z',closedAt:null,becameOrder:false,ongoingFollowUp:false,holdReason:'',deletionRequestedAt:'2026-01-02T00:00:00Z',identityVerifiedAt:'2026-01-02T01:00:00Z'};
  pass('Verified request permits policy erasure without a hold',canErasePersonalData(policy,'customer_request'));
  pass('Hold prevents policy erasure despite verified request',!canErasePersonalData({...policy,holdReason:'Fictional test hold'},'customer_request'));
  pass('Open accepted order prevents policy erasure',!canErasePersonalData({...policy,becameOrder:true},'customer_request'));
  report.status='pass';
} catch(error) {
  report.status='failed';report.failure=error instanceof Error?error.message:'Unknown test failure';
} finally {
  try {
    // Recover only IDs associated with this run's exact keys and exact logins,
    // including a committed row whose network/service response was lost.
    for(const row of (await db.query('SELECT id FROM rivya_inquiries WHERE request_key=ANY($1::uuid[]) AND guest_hash=$2',[keys,guest])).rows)orderIds.add(row.id);
    for(const row of (await db.query('SELECT id FROM rivya_staff WHERE login=ANY($1::text[])',[logins])).rows)staffIds.add(row.id);
    for(const row of (await db.query('SELECT id FROM rivya_access_requests WHERE login=ANY($1::text[])',[logins])).rows)requestIds.add(row.id);
    const orders=[...orderIds],staff=[...staffIds],requests=[...requestIds],entities=[...orders,...staff,...requests];
    await db.query('BEGIN');
    try {
      await db.query('DELETE FROM rivya_studio_sessions WHERE staff_id=ANY($1::uuid[])',[staff]);
      await db.query('DELETE FROM rivya_references WHERE id=$1 AND request_key=ANY($2::uuid[]) AND guest_hash=$3',[referenceId,keys,guest]);
      await db.query('DELETE FROM rivya_inquiry_notes WHERE inquiry_id=ANY($1::uuid[])',[orders]);
      await db.query('DELETE FROM rivya_studio_order_events WHERE order_id=ANY($1::uuid[])',[orders]);
      await db.query('DELETE FROM rivya_privacy_controls WHERE order_id=ANY($1::uuid[])',[orders]);
      await db.query('DELETE FROM rivya_inquiries WHERE id=ANY($1::uuid[]) AND request_key=ANY($2::uuid[])',[orders,keys]);
      await db.query('DELETE FROM rivya_studio_orders WHERE id=ANY($1::uuid[])',[orders]);
      await db.query('DELETE FROM rivya_inquiry_upload_sessions WHERE request_key=ANY($1::uuid[]) AND guest_hash=$2',[keys,guest]);
      await db.query('DELETE FROM rivya_access_requests WHERE id=ANY($1::uuid[]) AND login=ANY($2::text[])',[requests,logins]);
      await db.query('DELETE FROM rivya_audit WHERE entity=ANY($1::text[]) OR actor=ANY($2::text[])',[entities,[...actors]]);
      await db.query('DELETE FROM rivya_staff WHERE id=ANY($1::uuid[]) AND login=ANY($2::text[])',[staff,logins]);
      await db.query('COMMIT');
    } catch(error) {await db.query('ROLLBACK');throw error;}
    const after=await fingerprints();
    assert.deepEqual(after,before,'Existing protected records changed during workflow audit');
    report.preservation={status:'pass',tables:Object.keys(after).length,rows:Object.values(after).reduce((sum,row)=>sum+row.count,0),sha256:digest(JSON.stringify(after)),exclusions:['Session idle timestamps and rate-limit metadata','Identity sequences naturally advance and are not reset']};
    report.cleanup={status:'pass',syntheticOrders:orders.length,syntheticStaff:staff.length,syntheticAccessRequests:requests.length,syntheticReferenceMetadata:1};
  } catch(error) {
    report.status='failed';report.cleanup={status:'failed',reason:error instanceof Error?error.message:'Unknown cleanup failure'};
  }
  await db.end();
  await mkdir('test-results/rivya-master-audit',{recursive:true});
  await writeFile(output,JSON.stringify(report,null,2)+'\n');
}
console.log(JSON.stringify({status:report.status,checks:checks.length,observations,cleanup:report.cleanup,preservation:report.preservation,output},null,2));
if(report.status!=='pass')process.exitCode=1;
