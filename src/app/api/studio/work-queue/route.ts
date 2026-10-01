import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {businessDate} from '@/lib/business-time';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
/** Bounded operational summaries only. Every query repeats the existing assignment scope. */
export async function GET(){
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const sql=studioDb(),today=businessDate(),admin=session.role==='admin';
  const [totals,stages,followups,recent,editorial]=await Promise.all([
   sql`SELECT count(*) FILTER(WHERE i.follow_up=${today}::date AND o.status NOT IN ('COMPLETED','CLOSED'))::integer AS today,
    count(*) FILTER(WHERE i.follow_up<${today}::date AND o.status NOT IN ('COMPLETED','CLOSED'))::integer AS overdue,
    count(*) FILTER(WHERE i.id IS NOT NULL AND i.assignee IS NULL AND o.status NOT IN ('COMPLETED','CLOSED'))::integer AS unassigned,
    count(*) FILTER(WHERE i.message_state='handoff_failed' AND o.status NOT IN ('COMPLETED','CLOSED'))::integer AS "message-failed"
    FROM rivya_studio_orders o LEFT JOIN rivya_inquiries i ON i.id=o.id WHERE (${admin} OR i.assignee=${session.staffId}::uuid)`,
   sql`SELECT o.status,count(*)::integer AS count FROM rivya_studio_orders o LEFT JOIN rivya_inquiries i ON i.id=o.id WHERE (${admin} OR i.assignee=${session.staffId}::uuid) GROUP BY o.status`,
   sql`SELECT i.id,i.reference,o.title,o.status,i.follow_up::text AS "followUp" FROM rivya_inquiries i JOIN rivya_studio_orders o ON o.id=i.id WHERE (${admin} OR i.assignee=${session.staffId}::uuid) AND i.follow_up<=${today}::date AND o.status NOT IN ('COMPLETED','CLOSED') ORDER BY i.follow_up,i.id LIMIT 8`,
   sql`SELECT o.id,i.reference,o.title,o.status,o.updated_at AS "updatedAt" FROM rivya_studio_orders o LEFT JOIN rivya_inquiries i ON i.id=o.id WHERE (${admin} OR i.assignee=${session.staffId}::uuid) ORDER BY o.updated_at DESC,o.id LIMIT 8`,
   sql`SELECT content_key AS id,draft->>'title' AS title,version,updated_at AS "updatedAt" FROM rivya_content ORDER BY updated_at DESC,content_key LIMIT 8`
  ]);
  return json({asOf:new Date().toISOString(),businessDate:today,scope:admin?'all':'assigned',counts:totals[0],stages,followups,recent,editorial});
 }catch{return json({error:'The work queue could not be refreshed. Previously loaded information may be out of date.'},503);}
}
