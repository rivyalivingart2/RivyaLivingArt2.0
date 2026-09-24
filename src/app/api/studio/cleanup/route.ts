import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {originAllowed,smallJson} from '@/lib/request-security';
import {discardReference} from '@/lib/reference-cleanup';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(){
 try{const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);if(session.role!=='admin')return json({error:'Administrator access required.'},403);
  const rows=await studioDb()`SELECT count(*)::integer AS count,COALESCE(sum(bytes),0)::bigint AS bytes FROM rivya_references WHERE inquiry_id IS NULL AND created_at<now()-interval '24 hours' AND (write_expires_at IS NULL OR write_expires_at<now())`;
  const retained=await studioDb()`SELECT count(*)::integer AS count,COALESCE(sum(bytes),0)::bigint AS bytes FROM rivya_references WHERE inquiry_id IS NOT NULL`;
  return json({...rows[0],submitted:retained[0],intakeEnabled:process.env.RIVYA_ORDER_INTAKE_ENABLED==='true',dataMode:process.env.RIVYA_DATA_MODE==='shared'?'shared':'isolated-or-unset'});
 }catch{return json({error:'Cleanup inventory is unavailable.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);if(session.role!=='admin')return json({error:'Administrator access required.'},403);
  const body=await smallJson(request,1000);
  if(!body||!['delete-expired-unsubmitted','delete-expired-access-metadata'].includes(body.confirm))return json({error:'Choose and confirm the maintenance operation.'},400);
  const sql=studioDb();
  if(body.confirm==='delete-expired-access-metadata'){
   // Locks and final expiry predicates protect concurrent counter renewals. Each batch is bounded.
   const [limits,sessions,uploads]=await sql.transaction([
    sql`DELETE FROM rivya_studio_login_limits WHERE key IN(SELECT key FROM rivya_studio_login_limits WHERE reset_at<now()-interval '1 day' ORDER BY reset_at LIMIT 250 FOR UPDATE SKIP LOCKED) AND reset_at<now()-interval '1 day' RETURNING key`,
    sql`DELETE FROM rivya_studio_sessions WHERE token_hash IN(SELECT token_hash FROM rivya_studio_sessions WHERE expires_at<now()-interval '1 day' OR idle_expires_at<now()-interval '1 day' ORDER BY expires_at LIMIT 250 FOR UPDATE SKIP LOCKED) AND (expires_at<now()-interval '1 day' OR idle_expires_at<now()-interval '1 day') RETURNING token_hash`,
    sql`DELETE FROM rivya_inquiry_upload_sessions s WHERE request_key IN(SELECT u.request_key FROM rivya_inquiry_upload_sessions u WHERE u.created_at<now()-interval '24 hours' AND NOT EXISTS(SELECT 1 FROM rivya_references r WHERE r.request_key=u.request_key) AND NOT EXISTS(SELECT 1 FROM rivya_inquiries i WHERE i.request_key=u.request_key) ORDER BY u.created_at LIMIT 250 FOR UPDATE OF u SKIP LOCKED) AND created_at<now()-interval '24 hours' AND NOT EXISTS(SELECT 1 FROM rivya_references r WHERE r.request_key=s.request_key) AND NOT EXISTS(SELECT 1 FROM rivya_inquiries i WHERE i.request_key=s.request_key) RETURNING request_key`
   ]);
   const removed={limits:limits.length,sessions:sessions.length,unsubmittedForms:uploads.length};
   await sql`INSERT INTO rivya_audit(actor,action,entity) VALUES(${session.adminId},'maintenance:expired-access',${JSON.stringify(removed)})`;
   return json({removed});
  }
  const rows=await sql`SELECT id FROM rivya_references WHERE inquiry_id IS NULL AND created_at<now()-interval '24 hours' AND (write_expires_at IS NULL OR write_expires_at<now()) ORDER BY created_at LIMIT 25`;
  let removed=0,failed=0;for(const row of rows){try{if(await discardReference(row.id,true))removed++;}catch{failed++;}}
  await sql`INSERT INTO rivya_audit(actor,action,entity) VALUES(${session.adminId},'references:expired-cleanup',${removed+' removed; '+failed+' retained for retry'})`;
  return json({removed,failed});
 }catch{return json({error:'Cleanup could not finish. Remaining records are retained for retry.'},503);}
}
