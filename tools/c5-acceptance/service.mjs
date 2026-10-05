import {login,request,sql,origin,record,existingRows,fingerprint,preserve} from './common.mjs';
import {randomUUID,randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';

const checks=[],ids=[],prefix='C5QA-'+Date.now(),before=await existingRows(),protectedBefore=await fingerprint();
const admin=await login();let staff,custom;
const fixture={login:'qa-c5-'+Date.now(),password:randomBytes(32).toString('base64url'),name:prefix+' synthetic editor',role:'editor',active:true};
const pass=(name,condition=true)=>{assert.ok(condition,name);checks.push(name);record('service',{checkedAt:new Date().toISOString(),checks,complete:false});console.log('PASS '+name);};
const currentStaff=async()=>(await request(admin,'/api/studio/workspace')).data.staff.find(s=>s.login===fixture.login);
const details=async(id,cookie=admin)=>(await request(cookie,'/api/studio/workspace?view=inquiry&id='+id)).data;
const clean=d=>{d=structuredClone(d);delete d.pageSnapshot;delete d.homeSnapshot;return d;};
const save=async(document,operation='draft',extra={})=>{const r=await request(admin,'/api/studio/content',{document:clean(document),version:custom.version,operation,...extra});assert.equal(r.status,200,r.data?.error);custom={...custom,...r.data};return custom;};
try{
 const readPaths=['/api/studio/workspace','/api/studio/orders','/api/studio/work-queue','/api/studio/content','/api/studio/media','/api/studio/editorial-assets','/api/studio/health-context','/api/studio/revisions?kind=content&key=page:home','/api/studio/operations?view=activity','/api/studio/site-settings','/api/studio/settings','/api/studio/operations?view=settings','/api/studio/operations?view=exports','/api/studio/route-review'];
 for(const path of readPaths){pass('Anonymous denied '+path,(await request('',path)).status===401);pass('Administrator reads '+path,(await request(admin,path)).status===200);}
 pass('Synthetic editor created',(await request(admin,'/api/studio/workspace',{action:'staff',...fixture})).status===200);staff=await currentStaff();assert.ok(staff);const editor=await login(fixture.login,fixture.password);
 for(const path of readPaths){const restricted=/site-settings|\/settings|view=settings|view=exports|route-review/.test(path);pass('Editor '+(restricted?'denied ':'reads ')+path,(await request(editor,path)).status===(restricted?403:200));}
 const identity=(await request(editor,'/api/studio/workspace')).data;
 pass('Editor staff directory excludes logins, hashes and credential versions',identity.staff.every(s=>!('login'in s)&&!('version'in s)&&!('password_hash'in s)));
 for(const [path,body] of [
  ['/api/studio/workspace',{action:'staff',...staff,password:'',role:'admin'}],['/api/studio/workspace',{action:'revoke-staff',id:staff.id,version:staff.version}],
  ['/api/studio/orders',{action:'create',client:prefix,title:prefix}],['/api/studio/settings',{}],['/api/studio/site-settings',{}],['/api/studio/operations',{action:'export',confirm:'private-export'}],['/api/studio/cleanup',{}]
 ])pass('Editor mutation denied '+path+' '+(body.action||'settings'),(await request(editor,path,body)).status===403);
 pass('Foreign-origin write denied',(await request(admin,'/api/studio/orders',{action:'create',client:prefix,title:prefix},{Origin:'https://untrusted.example'})).status===403);
 for(let i=0;i<3;i++){
  const id=randomUUID();ids.push(id);const body={action:'create',requestId:id,client:prefix+' person '+i,title:prefix+' request '+i};
  pass('Synthetic manual entry '+i+' created',(await request(admin,'/api/studio/orders',body)).status===201);
  if(!i)pass('Lost-response retry reuses the same manual entry',(await request(admin,'/api/studio/orders',body)).data.recovered===true);
  if(i<2){const reference='RLA-'+id.replaceAll('-','').slice(0,12).toUpperCase();await sql`INSERT INTO rivya_inquiries(id,reference,guest_hash,request_key,payload_hash,product_id,product_snapshot,name,phone,email,answers,notes,summary,assignee,follow_up) VALUES(${id}::uuid,${reference},'c5-isolated-fixture',${randomUUID()}::uuid,'c5-synthetic','C5-NOT-A-PRODUCT',${JSON.stringify({id:'C5-NOT-A-PRODUCT',name:prefix+' synthetic request',category:'QA only'})}::jsonb,${prefix+' person '+i},'0000000000','',${JSON.stringify({'Synthetic preference':'Immutable original answer'})}::jsonb,'Original synthetic notes','Synthetic acceptance request',${i===0?staff.id:null}::uuid,CURRENT_DATE)`;}
 }
 pass('Editor list contains only assigned synthetic inquiry',JSON.stringify((await request(editor,'/api/studio/orders?q='+prefix)).data.orders.map(o=>o.id))===JSON.stringify([ids[0]]));
 for(const id of ids.slice(1))pass('Editor exact unassigned/manual record denied '+id,(await request(editor,'/api/studio/workspace?view=inquiry&id='+id)).status===404);
 let detail=await details(ids[0],editor);const original=structuredClone(detail.inquiry);
 pass('Assigned editor reads original inquiry',detail.inquiry.answers['Synthetic preference']==='Immutable original answer');
 pass('Unassigned internal note denied',(await request(editor,'/api/studio/workspace',{action:'note',id:ids[1],note:'Must not be written'})).status===404);
 pass('Assigned internal note saved',(await request(editor,'/api/studio/workspace',{action:'note',id:ids[0],note:'Synthetic C5 internal note'})).status===200);
 const move=await request(editor,'/api/studio/orders',{action:'move',id:ids[0],version:detail.inquiry.version,status:'CONTACTED'});
 pass('Assigned stage transition saved',move.status===200);
 pass('Stale stage rejected',(await request(editor,'/api/studio/orders',{action:'move',id:ids[0],version:detail.inquiry.version,status:'QUOTED'})).status===409);
 detail=await details(ids[0],editor);
 const amendment={action:'amendment',id:ids[0],version:detail.inquiry.version,requestId:randomUUID(),reason:'C5 synthetic correction',instructions:'C5 synthetic additional instructions'};
 pass('Amendment saves',(await request(editor,'/api/studio/workspace',amendment)).status===200);
 pass('Amendment retry is idempotent',(await request(editor,'/api/studio/workspace',amendment)).data.recovered===true);
 detail=await details(ids[0],editor);
 pass('Amendment preserves original customer answers and notes',JSON.stringify(detail.inquiry.answers)===JSON.stringify(original.answers)&&detail.inquiry.notes===original.notes&&detail.amendments.length===1);
 pass('Assigned follow-up saves',(await request(editor,'/api/studio/workspace',{action:'follow-up',id:ids[0],version:detail.inquiry.version,followUp:'2026-12-01'})).status===200);
 pass('Stale follow-up rejected',(await request(editor,'/api/studio/workspace',{action:'follow-up',id:ids[0],version:detail.inquiry.version,followUp:'2026-12-02'})).status===409);
 pass('Editor cannot reassign',(await request(editor,'/api/studio/workspace',{action:'assign',id:ids[0],version:detail.inquiry.version,assignee:null,followUp:null})).status===403);
 custom={version:0,document:{id:'custom-page:'+randomUUID(),kind:'page',route:'/p/'+prefix.toLowerCase(),title:prefix+' acceptance page',eyebrow:'Isolated QA',description:'Synthetic publishing and recovery acceptance.',sections:[{id:'brief',heading:'Synthetic saved chapter',paragraphs:['This is a synthetic QA fixture, not business content.'],layout:'statement'}]}};
 await save(custom.document);pass('Synthetic draft captures real preview snapshot',!!custom.document.pageSnapshot);
 pass('Draft is not publicly visible',(await fetch(origin+custom.document.route)).status===404);
 const preview='/studio/preview/frame?record='+encodeURIComponent(custom.document.id)+'&version='+custom.version;
 const previewResponse=await fetch(origin+preview,{headers:{Cookie:admin}});
 pass('Authenticated exact saved preview renders revision',previewResponse.status===200&&(await previewResponse.text()).includes('data-content-revision="'+custom.version+'"'));
 pass('Anonymous saved preview blocked',(await fetch(origin+preview,{redirect:'manual'})).status!==200);
 pass('Editor cannot publish content',(await request(editor,'/api/studio/content',{document:clean(custom.document),version:custom.version,operation:'publish'})).status===403);
 await save(custom.document,'publish');const published=structuredClone(custom);
 pass('Anonymous public page matches published revision',(await(await fetch(origin+custom.document.route)).text()).includes('data-content-revision="'+custom.version+'"'));
 await save({...clean(custom.document),title:prefix+' newer draft'});
 const unchanged=await(await fetch(origin+custom.document.route)).text();pass('Saving a changed draft keeps public version intact',unchanged.includes('data-content-revision="'+published.version+'"')&&!unchanged.includes(prefix+' newer draft'));
 pass('Concurrent stale save rejected',(await request(admin,'/api/studio/content',{document:clean(custom.document),version:custom.version-1,operation:'draft'})).status===409);
 await save(published.document,'draft',{restoredFrom:published.version});await save(custom.document,'publish');
 pass('Restored version publishes as a new revision',custom.version>published.version&&custom.document.title===published.document.title);
 const history=(await request(admin,'/api/studio/revisions?kind=content&key='+encodeURIComponent(custom.document.id))).data.revisions;
 pass('Original, edited and recovered revisions retained',history.length>=5&&history.some(r=>r.operation==='draft:restore:'+published.version));
 if(process.argv.includes('--browser')){const {browserAcceptance}=await import('./mutation-browser.mjs');await browserAcceptance({admin,editor,staff,inquiryId:ids[0],pageId:custom.document.id,pageRoute:custom.document.route,prefix,pass});custom=(await request(admin,'/api/studio/content?record='+encodeURIComponent(custom.document.id))).data.entries.find(e=>e.document.id===custom.document.id);}
 detail=await details(ids[0]);pass('Administrator unassigns synthetic inquiry',(await request(admin,'/api/studio/workspace',{action:'assign',id:ids[0],version:detail.inquiry.version,assignee:null,followUp:null})).status===200);
 pass('Assignment removal immediately revokes inquiry access',(await request(editor,'/api/studio/workspace?view=inquiry&id='+ids[0])).status===404);
 pass('Editor session revoked',(await request(admin,'/api/studio/workspace',{action:'revoke-staff',id:staff.id,version:staff.version})).status===200);
 pass('Revoked session denied',(await request(editor,'/api/studio/workspace')).status===401);
 staff=await currentStaff();const renewed=await login(fixture.login,fixture.password);
 pass('Editor role change succeeds',(await request(admin,'/api/studio/workspace',{action:'staff',...staff,password:'',role:'admin'})).status===200);
 pass('Role change invalidates old session',(await request(renewed,'/api/studio/workspace')).status===401);
 pass('Stale staff update denied',(await request(admin,'/api/studio/workspace',{action:'staff',...staff,password:'',active:false})).status===409);
}finally{
 if(custom?.version){const latest=(await request(admin,'/api/studio/content?record='+encodeURIComponent(custom.document.id))).data?.entries?.find(e=>e.document.id===custom.document.id);if(latest)custom=latest;await save(custom.document,'hide');pass('Synthetic page hidden, history retained',(await fetch(origin+custom.document.route)).status===404);}
 staff=await currentStaff();if(staff)pass('Synthetic staff disabled',(await request(admin,'/api/studio/workspace',{action:'staff',...staff,password:'',active:false})).status===200);fixture.password='';
 for(const id of ids){const d=await details(id);const row=d.inquiry||d.manual;assert.ok(row,'Synthetic fixture available for closure');if(row.status!=='CLOSED')assert.equal((await request(admin,'/api/studio/orders',{action:'move',id,version:row.version,status:'CLOSED',reason:'Synthetic C5 acceptance completed; fixture and history retained.'})).status,200);}
 await preserve(before,protectedBefore);pass('Every pre-existing content, inquiry, order, staff, product, media and business record unchanged');
}
record('service',{checkedAt:new Date().toISOString(),checks,assertions:checks.length,fixturePrefix:prefix,fixtureIds:ids,staffId:staff.id,pageId:custom.document.id,fixturesClosed:true,pageHidden:true,staffInactive:true,existingRecordsUnchanged:true,productionWrites:false,complete:true});
