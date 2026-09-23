import {randomUUID} from 'node:crypto';
import sharp from 'sharp';
import {referenceProvider,saveReference,readReference,type ReferenceProvider} from '@/lib/reference-storage';
import {discardReference} from '@/lib/reference-cleanup';
import {guestIdentity,originAllowed,limited,clientRateKey,smallJson} from '@/lib/request-security';
import {studioDb} from '@/lib/studio-db';
export const runtime='nodejs';
const uuid=(v:unknown):v is string=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 let reservedId:string|null=null;
 try{
  const guest=await guestIdentity(),key=request.headers.get('x-inquiry-key'),uploadKey=request.headers.get('x-upload-key');
  if(!guest||!uuid(key)||!uuid(uploadKey))return json({error:'Reopen the form before uploading.'},401);
  const sql=studioDb();
  const previous=await sql`SELECT id,state,pathname,bytes,storage_provider FROM rivya_references WHERE upload_key=${uploadKey}::uuid AND guest_hash=${guest} AND request_key=${key}::uuid AND inquiry_id IS NULL`;
  if(previous[0]?.state==='ready')return json({id:previous[0].id});
  if(previous[0]?.state==='deleting')return json({error:'This upload is being removed. Choose the file again after removal finishes.'},409);
  if(previous.length){const stream=await readReference(previous[0].pathname,previous[0].storage_provider as ReferenceProvider);if(stream){await stream.cancel();const recovered=await sql`UPDATE rivya_references SET state='ready' WHERE id=${previous[0].id}::uuid AND state='pending' AND inquiry_id IS NULL RETURNING id`;if(recovered.length)return json({id:recovered[0].id});return json({error:'This upload has already changed. Refresh the form.'},409);}}
  if(!await limited(await clientRateKey('upload'),15)||!await limited('upload:'+guest,9))return json({error:'Upload limit reached. Please try again later.'},429);
  const mime=request.headers.get('content-type')||'';
  if(!['image/jpeg','image/png','image/webp'].includes(mime))return json({error:'Choose a JPG, PNG or WebP image.'},400);
  const reader=request.body?.getReader();if(!reader)return json({error:'Choose an image.'},400);
  const parts:Uint8Array[]=[];let size=0;
  for(;;){const result=await reader.read();if(result.done)break;size+=result.value.length;if(size>3*1024*1024){await reader.cancel();return json({error:'Each image must be at most 3 MB.'},413);}parts.push(result.value);}
  const input=Buffer.concat(parts),metadata=await sharp(input,{limitInputPixels:20000000}).metadata();
  const expected:Record<string,string>={'image/jpeg':'jpeg','image/png':'png','image/webp':'webp'};
  if(metadata.format!==expected[mime]||(metadata.pages??1)>1||!metadata.width||!metadata.height)return json({error:'Use a still JPG, PNG or WebP image whose file content matches its type.'},400);
  const clean=await sharp(input,{limitInputPixels:20000000,animated:false}).rotate().resize({width:1800,height:1800,fit:'inside',withoutEnlargement:true}).jpeg({quality:82}).toBuffer();
  const id=previous[0]?.id||randomUUID(),pathname=previous[0]?.pathname||'references/'+id+'.jpg',provider:ReferenceProvider=previous[0]?.storage_provider||referenceProvider();
  if(previous.length&&Number(previous[0].bytes)!==clean.length)return json({error:'Retry using the same file, or remove it and choose a new image.'},409);
  // SQL transaction rolls back all reservations if the final insert cannot be made.
  const operations=[
    sql`INSERT INTO rivya_inquiry_upload_sessions(request_key,guest_hash) VALUES(${key}::uuid,${guest}) ON CONFLICT DO NOTHING`,
    sql`WITH session AS (
      UPDATE rivya_inquiry_upload_sessions SET used_slots=used_slots+1 WHERE request_key=${key}::uuid AND guest_hash=${guest} AND used_slots<3 AND finalized=false AND created_at>now()-interval '24 hours' RETURNING request_key
    ), budget AS (
      UPDATE rivya_storage_budget SET bytes=bytes+${clean.length} WHERE id=1 AND bytes+${clean.length}<=500000000 AND EXISTS(SELECT 1 FROM session) RETURNING id
    ) INSERT INTO rivya_references(id,guest_hash,request_key,upload_key,pathname,bytes,state,storage_provider)
      VALUES(CASE WHEN EXISTS(SELECT 1 FROM budget) THEN ${id}::uuid ELSE NULL END,${guest},${key}::uuid,${uploadKey}::uuid,${pathname},${clean.length},'pending',${provider}) RETURNING id`
  ];
  if(!previous.length)await sql.transaction(operations);reservedId=id;
  try{await saveReference(pathname,clean,provider);}catch(error){const recovered=await readReference(pathname,provider);if(!recovered)throw error;await recovered.cancel();}
  const ready=await sql`UPDATE rivya_references SET state='ready' WHERE id=${id}::uuid AND state IN ('pending','ready') AND inquiry_id IS NULL RETURNING id`;
  if(!ready.length)return json({error:'This upload was already removed or attached.'},409);
  return json({id});
 }catch{
  // A timed-out provider write might still complete. Retain the pending reservation for expired-upload cleanup.
  void reservedId;
  return json({error:'The image could not be saved. The form may be full, expired or temporarily unavailable. Retry this file, or explicitly remove it before submitting.'},503);
 }
}
export async function DELETE(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const guest=await guestIdentity(),body=await smallJson(request,1000);
  if(!guest||!uuid(body.id)||!uuid(body.key))return json({error:'Invalid reference.'},400);
  const rows=await studioDb()`SELECT id FROM rivya_references WHERE id=${body.id}::uuid AND request_key=${body.key}::uuid AND guest_hash=${guest} AND inquiry_id IS NULL`;
  if(!rows.length)return json({error:'This reference is unavailable or is already attached to a saved inquiry.'},404);
  return await discardReference(body.id)?json({removed:true}):json({error:'This reference is already attached to an inquiry.'},409);
 }catch{return json({error:'Reference removal is temporarily unavailable. Retry before submitting.'},503);}
}

