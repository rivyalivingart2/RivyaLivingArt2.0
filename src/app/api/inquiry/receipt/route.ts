import {guestIdentity,originAllowed,limited,smallJson} from '@/lib/request-security';
import {uuid} from '@/lib/saved-brief';
import {authorizedHandoff,readOrder,finalizeOrderMessage} from '@/lib/order-handoff';
export const dynamic='force-dynamic';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow'}});
export async function GET(request:Request){
 try{
  const guest=await guestIdentity(),url=new URL(request.url),key=url.searchParams.get('key');
  if(!guest||!uuid(key))return json({found:false},404);
  const result=await authorizedHandoff(null,{kind:'guest',guest,key});
  if(!result)return json({found:false},404);
  return json({found:true,...(url.searchParams.get('open')==='1'?result:{receipt:result.receipt})});
 }catch{return json({error:'Your saved receipt is temporarily unavailable. Retry here; do not submit a new inquiry.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const guest=await guestIdentity(),body=await smallJson(request,500);
  if(!guest||!body||!uuid(body.key)||body.action!=='prepare'||Object.keys(body).some(k=>!['key','action'].includes(k)))return json({error:'This private receipt is unavailable.'},400);
  const access={kind:'guest' as const,guest,key:body.key},row=await readOrder(null,access);
  if(!row)return json({found:false},404);
  if(!await limited('message:'+guest,12))return json({error:'Too many recovery attempts. Your inquiry remains saved. Try later.'},429);
  await finalizeOrderMessage(String(row.id),access);
  const result=await authorizedHandoff(String(row.id),access);
  return json({found:true,receipt:result?.receipt});
 }catch{return json({error:'Your inquiry remains saved, but message preparation is unavailable. Retry here later.'},503);}
}
