import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {originAllowed,smallJson} from '@/lib/request-security';
import {revalidatePath} from 'next/cache';
import {capturePresentation,presentationEntry,presentationHistory,savedPresentation} from '@/lib/presentation-store';
import {homePresentationId,validPresentationChange} from '@/lib/presentation-model';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(){
 try{
  if(!await studioSession())return json({error:'Sign in to continue.'},401);
  const [entry,history]=await Promise.all([presentationEntry(),presentationHistory()]);
  return json({entry,history});
 }catch{return json({error:'Homepage design is temporarily unavailable. Your saved content is unchanged.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  let body;try{body=await smallJson(request,4000);}catch{return json({error:'Choose a valid design change.'},400);}
  if(!validPresentationChange(body))return json({error:'Choose a valid design change.'},400);
  const publish=body.operation==='publish';
  if(publish&&session.role!=='admin')return json({error:'Administrator access is required to publish.'},403);
  const entry=await presentationEntry();
  if(entry.version!==body.version)return json({error:'A newer design revision exists. Your edits are retained; compare the latest saved version.'},409);
  const restored=body.operation==='restore'?await savedPresentation(body.restoredFrom!):null;
  if(body.operation==='restore'&&!restored)return json({error:'The selected revision is unavailable.'},404);
  const document=publish?entry.document:await capturePresentation(body.operation==='restore'?restored!.layout:body.layout!);
  if(!document)return json({error:'Save and preview a design before publishing.'},409);
  if(publish&&document.home.homeSnapshot!.issues.length)return json({error:'The saved preview has unavailable references. Save again after resolving them.',issues:document.home.homeSnapshot!.issues},409);
  const dependencies=publish?document.dependencies:[];
  // All successful changes and their immutable history share a statement. Publication
  // also checks the captured home/media/product fingerprints in that same snapshot.
  const rows=await studioDb()`WITH dependency_check AS (
   SELECT NOT EXISTS(SELECT 1 FROM jsonb_array_elements(${JSON.stringify(dependencies)}::jsonb) dep WHERE NOT EXISTS (
    SELECT 1 FROM (
     SELECT 'product' AS kind,product_id AS key,md5(published::text) AS fingerprint FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL
     UNION ALL SELECT 'content',content_key,md5(published::text) FROM rivya_content WHERE visible=true AND published IS NOT NULL
     UNION ALL SELECT 'media',path,md5(published::text) FROM rivya_public_media WHERE published IS NOT NULL
    ) ref WHERE ref.kind=dep->>'kind' AND ref.key=dep->>'key' AND ref.fingerprint=dep->>'fingerprint'
   )) AS valid
  ), created AS (
   INSERT INTO rivya_presentations(presentation_key,draft,version,updated_by)
   SELECT ${homePresentationId},${JSON.stringify(document)}::jsonb,1,${session.adminId}
   WHERE ${body.version}=0 AND ${!publish} ON CONFLICT DO NOTHING RETURNING presentation_key,version
  ), changed AS (
   UPDATE rivya_presentations SET draft=${JSON.stringify(document)}::jsonb,version=version+1,
    published=CASE WHEN ${publish} THEN ${JSON.stringify(document)}::jsonb ELSE published END,
    published_version=CASE WHEN ${publish} THEN version+1 ELSE published_version END,
    updated_by=${session.adminId},updated_at=now()
   WHERE presentation_key=${homePresentationId} AND version=${body.version} AND ${body.version}>0 AND (SELECT valid FROM dependency_check)
   RETURNING presentation_key,version
  ), history AS (
   INSERT INTO rivya_presentation_revisions(presentation_key,version,document,actor,operation)
   SELECT presentation_key,version,${JSON.stringify(document)}::jsonb,${session.adminId},${body.operation==='restore'?'restore:'+body.restoredFrom:body.operation}
   FROM (SELECT * FROM created UNION ALL SELECT * FROM changed) saved
  ) SELECT version FROM created UNION ALL SELECT version FROM changed`;
  if(!rows.length)return json({error:'A newer design or changed published reference exists. Compare, save and preview again.'},409);
  let refreshPending=false;if(publish){try{revalidatePath('/');}catch{refreshPending=true;}}
  return json({saved:true,entry:{document,version:body.version+1,publishedVersion:publish?body.version+1:entry.publishedVersion,publishedLayout:publish?document.layout:entry.publishedLayout},refreshPending});
 }catch{return json({error:'Design was not saved. Your edits remain here. Check the saved revision before retrying.'},503);}
}
