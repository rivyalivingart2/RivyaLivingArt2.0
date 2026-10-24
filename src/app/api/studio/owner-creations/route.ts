import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {smallJson,originAllowed} from '@/lib/request-security';
import {ownerCreations} from '@/lib/owner-creations';
import {localCreationAccess,localCreationRequest} from '@/lib/owner-creation-model';
import {selectedCreationDraft,saveSelectedCreation} from '@/lib/selected-creation-draft';
import {validEditorialMedia} from '@/lib/editorial-media-model';
export const dynamic='force-dynamic';
export const runtime='nodejs';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Robots-Tag':'noindex, nofollow'}});
const local=(request:Request)=>localCreationAccess()&&localCreationRequest(request.headers);
export async function GET(request:Request){
 if(!local(request))return json({error:'Not available.'},404);
 try{if(!await studioSession())return json({error:'Sign in to continue.'},401);return json({images:(await ownerCreations()).images});}
 catch{return json({error:'Your selected image collection could not load. Retry.'},503);}
}
export async function POST(request:Request){
 if(!local(request))return json({error:'Not available.'},404);
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  let body;try{body=await smallJson(request,500);}catch{return json({error:'Choose an image from the selected collection.'},400);}
  if(!body||Object.keys(body).length!==1||!Number.isSafeInteger(body.index)||body.index<1||body.index>169)return json({error:'Choose an image from the selected collection.'},400);
  const draft=await selectedCreationDraft(body.index),m=draft.media,sql=studioDb();
  const existing=await sql`SELECT path,draft FROM rivya_public_media WHERE path LIKE '/editorial/%' AND draft->'editorial'->>'sha256'=${m.editorial.sha256} ORDER BY updated_at LIMIT 1`;
  if(existing.length){if(!validEditorialMedia(existing[0].draft))throw Error('Invalid existing metadata');return json({path:existing[0].path,reused:true});}
  await saveSelectedCreation(draft);
  const created=await sql`WITH created AS (
   INSERT INTO rivya_public_media(path,draft,version,updated_by) VALUES(${m.path},${JSON.stringify(m)}::jsonb,1,${session.adminId}) ON CONFLICT(path) DO NOTHING RETURNING path
  ), history AS (
   INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation) SELECT 'media',path,1,${JSON.stringify(m)}::jsonb,${session.adminId},'editorial:owner-selected' FROM created
  ), logged AS (INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},'editorial:owner-selected',path FROM created) SELECT path FROM created`;
  if(!created.length){const saved=await sql`SELECT draft FROM rivya_public_media WHERE path=${m.path}`;if(!validEditorialMedia(saved[0]?.draft)||saved[0].draft.editorial.sha256!==m.editorial.sha256)throw Error('Different image already registered');}
  return json({path:m.path,reused:!created.length});
 }catch{return json({error:'The selected image could not be prepared. Its source files are retained. Retry; an existing draft will be reused.'},503);}
}
