import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {analyticsRange} from '@/lib/studio-analytics';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(request:Request){
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const params=new URL(request.url).searchParams;let range;
  try{range=analyticsRange(params.get('from'),params.get('to'));}catch{return json({error:'Choose valid dates covering 1–366 IST calendar days.'},400);}
  const admin=session.role==='admin',sql=studioDb();
  // One coherent aggregate statement. Current assignment scope applies to every period and series.
  const rows=await sql`WITH scoped AS (
   SELECT o.status,o.created_at,(i.id IS NOT NULL) AS website FROM rivya_studio_orders o LEFT JOIN rivya_inquiries i ON i.id=o.id
   WHERE (${admin} OR i.assignee=${session.staffId}::uuid) AND o.created_at>=${range.previousFrom}::timestamptz AND o.created_at<${range.toExclusive}::timestamptz
  ), current_period AS (SELECT * FROM scoped WHERE created_at>=${range.fromInstant}::timestamptz)
  SELECT jsonb_build_object('received',(SELECT count(*) FROM current_period),'website',(SELECT count(*) FROM current_period WHERE website),'manual',(SELECT count(*) FROM current_period WHERE NOT website),'previous',(SELECT count(*) FROM scoped WHERE created_at<${range.fromInstant}::timestamptz)) AS totals,
  COALESCE((SELECT jsonb_agg(v ORDER BY v.status) FROM (SELECT status,count(*)::integer AS count FROM current_period GROUP BY status) v),'[]'::jsonb) AS stages,
  (SELECT jsonb_agg(v ORDER BY v.date) FROM (SELECT day::date::text AS date,(SELECT count(*)::integer FROM current_period p WHERE (p.created_at AT TIME ZONE 'Asia/Kolkata')::date=day::date) AS count FROM generate_series(${range.from}::date,${range.to}::date,interval '1 day') day) v) AS days`;
  return json({asOf:new Date().toISOString(),scope:admin?'all':'assigned',range,...rows[0]});
 }catch{return json({error:'Analytics is temporarily unavailable. No counts can be confirmed.'},503);}
}
