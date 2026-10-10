import {studioSession} from '@/lib/studio-auth';
import {originAllowed,smallJson} from '@/lib/request-security';
import {studioDb} from '@/lib/studio-db';
import {captureOrder,orderEntry,orderHistory,orderSource,savedOrder} from '@/lib/editorial-order-store';
import {orderKey} from '@/lib/editorial-order';
import {revalidatePath} from 'next/cache';
export const dynamic='force-dynamic';
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(request:Request){try{
 if(!await studioSession())return json({error:'Sign in to continue.'},401);
 const scope=new URL(request.url).searchParams.get('scope')||'archive:journal',source=await orderSource();
 if(!source.scopes.some(s=>s.key===scope))return json({error:'This complete ordering scope is unavailable.'},404);
 const [entry,history]=await Promise.all([orderEntry(scope),orderHistory(scope)]);
 return json({entry,history,scopes:source.scopes,entries:source.entries.map(e=>({id:e.id,title:e.title,eyebrow:e.eyebrow,route:e.route})),complete:true});
 }catch{return json({error:'Ordering is temporarily unavailable. Saved content is unchanged.'},503);}}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const body=await smallJson(request,64000);
  if(!body||Object.keys(body).some(k=>!['scope','version','operation','ids','restoredFrom'].includes(k))||typeof body.scope!=='string'||body.scope.length>400||!Number.isSafeInteger(body.version)||body.version<0||!['draft','publish','restore'].includes(body.operation))return json({error:'Choose a valid complete ordering scope and revision.'},400);
  const publish=body.operation==='publish';if(publish&&session.role!=='admin')return json({error:'Only an administrator may publish ordering.'},403);
  const entry=await orderEntry(body.scope);if(entry.version!==body.version)return json({error:'A newer order exists. Your arrangement is retained. Compare the latest saved revision.'},409);
  const restored=body.operation==='restore'&&Number.isSafeInteger(body.restoredFrom)?await savedOrder(body.scope,body.restoredFrom):null;
  if(body.operation==='restore'&&!restored)return json({error:'Revision unavailable.'},404);
  const document=publish?entry.document:await captureOrder(body.scope,restored?.ids||body.ids);
  if(!document)return json({error:'Use every current record for a complete order, or valid selected records for slots. Save a draft before publishing.'},409);
  const rows=await studioDb()`WITH current_source AS (
   SELECT COALESCE(jsonb_object_agg(kind||':'||key,fingerprint),'{}'::jsonb) AS stamp FROM (
    SELECT 'content' AS kind,content_key AS key,md5(published::text) AS fingerprint FROM rivya_content WHERE visible=true AND published IS NOT NULL
    UNION ALL SELECT 'media',path,md5(published::text) FROM rivya_public_media WHERE published IS NOT NULL
   ) source
  ), created AS (
   INSERT INTO rivya_presentations(presentation_key,draft,version,updated_by)
   SELECT ${orderKey(body.scope)},${JSON.stringify(document)}::jsonb,1,${session.adminId} WHERE ${body.version}=0 AND ${!publish} AND (SELECT stamp FROM current_source)=${JSON.stringify(document.sourceStamp)}::jsonb ON CONFLICT DO NOTHING RETURNING presentation_key,version
  ), changed AS (
   UPDATE rivya_presentations SET draft=${JSON.stringify(document)}::jsonb,version=version+1,updated_at=now(),updated_by=${session.adminId},published=CASE WHEN ${publish} THEN ${JSON.stringify(document)}::jsonb ELSE published END,published_version=CASE WHEN ${publish} THEN version+1 ELSE published_version END
   WHERE presentation_key=${orderKey(body.scope)} AND version=${body.version} AND ${body.version}>0 AND (SELECT stamp FROM current_source)=${JSON.stringify(document.sourceStamp)}::jsonb RETURNING presentation_key,version
  ), history AS (
   INSERT INTO rivya_presentation_revisions(presentation_key,version,document,actor,operation) SELECT presentation_key,version,${JSON.stringify(document)}::jsonb,${session.adminId},${body.operation==='restore'?'restore:'+body.restoredFrom:body.operation} FROM (SELECT * FROM created UNION ALL SELECT * FROM changed) rows
  ) SELECT version FROM created UNION ALL SELECT version FROM changed`;
  if(!rows.length)return json({error:'The scope, publication or order changed. Your arrangement is retained. Reload, compare and save a new preview.'},409);
  if(publish)revalidatePath('/','layout');
  return json({saved:true,entry:{document,version:body.version+1,publishedVersion:publish?body.version+1:entry.publishedVersion}});
 }catch{return json({error:'Save could not be confirmed. Your arrangement remains here. Reload saved history before retrying.'},503);}
}
