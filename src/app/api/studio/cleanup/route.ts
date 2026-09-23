import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {originAllowed,smallJson} from '@/lib/request-security';
import {discardReference} from '@/lib/reference-cleanup';
import {requireOrderWrites} from '@/lib/order-service';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(){
 try{const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);if(session.role!=='admin')return json({error:'Administrator access required.'},403);
  const rows=await studioDb()`SELECT count(*)::integer AS count,COALESCE(sum(bytes),0)::bigint AS bytes FROM rivya_references WHERE inquiry_id IS NULL AND created_at<now()-interval '24 hours'`;
  return json(rows[0]);
 }catch{return json({error:'Cleanup inventory is unavailable.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);if(session.role!=='admin')return json({error:'Administrator access required.'},403);
  const body=await smallJson(request,1000);if(body.confirm!=='delete-expired-unsubmitted')return json({error:'Confirm deletion of expired unsubmitted images.'},400);
  await requireOrderWrites();
  const sql=studioDb(),rows=await sql`SELECT id FROM rivya_references WHERE inquiry_id IS NULL AND created_at<now()-interval '24 hours' ORDER BY created_at LIMIT 25`;
  let removed=0,failed=0;for(const row of rows){try{if(await discardReference(row.id,true))removed++;}catch{failed++;}}
  await sql`INSERT INTO rivya_audit(actor,action,entity) VALUES(${session.adminId},'references:expired-cleanup',${removed+' removed; '+failed+' retained for retry'})`;
  return json({removed,failed});
 }catch{return json({error:'Cleanup could not finish. Remaining records are retained for retry.'},503);}
}
