import {guestIdentity,originAllowed,limited,clientRateKey,smallJson} from '@/lib/request-security';
import {requireOrderWrites} from '@/lib/order-service';
import {studioDb} from '@/lib/studio-db';
import {uuid} from '@/lib/saved-brief';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  await requireOrderWrites();
  const body=await smallJson(request,300);
  if(!body||!uuid(body.key)||Object.keys(body).some(k=>k!=='key'))return json({error:'Reconnect this form.'},400);
  if(!await limited(await clientRateKey('start'),40))return json({error:'Please try again later.'},429);
  const guest=await guestIdentity(true),sql=studioDb();
  await sql`INSERT INTO rivya_inquiry_upload_sessions(request_key,guest_hash) VALUES(${body.key}::uuid,${guest}) ON CONFLICT DO NOTHING`;
  const rows=await sql`SELECT finalized FROM rivya_inquiry_upload_sessions WHERE request_key=${body.key}::uuid AND guest_hash=${guest} AND created_at>now()-interval '24 hours'`;
  if(!rows.length)return json({error:'This form expired. Copy your brief before reopening it.'},409);
  return json({ready:true,finalized:rows[0].finalized});
 }catch{return json({error:'Saving order requests is temporarily unavailable. You can prepare and copy your brief; nothing has been submitted.'},503);}
}
