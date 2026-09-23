import {randomUUID,createHash} from 'node:crypto';
import sharp from 'sharp';
import {saveReference,readReference,type ReferenceProvider} from '@/lib/reference-storage';
import {discardReference} from '@/lib/reference-cleanup';
import {guestIdentity,originAllowed,limited,clientRateKey,smallJson} from '@/lib/request-security';
import {studioDb} from '@/lib/studio-db';
import {requireOrderWrites} from '@/lib/order-service';
import {uuid} from '@/lib/saved-brief';
export const runtime='nodejs';
export const maxDuration=60;
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  await requireOrderWrites();
  const guest=await guestIdentity(),key=request.headers.get('x-inquiry-key'),uploadKey=request.headers.get('x-upload-key');
  if(!guest||!uuid(key)||!uuid(uploadKey))return json({error:'Reconnect this form before uploading.'},401);
  if(!await limited(await clientRateKey('upload'),15)||!await limited('upload:'+guest,9))return json({error:'Upload limit reached. Keep the brief and try later.'},429);
  const mime=request.headers.get('content-type')||'';
  if(!['image/jpeg','image/png','image/webp'].includes(mime))return json({error:'Choose a JPG, PNG or WebP image.'},400);
  const reader=request.body?.getReader();if(!reader)return json({error:'Choose an image.'},400);
  const parts:Uint8Array[]=[];let size=0;
  for(;;){const result=await reader.read();if(result.done)break;size+=result.value.length;if(size>3*1024*1024){await reader.cancel();return json({error:'Each image must be at most 3 MB.'},413);}parts.push(result.value);}
  const input=Buffer.concat(parts),metadata=await sharp(input,{limitInputPixels:20000000}).metadata();
  const expected:Record<string,string>={'image/jpeg':'jpeg','image/png':'png','image/webp':'webp'};
  if(metadata.format!==expected[mime]||(metadata.pages??1)>1||!metadata.width||!metadata.height)return json({error:'Use a still JPG, PNG or WebP whose content matches its type.'},400);
  const clean=await sharp(input,{limitInputPixels:20000000,animated:false}).rotate().resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).jpeg({quality:82}).toBuffer();
  const digest=createHash('sha256').update(clean).digest('hex'),id=randomUUID(),pathname='references/'+id+'.jpg',lease=randomUUID(),sql=studioDb();
  // Every upload/save/cleanup acquires the same session lock before inspecting reservations.
  const [,rows]=await sql.transaction([
   sql`SELECT request_key FROM rivya_inquiry_upload_sessions WHERE request_key=${key}::uuid AND guest_hash=${guest} FOR UPDATE`,
   sql`WITH session AS MATERIALIZED (
    SELECT request_key,used_slots FROM rivya_inquiry_upload_sessions WHERE request_key=${key}::uuid AND guest_hash=${guest} AND finalized=false AND created_at>now()-interval '24 hours'
   ), prior AS MATERIALIZED (
    SELECT r.* FROM rivya_references r JOIN session s USING(request_key) WHERE r.upload_key=${uploadKey}::uuid AND r.guest_hash=${guest} AND r.inquiry_id IS NULL FOR UPDATE OF r
   ), budget AS (
    UPDATE rivya_storage_budget SET bytes=bytes+${clean.length} WHERE id=1 AND bytes+${clean.length}<=500000000
     AND NOT EXISTS(SELECT 1 FROM prior) AND EXISTS(SELECT 1 FROM session WHERE used_slots<3) RETURNING id
   ), slot AS (
    UPDATE rivya_inquiry_upload_sessions SET used_slots=used_slots+1 WHERE request_key IN(SELECT request_key FROM session) AND EXISTS(SELECT 1 FROM budget) RETURNING request_key
   ), created AS (
    INSERT INTO rivya_references(id,guest_hash,request_key,upload_key,pathname,bytes,state,storage_provider,normalized_mime,upload_sha256,write_token,write_expires_at)
     SELECT ${id}::uuid,${guest},request_key,${uploadKey}::uuid,${pathname},${clean.length},'pending','vercel','image/jpeg',${digest},${lease}::uuid,now()+interval '5 minutes' FROM slot RETURNING *
   ), renewed AS (
    UPDATE rivya_references SET write_token=${lease}::uuid,write_expires_at=now()+interval '5 minutes'
     WHERE id IN(SELECT id FROM prior WHERE state='pending' AND upload_sha256=${digest} AND write_expires_at<now()) RETURNING *
   ) SELECT id,pathname,storage_provider,state,write_token FROM created UNION ALL SELECT id,pathname,storage_provider,state,write_token FROM renewed
    UNION ALL SELECT id,pathname,storage_provider,state,write_token FROM prior WHERE state='ready' AND upload_sha256=${digest}`
  ],{isolationLevel:'ReadCommitted'});
  const row=rows[0];
  if(!row)return json({error:'This upload is still processing, expired, changed or the form is full. Wait five minutes before retrying the same image, or remove it when available.'},409);
  if(row.state==='ready')return json({id:row.id});
  try{await saveReference(row.pathname,clean,row.storage_provider as ReferenceProvider);}catch(error){
   const recovered=await readReference(row.pathname,row.storage_provider as ReferenceProvider);if(!recovered)throw error;
   const stream=recovered.getReader(),hash=createHash('sha256');let recoveredBytes=0;
   try{for(;;){const part=await stream.read();if(part.done)break;recoveredBytes+=part.value.length;if(recoveredBytes>3*1024*1024)throw Error('Stored reference exceeds its limit');hash.update(part.value);}}
   finally{await stream.cancel();}
   if(recoveredBytes!==clean.length||hash.digest('hex')!==digest)throw Error('Stored reference does not match this upload');
  }
  const [,ready]=await sql.transaction([
   sql`SELECT request_key FROM rivya_inquiry_upload_sessions WHERE request_key=${key}::uuid AND guest_hash=${guest} FOR UPDATE`,
   sql`UPDATE rivya_references r SET state='ready',write_token=NULL,write_expires_at=NULL WHERE r.id=${row.id}::uuid AND r.state='pending' AND r.write_token=${lease}::uuid AND r.write_expires_at>now() AND r.inquiry_id IS NULL
    AND EXISTS(SELECT 1 FROM rivya_inquiry_upload_sessions s WHERE s.request_key=r.request_key AND s.guest_hash=${guest} AND s.finalized=false) RETURNING r.id`
  ],{isolationLevel:'ReadCommitted'});
  return ready.length?json({id:ready[0].id}):json({error:'Upload status changed. Keep the brief and retry this same image later.'},409);
 }catch{return json({error:'The image could not be confirmed. Keep the brief and retry this same image after five minutes; do not choose it repeatedly.'},503);}
}
export async function DELETE(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  await requireOrderWrites();
  const guest=await guestIdentity(),body=await smallJson(request,1000);
  if(!guest||!body||!uuid(body.key)||(!uuid(body.id)&&!uuid(body.uploadKey)))return json({error:'Invalid reference.'},400);
  const rows=await studioDb()`SELECT id,inquiry_id FROM rivya_references WHERE request_key=${body.key}::uuid AND guest_hash=${guest} AND (id=${uuid(body.id)?body.id:null}::uuid OR upload_key=${uuid(body.uploadKey)?body.uploadKey:null}::uuid)`;
  if(!rows.length)return json({removed:true});
  if(rows[0].inquiry_id)return json({error:'A saved inquiry reference cannot be removed here.'},409);
  return await discardReference(rows[0].id)?json({removed:true}):json({error:'This upload may still be writing. Retry its status first; pending uploads are retained for safe expiry cleanup.'},409);
 }catch{return json({error:'Reference removal is unavailable. Retry before submitting.'},503);}
}
