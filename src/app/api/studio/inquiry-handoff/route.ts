import {studioSession} from '@/lib/studio-auth';
import {originAllowed,smallJson,limited} from '@/lib/request-security';
import {uuid} from '@/lib/saved-brief';
import {authorizedHandoff,readOrder,finalizeOrderMessage,type OrderAccess} from '@/lib/order-handoff';
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
  const body=await smallJson(request,500);if(!body||!uuid(body.id)||body.action!=='prepare'||Object.keys(body).some(k=>!['id','action'].includes(k)))return json({error:'Invalid inquiry.'},400);
  const access:OrderAccess={kind:'staff',admin:session.role==='admin',staffId:session.staffId};
  if(!await readOrder(body.id,access))return json({error:'This inquiry is unavailable to your account.'},404);
  if(!await limited('staff-message:'+session.adminId,20))return json({error:'Too many attempts. Try later.'},429);
  await finalizeOrderMessage(body.id,access);
  const result=await authorizedHandoff(body.id,access);
  return result?json({found:true,receipt:result.receipt}):json({error:'This inquiry is unavailable to your account.'},404);
 }catch{return json({error:'Message preparation is unavailable. The saved inquiry has not been changed.'},503);}
}
