import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {baselineContent,validContent,type ContentDocument} from '@/lib/content-model';
import {originAllowed,smallJson} from '@/lib/request-security';
import {revalidatePath} from 'next/cache';
import {isDeepStrictEqual} from 'node:util';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(){
 try{
  if(!await studioSession())return json({error:'Sign in to continue.'},401);
  const rows=await studioDb()`SELECT content_key,draft,published,version,published_version,visible FROM rivya_content ORDER BY content_key`;
  const byId=new Map(rows.map(r=>[r.content_key,r]));
  const defaults=baselineContent.map(document=>({document,version:0,published:null,visible:false}));
  return json({entries:[...defaults.map(e=>{const r=byId.get(e.document.id);return r?{document:r.draft,version:r.version,published:r.published,visible:r.visible,...(!isDeepStrictEqual(r.draft,JSON.parse(JSON.stringify(e.document)))?{reviewed:e.document}:{})}:e;}),...rows.filter(r=>!baselineContent.some(b=>b.id===r.content_key)).map(r=>({document:r.draft,version:r.version,published:r.published,visible:r.visible}))]});
 }catch{return json({error:'Content is temporarily unavailable.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const body=await smallJson(request,70000);
  if(!body||!['draft','publish','hide'].includes(body.operation)||!Number.isSafeInteger(body.version)||body.version<0)return json({error:'Invalid content change.'},400);
  if(body.operation!=='draft'&&session.role!=='admin')return json({error:'Administrator access is required to publish.'},403);
  const sql=studioDb(),d=body.document as ContentDocument;
  const existing=await sql`SELECT draft FROM rivya_content WHERE content_key=${typeof d?.id==='string'?d.id:''}`;
  const base=baselineContent.find(b=>b.id===d?.id)||existing[0]?.draft;
  if(!validContent(d,base))return json({error:'Check the title, description, sections and approved image. Published page addresses must stay stable.'},400);
  const publish=body.operation==='publish',hide=body.operation==='hide';
  const rows=await sql`WITH created AS(
   INSERT INTO rivya_content(content_key,kind,route,draft,published,version,published_version,visible,updated_by)
   SELECT ${d.id},${d.kind},${d.route},${JSON.stringify(d)}::jsonb,${publish?JSON.stringify(d):null}::jsonb,1,${publish?1:0},${publish},${session.adminId} WHERE ${body.version}=0 ON CONFLICT DO NOTHING RETURNING content_key
  ), changed AS(
   UPDATE rivya_content SET draft=${JSON.stringify(d)}::jsonb,published=CASE WHEN ${publish} THEN ${JSON.stringify(d)}::jsonb ELSE published END,
    version=version+1,published_version=CASE WHEN ${publish} THEN version+1 ELSE published_version END,
    visible=CASE WHEN ${publish} THEN true WHEN ${hide} THEN false ELSE visible END,updated_by=${session.adminId},updated_at=now()
   WHERE content_key=${d.id} AND version=${body.version} AND ${body.version}>0 RETURNING content_key
   ), history AS (
    INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation)
    SELECT 'content',${d.id},${body.version+1},${JSON.stringify(d)}::jsonb,${session.adminId},${body.operation}
    WHERE EXISTS(SELECT 1 FROM created UNION ALL SELECT 1 FROM changed)
   ), previous_revision AS (
    INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation)
    SELECT 'content',content_key,version,draft,updated_by,'previous' FROM rivya_content WHERE content_key=${d.id} AND EXISTS(SELECT 1 FROM changed)
    ON CONFLICT DO NOTHING
   ), logged AS (
   INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},${'content:'+body.operation},content_key FROM(SELECT * FROM created UNION ALL SELECT * FROM changed) c
  ) SELECT * FROM created UNION ALL SELECT * FROM changed`;
  if(!rows.length)return json({error:'This draft or address changed elsewhere. Reload before saving.'},409);
  if(publish||hide){revalidatePath(d.route);revalidatePath('/journal');revalidatePath('/');revalidatePath('/sitemap.xml');}
  return json({saved:true});
 }catch{return json({error:'Content was not saved. Keep your edits and try again.'},503);}
}
