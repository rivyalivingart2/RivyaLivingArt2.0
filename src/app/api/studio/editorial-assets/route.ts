import {randomUUID} from 'node:crypto';
import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {originAllowed,smallJson} from '@/lib/request-security';
import {boundedImageBody,processEditorialImage} from '@/lib/editorial-media-processing';
import {saveEditorialFile} from '@/lib/editorial-media-storage';
import {editorialPath,isEditorialPath,validEditorialMedia,validPublishedEditorialMedia,type EditorialMedia} from '@/lib/editorial-media-model';
import {revalidatePath} from 'next/cache';
export const dynamic='force-dynamic';
export const runtime='nodejs';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(){try{if(!await studioSession())return json({error:'Sign in to continue.'},401);const rows=await studioDb()`SELECT path,draft,version,published FROM rivya_public_media WHERE path LIKE '/editorial/%' ORDER BY updated_at DESC`;return json({media:rows.filter(r=>validEditorialMedia(r.draft)).map(r=>({media:r.draft,version:Number(r.version),published:validPublishedEditorialMedia(r.published)?r.published:null}))});}catch{return json({error:'Editorial images are temporarily unavailable.'},503);}}
export async function PUT(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const driveId=request.headers.get('x-drive-file-id')||'',filename=decodeURIComponent(request.headers.get('x-file-name')||'');
  if(!/^[A-Za-z0-9_-]{10,100}$/.test(driveId)||!filename||filename.length>180||/[<>/\\]/.test(filename))return json({error:'Provide the original filename and exact Drive file ID.'},400);
  let processed;let bytes:Buffer;try{bytes=await boundedImageBody(request);processed=await processEditorialImage(bytes);}catch{return json({error:'Processing failed. Use a still JPEG, PNG or WebP up to 4 MB, 320 pixels per side and 20 megapixels. Nothing is available for publication.'},400);}
  const sql=studioDb();const existing=await sql`SELECT draft,version,published FROM rivya_public_media WHERE path LIKE '/editorial/%' AND draft->'editorial'->>'sha256'=${processed.sha256} LIMIT 1`;
  if(existing.length)return json({entry:{media:existing[0].draft,version:Number(existing[0].version),published:existing[0].published},reused:true});
  const id=randomUUID();
  await saveEditorialFile(id,'original',bytes,'image/'+processed.format);
  await Promise.all(processed.variants.map(v=>saveEditorialFile(id,String(v.size),v.data,'image/webp')));
  const m:EditorialMedia={path:editorialPath(id),alt:'Review the image description',caption:'Design visualization',products:[],focalX:50,focalY:50,provenance:'Owner-supplied Drive image; review required.',editorial:{id,driveId,filename,sha256:processed.sha256,bytes:processed.bytes,width:processed.width,height:processed.height,format:processed.format,derivatives:processed.variants.map(({width,height,bytes,sha256})=>({width,height,bytes,sha256})),classification:'unknown',reviewNote:''}};
  if(!validEditorialMedia(m))throw Error('Processing metadata invalid');
  await sql`WITH created AS (INSERT INTO rivya_public_media(path,draft,version,updated_by) VALUES(${m.path},${JSON.stringify(m)}::jsonb,1,${session.adminId}) RETURNING path), history AS (INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation) SELECT 'media',path,1,${JSON.stringify(m)}::jsonb,${session.adminId},'editorial:processed' FROM created) INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},'editorial:processed',path FROM created`;
  return json({entry:{media:m,version:1,published:null}});
 }catch{return json({error:'Upload was not registered. Your selected source is retained; retry processing. Any partial files remain private and unavailable for selection.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const body=await smallJson(request,12000);if(!isEditorialPath(body?.path)||!Number.isSafeInteger(body.version)||body.version<1||!['draft','review','publish'].includes(body.operation))return json({error:'Choose a saved editorial asset and valid operation.'},400);
  if(body.operation!=='draft'&&session.role!=='admin')return json({error:'Administrator access required to review or publish.'},403);
  const sql=studioDb(),rows=await sql`SELECT draft,version FROM rivya_public_media WHERE path=${body.path}`;
  if(!rows.length||rows[0].version!==body.version)return json({error:'A newer image revision exists. Reload before saving.'},409);
  const old=rows[0].draft;if(!validEditorialMedia(old))return json({error:'Asset unavailable.'},400);
  let m:EditorialMedia=structuredClone(old);
  if(body.operation!=='publish'){
   m={...m,alt:body.alt,caption:body.caption,provenance:body.provenance,editorial:{...m.editorial,classification:body.classification,reviewNote:body.reviewNote}};
   delete m.editorial.reviewedBy;delete m.editorial.reviewedAt;
   if(body.operation==='review'){m.editorial.reviewedBy=session.adminId;m.editorial.reviewedAt=new Date().toISOString();}
  }
  if(!validEditorialMedia(m)||(body.operation!=='draft'&&!validPublishedEditorialMedia(m)))return json({error:'Complete the description, provenance, classification and a review note of at least 20 characters.'},400);
  const publish=body.operation==='publish';
  const changed=await sql`WITH changed AS (UPDATE rivya_public_media SET draft=${JSON.stringify(m)}::jsonb,published=CASE WHEN ${publish} THEN ${JSON.stringify(m)}::jsonb ELSE published END,version=version+1,updated_by=${session.adminId},updated_at=now() WHERE path=${m.path} AND version=${body.version} RETURNING path), history AS (INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation) SELECT 'media',path,${body.version+1},${JSON.stringify(m)}::jsonb,${session.adminId},${'editorial:'+body.operation} FROM changed), logged AS (INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},${'editorial:'+body.operation},path FROM changed) SELECT * FROM changed`;
  if(!changed.length)return json({error:'A newer image revision exists. Your edits remain here.'},409);
  if(publish)revalidatePath('/','layout');return json({saved:true,version:body.version+1});
 }catch{return json({error:'The image change was not saved. Your edits remain here.'},503);}
}
