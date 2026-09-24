import {studioSession} from '@/lib/studio-auth';
import {originAllowed,smallJson,limited} from '@/lib/request-security';
import {uuid} from '@/lib/saved-brief';
import {authorizedHandoff,readOrder,finalizeOrderMessage,type OrderAccess} from '@/lib/order-handoff';
import {studioDb} from '@/lib/studio-db';
import {requireOrderWrites} from '@/lib/order-service';
import {decodeSavedBrief,renderSavedMessage} from '@/lib/saved-brief';
import {maxMessageAttempts} from '@/lib/order-consent';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer'}});
export async function GET(request:Request){
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const url=new URL(request.url),id=url.searchParams.get('id');if(!uuid(id))return json({error:'Invalid inquiry.'},400);
  const result=await authorizedHandoff(id,{kind:'staff',admin:session.role==='admin',staffId:session.staffId});
  return result?json({found:true,...(url.searchParams.get('open')==='1'?result:{receipt:result.receipt})}):json({error:'This inquiry is unavailable to your account.'},404);
 }catch{return json({error:'The saved order message is temporarily unavailable.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const body=await smallJson(request,1000);if(!body||!uuid(body.id)||!['prepare','recover'].includes(body.action)||Object.keys(body).some(k=>!['id','action','reason'].includes(k)))return json({error:'Invalid inquiry.'},400);
  const access:OrderAccess={kind:'staff',admin:session.role==='admin',staffId:session.staffId};
  const saved=await readOrder(body.id,access);if(!saved)return json({error:'This inquiry is unavailable to your account.'},404);
  if(body.action==='recover'){
   if(session.role!=='admin')return json({error:'Administrator access required.'},403);
   if(typeof body.reason!=='string'||body.reason.trim().length<10||body.reason.length>400)return json({error:'Record the checked cause and repair before restoring message preparation.'},400);
   await requireOrderWrites('message');
   if(!await limited('message-recovery:'+session.adminId,5))return json({error:'Too many recovery attempts. Review the underlying fault before trying later.'},429);
   // Validate the original snapshot first. Never replace facts or change its destination.
   try{renderSavedMessage(decodeSavedBrief(saved),String(saved.message_template_version));}catch{return json({error:'The saved snapshot still cannot be rendered. Preserve it for repair; no retry allowance was restored.'},409);}
   const sql=studioDb();
   const recovered=await sql`WITH changed AS (
    UPDATE rivya_inquiries SET message_attempts=0,message_state='handoff_pending',message_failure_code=NULL
    WHERE id=${body.id}::uuid AND contract_version=2 AND message_attempts>=${maxMessageAttempts}
     AND message_state IN('handoff_pending','handoff_failed') RETURNING id
   ), logged AS (
    INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},'inquiry:message-recovery',${JSON.stringify({id:body.id,previousAttempts:Number(saved.message_attempts),reason:body.reason.trim()})}
    WHERE EXISTS(SELECT 1 FROM changed)
   ) SELECT id FROM changed`;
   if(!recovered.length)return json({error:'The message state changed or recovery is not needed. Refresh the inquiry.'},409);
   const result=await authorizedHandoff(body.id,access);
   return result?json({found:true,receipt:result.receipt}):json({error:'Refresh the saved inquiry.'},409);
  }
  if(!await limited('staff-message:'+session.adminId,20))return json({error:'Too many attempts. Try later.'},429);
  await finalizeOrderMessage(body.id,access);
  const result=await authorizedHandoff(body.id,access);
  return result?json({found:true,receipt:result.receipt}):json({error:'This inquiry is unavailable to your account.'},404);
 }catch{return json({error:'Message preparation is unavailable. Your inquiry remains saved. Refresh its current state before retrying.'},503);}
}
