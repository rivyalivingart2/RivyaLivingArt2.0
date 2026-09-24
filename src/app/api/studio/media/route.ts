import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {approvedPublicMedia,validMedia} from '@/lib/public-media';
import {originAllowed,smallJson} from '@/lib/request-security';
import {revalidatePath} from 'next/cache';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(){
 try{if(!await studioSession())return json({error:'Sign in to continue.'},401);
  const rows=await studioDb()`SELECT path,draft,published,version FROM rivya_public_media`;const map=new Map(rows.map(r=>[r.path,r]));
  return json({media:approvedPublicMedia.map(m=>({media:map.get(m.path)?.draft||m,reviewedMedia:m,version:map.get(m.path)?.version||0,published:map.get(m.path)?.published||null}))});
 }catch{return json({error:'The approved media library is unavailable.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);const body=await smallJson(request,8000);
  if(!validMedia(body.media)||!Number.isSafeInteger(body.version)||body.version<0||!['draft','publish'].includes(body.operation))return json({error:'Check the description and crop position.'},400);
  if(body.operation==='publish'&&session.role!=='admin')return json({error:'Administrator access required to publish.'},403);
  const sql=studioDb(),m=body.media,publish=body.operation==='publish';
  const rows=await sql`WITH created AS(
   INSERT INTO rivya_public_media(path,draft,published,version,updated_by) SELECT ${m.path},${JSON.stringify(m)}::jsonb,${publish?JSON.stringify(m):null}::jsonb,1,${session.adminId}
   WHERE ${body.version}=0 ON CONFLICT DO NOTHING RETURNING path
  ), changed AS(
   UPDATE rivya_public_media SET draft=${JSON.stringify(m)}::jsonb,published=CASE WHEN ${publish} THEN ${JSON.stringify(m)}::jsonb ELSE published END,version=version+1,updated_by=${session.adminId},updated_at=now()
   WHERE path=${m.path} AND version=${body.version} AND ${body.version}>0 RETURNING path
   ), history AS (
    INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation)
    SELECT 'media',${m.path},${body.version+1},${JSON.stringify(m)}::jsonb,${session.adminId},${body.operation}
    WHERE EXISTS(SELECT 1 FROM created UNION ALL SELECT 1 FROM changed)
   ), previous_revision AS (
    INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation)
    SELECT 'media',path,version,draft,updated_by,'previous' FROM rivya_public_media WHERE path=${m.path} AND EXISTS(SELECT 1 FROM changed)
    ON CONFLICT DO NOTHING
   ), logged AS (INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},${'media:'+body.operation},path FROM(SELECT * FROM created UNION ALL SELECT * FROM changed) x)
  SELECT * FROM created UNION ALL SELECT * FROM changed`;
  if(!rows.length)return json({error:'This media record changed elsewhere. Reload before saving.'},409);
  if(publish)revalidatePath('/','layout');
  return json({saved:true});
 }catch{return json({error:'The media change was not saved. Your edits remain here.'},503);}
}
