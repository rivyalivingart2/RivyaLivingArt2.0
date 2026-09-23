import {orderReceipt} from '@/lib/order-handoff';
import {decodeSavedBrief} from '@/lib/saved-brief';
import {randomUUID} from 'node:crypto';
import {studioSession,hashStaffPassword} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {baselineProducts,validProduct} from '@/lib/shop-model';
import {originAllowed,smallJson} from '@/lib/request-security';
import {revalidatePath} from 'next/cache';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
const uuid=(v:unknown):v is string=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
export async function GET(request:Request){
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const sql=studioDb();const url=new URL(request.url);const view=url.searchParams.get('view');
  if(view==='catalogue'){
   const rows=await sql`SELECT product_id,draft,published,version,published_version,visible FROM rivya_catalogue`;
   const map=new Map(rows.map(r=>[r.product_id,r]));
   return json({products:[...baselineProducts.map(p=>{const r=map.get(p.id);return {product:r?.draft||p,version:r?.version||0,publishedVersion:r?.published_version||0,published:r?.published||null,visible:!!r?.published&&r.visible,hasDraft:!r||!r.published||JSON.stringify(r.draft)!==JSON.stringify(r.published)};}),...rows.filter(r=>!baselineProducts.some(p=>p.id===r.product_id)).map(r=>({product:r.draft,version:r.version,publishedVersion:r.published_version,published:r.published,visible:!!r.published&&r.visible,hasDraft:!r.published||JSON.stringify(r.draft)!==JSON.stringify(r.published)}))]});
  }
  if(view==='inquiry'){
   const id=url.searchParams.get('id');if(!uuid(id))return json({error:'Invalid reference.'},400);
   const inquiry=await sql`SELECT i.id,i.reference,i.product_snapshot AS product,i.name,i.phone,i.email,i.answers,i.notes,i.summary,i.assignee,i.follow_up AS "followUp",i.created_at AS "createdAt",o.version,to_jsonb(i) AS saved_record FROM rivya_inquiries i JOIN rivya_studio_orders o ON o.id=i.id WHERE i.id=${id}::uuid AND (${session.role==='admin'} OR i.assignee=${session.staffId}::uuid)`;
   if(!inquiry.length){
    if(session.role!=='admin')return json({error:'This inquiry is unavailable to your account.'},404);
    const manual=await sql`SELECT o.id,o.client,o.title,o.status,o.version,o.updated_at AS "updatedAt" FROM rivya_studio_orders o
     WHERE o.id=${id}::uuid AND NOT EXISTS(SELECT 1 FROM rivya_inquiries i WHERE i.id=o.id)`;
    if(!manual.length)return json({error:'This record is unavailable.'},404);
    const events=await sql`SELECT actor,from_status,to_status,reason,created_at AS "createdAt" FROM rivya_studio_order_events WHERE order_id=${id}::uuid ORDER BY created_at`;
    return json({manual:manual[0],events});
   }
   const [refs,notes,events]=await Promise.all([
    sql`SELECT r.id,r.created_at FROM rivya_references r JOIN rivya_inquiries i ON i.id=r.inquiry_id WHERE i.id=${id}::uuid AND r.state='ready' AND (${session.role==='admin'} OR i.assignee=${session.staffId}::uuid) ORDER BY r.created_at`,
    sql`SELECT n.id,n.actor,n.body,n.created_at AS "createdAt" FROM rivya_inquiry_notes n JOIN rivya_inquiries i ON i.id=n.inquiry_id WHERE i.id=${id}::uuid AND (${session.role==='admin'} OR i.assignee=${session.staffId}::uuid) ORDER BY n.created_at`,
    sql`SELECT e.actor,e.from_status,e.to_status,e.version,e.reason,e.created_at AS "createdAt" FROM rivya_studio_order_events e JOIN rivya_inquiries i ON i.id=e.order_id WHERE i.id=${id}::uuid AND (${session.role==='admin'} OR i.assignee=${session.staffId}::uuid) ORDER BY e.created_at`
   ]);
   const {saved_record,...record}=inquiry[0];
   const receipt=await orderReceipt(saved_record);
   let savedAnswers:{label:string;value:string}[]|null=null;
   if(saved_record.contract_version===2)try{savedAnswers=decodeSavedBrief(saved_record).answers.map(a=>({label:a.label,value:String(a.value)}));}catch{/* Keep raw stored evidence intact; no fabricated summary. */}
   return json({inquiry:{...record,requestKind:saved_record.request_kind||'product',savedAnswers,receipt},refs,notes,events});
  }
  const staff=await sql`SELECT id,login,name,role,active,version FROM rivya_staff ORDER BY name`;
  return json({session,staff:session.role==='admin'?staff:staff.filter(s=>s.active).map(s=>({id:s.id,name:s.name,role:s.role,active:s.active}))});
 }catch{return json({error:'Studio data is temporarily unavailable.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const body=await smallJson(request);const sql=studioDb();
  if(!body||typeof body!=='object')return json({error:'Invalid request.'},400);
  if(body.action==='catalogue'){
   const existing=await sql`SELECT draft FROM rivya_catalogue WHERE product_id=${typeof body.product?.id==='string'?body.product.id:''}`;
   const base=baselineProducts.find(p=>p.id===body.product?.id)||existing[0]?.draft;
   if(!validProduct(body.product,base)||!Number.isSafeInteger(body.version)||body.version<0||!['draft','publish','hide'].includes(body.operation))return json({error:'Check the product text, approved images and customization fields. Keep saved addresses stable and conditions linked to an earlier choice field.'},400);
   if(body.operation!=='draft'&&session.role!=='admin')return json({error:'Only an administrator can publish or hide a piece.'},403);
   const product={...body.product,revision:body.version+2};
   const publish=body.operation==='publish';const hide=body.operation==='hide';
   const rows=await sql`WITH saved AS (
    INSERT INTO rivya_catalogue(product_id,draft,published,version,published_version,visible,updated_by)
    SELECT ${product.id},${JSON.stringify(product)}::jsonb,${publish?JSON.stringify(product):null}::jsonb,1,${publish?2:1},${publish},${session.adminId} WHERE ${body.version}=0
    ON CONFLICT(product_id) DO NOTHING RETURNING product_id
   ), changed AS (
    UPDATE rivya_catalogue SET draft=${JSON.stringify(product)}::jsonb,published=CASE WHEN ${publish} THEN ${JSON.stringify(product)}::jsonb ELSE published END,
    version=version+1,published_version=CASE WHEN ${publish} THEN ${body.version+2} ELSE published_version END,
    visible=CASE WHEN ${publish} THEN true WHEN ${hide} THEN false ELSE visible END,updated_by=${session.adminId},updated_at=now()
    WHERE product_id=${product.id} AND version=${body.version} AND ${body.version}>0 RETURNING product_id
   ), history AS (
    INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation)
    SELECT 'product',${product.id},${body.version+1},${JSON.stringify(product)}::jsonb,${session.adminId},${body.operation}
    WHERE EXISTS(SELECT 1 FROM saved UNION ALL SELECT 1 FROM changed)
   ), previous_revision AS (
    INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation)
    SELECT 'product',product_id,version,draft,updated_by,'previous' FROM rivya_catalogue WHERE product_id=${product.id} AND EXISTS(SELECT 1 FROM changed)
    ON CONFLICT DO NOTHING
   ), logged AS (
    INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},${'catalogue:'+body.operation},product_id FROM(SELECT * FROM saved UNION ALL SELECT * FROM changed) r
   ) SELECT * FROM saved UNION ALL SELECT * FROM changed`;
   if(!rows.length)return json({error:'This piece changed on another device. Reload it before saving.'},409);
   if(publish||hide){revalidatePath('/','layout');revalidatePath('/sitemap.xml');}
   return json({saved:true});
  }
  if(body.action==='note'){
   if(!uuid(body.id)||typeof body.note!=='string'||!body.note.trim()||body.note.length>2000)return json({error:'Write a note within 2,000 characters.'},400);
   const rows=await sql`INSERT INTO rivya_inquiry_notes(inquiry_id,actor,body)
    SELECT id,${session.adminId},${body.note.trim()} FROM rivya_inquiries
    WHERE id=${body.id}::uuid AND (${session.role==='admin'} OR assignee=${session.staffId}::uuid) RETURNING id`;
   return rows.length?json({saved:true}):json({error:'This inquiry is unavailable to your account.'},404);
  }
  if(body.action==='assign'||body.action==='follow-up'){
   if(body.action==='assign'&&session.role!=='admin')return json({error:'Only an administrator can reassign an inquiry.'},403);
   if(body.action==='follow-up')body.assignee=session.staffId;
   if(!uuid(body.id)||!Number.isSafeInteger(body.version)||(body.assignee!==null&&!uuid(body.assignee))||(body.followUp!==null&&(typeof body.followUp!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(body.followUp))))return json({error:'Invalid assignment.'},400);
   if(body.assignee){const staff=await sql`SELECT id FROM rivya_staff WHERE id=${body.assignee}::uuid AND active=true`;if(!staff.length)return json({error:'Choose an active staff member.'},400);}
   const rows=await sql`WITH changed AS (
    UPDATE rivya_studio_orders o SET version=version+1,updated_at=now() WHERE id=${body.id}::uuid AND version=${body.version}
    AND EXISTS(SELECT 1 FROM rivya_inquiries i WHERE i.id=o.id AND (${session.role==='admin'} OR i.assignee=${session.staffId}::uuid)) RETURNING id
   ), assigned AS (
    UPDATE rivya_inquiries SET assignee=CASE WHEN ${body.action==='assign'} THEN ${body.assignee}::uuid ELSE assignee END,follow_up=${body.followUp}::date WHERE id IN(SELECT id FROM changed) RETURNING id
   ), logged AS (
    INSERT INTO rivya_inquiry_notes(inquiry_id,actor,body) SELECT id,${session.adminId},${`Assignment updated. Staff: ${body.assignee||'unassigned'}; follow-up: ${body.followUp||'none'}.`} FROM assigned
   ) SELECT id FROM assigned`;
   return rows.length?json({saved:true}):json({error:'This inquiry changed elsewhere. Reload and try again.'},409);
  }
  if(body.action==='staff'){
   if(session.role!=='admin')return json({error:'Administrator access required.'},403);
   if(typeof body.login!=='string'||! /^[a-zA-Z0-9_.@-]{3,80}$/.test(body.login)||body.login.toLowerCase()===process.env.STUDIO_ADMIN_ID?.toLowerCase()||typeof body.name!=='string'||!body.name.trim()||body.name.length>100||!['admin','editor'].includes(body.role)||typeof body.active!=='boolean')return json({error:'Check the staff name, unique login and role.'},400);
   if(body.password!==''&&(typeof body.password!=='string'||body.password.length<16||body.password.length>200))return json({error:'Use a password of 16–200 characters.'},400);
   if(!body.id&&!body.password)return json({error:'A password is required for a new staff account.'},400);
   if(body.id&&(!uuid(body.id)||!Number.isSafeInteger(body.version)))return json({error:'Invalid staff account.'},400);
   if(body.id===session.staffId)return json({error:'Ask another administrator to change your account.'},400);
   const hashed=body.password?await hashStaffPassword(body.password):null;
   const rows=body.id?await sql`WITH changed AS (UPDATE rivya_staff SET login=${body.login},name=${body.name.trim()},role=${body.role},active=${body.active},password_hash=COALESCE(${hashed},password_hash),version=version+1 WHERE id=${body.id}::uuid AND version=${body.version} RETURNING id), logged AS(INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},'staff:update',id::text FROM changed) SELECT id FROM changed`:
    await sql`WITH created AS(INSERT INTO rivya_staff(id,login,name,password_hash,role,active) VALUES(${randomUUID()}::uuid,${body.login},${body.name.trim()},${hashed!},${body.role},${body.active}) RETURNING id),logged AS(INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},'staff:create',id::text FROM created) SELECT id FROM created`;
   return rows.length?json({saved:true}):json({error:'This account changed elsewhere. Reload before saving.'},409);
  }
  return json({error:'Unknown action.'},400);
 }catch{return json({error:'The change was not saved. Check that logins are unique and try again.'},503);}
}
