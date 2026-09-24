import {isOrderStage} from '@/lib/studio-orders';
import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {originAllowed,smallJson} from '@/lib/request-security';
import {serviceStatus} from '@/lib/service-status';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(request:Request){
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const sql=studioDb(),view=new URL(request.url).searchParams.get('view');
  if(view==='settings'){
   if(session.role!=='admin')return json({error:'Administrator access required.'},403);
   return json({...await serviceStatus(),workflow:'The order request is saved to the database and Studio before its WhatsApp message is prepared. The customer opens WhatsApp and presses Send. No online payments or customer accounts.'});
  }
  if(view==='activity'){
   const events=await sql`SELECT e.id,e.actor,e.from_status,e.to_status,e.reason,e.created_at AS "createdAt",o.client,o.title,i.reference
    FROM rivya_studio_order_events e JOIN rivya_studio_orders o ON o.id=e.order_id LEFT JOIN rivya_inquiries i ON i.id=o.id
    WHERE ${session.role==='admin'} OR i.assignee=${session.staffId}::uuid ORDER BY e.created_at DESC LIMIT 100`;
   const edits=await sql`SELECT actor,action,entity,created_at AS "createdAt" FROM rivya_audit
    WHERE ${session.role==='admin'} OR actor=${session.adminId} AND (action LIKE 'catalogue:%' OR action LIKE 'content:%' OR action LIKE 'media:%' OR EXISTS(SELECT 1 FROM rivya_inquiries i WHERE i.id::text=rivya_audit.entity AND i.assignee=${session.staffId}::uuid)) ORDER BY created_at DESC LIMIT 100`;
   return json({events,edits});
  }
  const [stages,followups,recent]=await Promise.all([
   sql`SELECT o.status,count(*)::integer AS count FROM rivya_studio_orders o LEFT JOIN rivya_inquiries i ON i.id=o.id
    WHERE ${session.role==='admin'} OR i.assignee=${session.staffId}::uuid GROUP BY o.status`,
   sql`SELECT i.id,i.reference,i.name,i.follow_up AS "followUp",o.title,o.status FROM rivya_inquiries i JOIN rivya_studio_orders o ON o.id=i.id
    WHERE (${session.role==='admin'} OR i.assignee=${session.staffId}::uuid) AND i.follow_up<=CURRENT_DATE AND o.status NOT IN ('COMPLETED','CLOSED') ORDER BY i.follow_up LIMIT 30`,
   sql`SELECT o.id,o.client,o.title,o.status,o.updated_at AS "updatedAt",i.reference FROM rivya_studio_orders o LEFT JOIN rivya_inquiries i ON i.id=o.id
    WHERE ${session.role==='admin'} OR i.assignee=${session.staffId}::uuid ORDER BY o.updated_at DESC LIMIT 10`
  ]);
  return json({stages,followups,recent});
 }catch{return json({error:'This workspace view is temporarily unavailable.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  if(session.role!=='admin')return json({error:'Administrator access required.'},403);
  const body=await smallJson(request,1000);if(!body||body.action!=='export'||body.confirm!=='private-export')return json({error:'Confirm the private export.'},400);
  const sql=studioDb();
  const from=body.from||'',to=body.to||'',stage=body.stage||'',source=body.source||'';
  const validDate=(v:unknown)=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
  if(from&&!validDate(from)||to&&!validDate(to)||from&&to&&from>to||stage&&!isOrderStage(stage)||!['','website','manual'].includes(source))return json({error:'Check the export date range, source and stage.'},400);
  const rows=await sql`SELECT o.id,i.reference,o.client,o.title,o.status,i.phone,i.email,i.follow_up,o.created_at,CASE WHEN i.id IS NULL THEN 'manual' ELSE 'website' END AS source
    FROM rivya_studio_orders o LEFT JOIN rivya_inquiries i ON i.id=o.id
    WHERE (NULLIF(${from},'')::date IS NULL OR o.created_at>=(NULLIF(${from},'')::date::timestamp AT TIME ZONE 'UTC'))
     AND (NULLIF(${to},'')::date IS NULL OR o.created_at<((NULLIF(${to},'')::date+1)::timestamp AT TIME ZONE 'UTC'))
     AND (${stage}='' OR o.status=${stage}) AND (${source}='' OR ${source}='manual' AND i.id IS NULL OR ${source}='website' AND i.id IS NOT NULL)
    ORDER BY o.created_at DESC,o.id LIMIT 5001`;
  if(rows.length>5000)return json({error:'This export exceeds 5,000 rows. A scoped export must be prepared before downloading.'},409);
  const columns=['id','reference','client','title','status','phone','email','follow_up','created_at','source'];
  const cell=(value:unknown)=>{let t=value==null?'':String(value);if(/^[\s]*[=+\-@\t\r]/.test(t))t="'"+t;return '"'+t.replaceAll('"','""')+'"';};
  const csv=[columns.join(','),...rows.map(r=>columns.map(k=>cell(r[k])).join(','))].join('\r\n');
  await sql`INSERT INTO rivya_audit(actor,action,entity) VALUES(${session.adminId},'orders:export',${JSON.stringify({count:rows.length,from,to,stage,source})})`;
  return new Response(csv,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="rivya-private-orders.csv"','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 }catch{return json({error:'Export is temporarily unavailable.'},503);}
}
