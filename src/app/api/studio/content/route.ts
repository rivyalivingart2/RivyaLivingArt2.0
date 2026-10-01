import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {baselineContent,validContent,type ContentDocument} from '@/lib/content-model';
import {originAllowed,smallJson} from '@/lib/request-security';
import {revalidatePath} from 'next/cache';
import {isDeepStrictEqual} from 'node:util';
import {captureHomepage,capturePage} from '@/lib/homepage-persistence';
import {homeId,type HomeDependency} from '@/lib/homepage-model';
import {editorialDocument} from '@/lib/page-dependencies';
import {sharedCopyId} from '@/lib/shared-copy-model';
import {publishedBusiness} from '@/lib/business-settings';
import {bindImprintContacts} from '@/lib/imprint-content';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});
const editorialComparable=editorialDocument;
const englishComparable=(document:ContentDocument)=>{const english=editorialComparable(document);delete english.translations;return english;};
export async function GET(){
 try{
  if(!await studioSession())return json({error:'Sign in to continue.'},401);
  const rows=await studioDb()`SELECT content_key,draft,published,version,published_version,visible FROM rivya_content ORDER BY content_key`;
  const byId=new Map(rows.map(r=>[r.content_key,r]));
  const defaults=baselineContent.map(document=>({document,version:0,publishedVersion:0,published:null,visible:false}));
  return json({entries:[...defaults.map(e=>{const r=byId.get(e.document.id);return r?{document:r.draft,version:r.version,publishedVersion:r.published_version,published:r.published,visible:r.visible,...(e.document.id!==homeId&&!isDeepStrictEqual(englishComparable(r.draft),englishComparable(JSON.parse(JSON.stringify(e.document))))?{reviewed:e.document}:{})}:e;}),...rows.filter(r=>!baselineContent.some(b=>b.id===r.content_key)).map(r=>({document:r.draft,version:r.version,publishedVersion:r.published_version,published:r.published,visible:r.visible}))]});
 }catch{return json({error:'Content is temporarily unavailable.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const body=await smallJson(request,180000);
  if(!body||!['draft','publish','hide'].includes(body.operation)||!Number.isSafeInteger(body.version)||body.version<0)return json({error:'Invalid content change.'},400);
  if(body.operation!=='draft'&&session.role!=='admin')return json({error:'Administrator access is required to publish.'},403);
  const sql=studioDb();let d=body.document as ContentDocument;
  const existing=await sql`SELECT draft,version,published_version FROM rivya_content WHERE content_key=${typeof d?.id==='string'?d.id:''}`;
  const base=baselineContent.find(b=>b.id===d?.id)||existing[0]?.draft;
  if(!validContent(d,base))return json({error:'Check the title, description, sections and approved image. Published page addresses must stay stable.'},400);
  if(d.id==='page:imprint'){
   d=bindImprintContacts(d,(await publishedBusiness()).details);
   if(!validContent(d,base))return json({error:'Leave room for the required business contact section.'},400);
  }
  const publish=body.operation==='publish',hide=body.operation==='hide';
  if(body.restoredFrom!==undefined){
   if(body.operation!=='draft'||!Number.isSafeInteger(body.restoredFrom)||body.restoredFrom<1||body.restoredFrom>body.version)return json({error:'Choose a saved revision to restore.'},400);
   const revision=await sql`SELECT version FROM rivya_revisions WHERE kind='content' AND entity_key=${d.id} AND version=${body.restoredFrom}`;
   if(!revision.length)return json({error:'The selected recovery revision is unavailable.'},400);
  }
  let dependencies:HomeDependency[]=[];
  if(publish||hide){
   if(!existing[0]||Number(existing[0].version)!==body.version||!isDeepStrictEqual(editorialComparable(d),editorialComparable(existing[0].draft)))return json({error:'Save this draft and preview its exact revision before publishing or hiding.'},409);
   d=existing[0].draft;
   if(publish){
    const snapshot=d.id===homeId?d.homeSnapshot:d.pageSnapshot;
    if(!snapshot)return json({error:'Save this page again to capture its published references.'},409);
    if(snapshot.issues.length)return json({error:snapshot.issues.join(' '),issues:snapshot.issues},400);
    dependencies=snapshot.dependencies;
   }
  }else d={...editorialComparable(d),...(d.id===homeId?{homeSnapshot:await captureHomepage(d)}:{pageSnapshot:await capturePage(d)})};
  // Recheck saved dependencies in the same statement that writes publication and history.
  const rows=await sql`WITH dependency_check AS (
   SELECT NOT EXISTS(SELECT 1 FROM jsonb_array_elements(${JSON.stringify(dependencies)}::jsonb) dep WHERE NOT EXISTS (
    SELECT 1 FROM (
     SELECT 'product' AS kind,product_id AS key,md5(published::text) AS fingerprint FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL
     UNION ALL SELECT 'content',content_key,md5(published::text) FROM rivya_content WHERE visible=true AND published IS NOT NULL
     UNION ALL SELECT 'media',path,md5(published::text) FROM rivya_public_media WHERE published IS NOT NULL
    ) current_ref WHERE current_ref.kind=dep->>'kind' AND current_ref.key=dep->>'key' AND current_ref.fingerprint=dep->>'fingerprint'
   )) AS valid
  ), created AS(
   INSERT INTO rivya_content(content_key,kind,route,draft,published,version,published_version,visible,updated_by)
   SELECT ${d.id},${d.kind},${d.route},${JSON.stringify(d)}::jsonb,${publish?JSON.stringify(d):null}::jsonb,1,${publish?1:0},${publish},${session.adminId} WHERE ${body.version}=0 AND (SELECT valid FROM dependency_check) ON CONFLICT DO NOTHING RETURNING content_key
  ), changed AS(
   UPDATE rivya_content SET draft=${JSON.stringify(d)}::jsonb,published=CASE WHEN ${publish} THEN ${JSON.stringify(d)}::jsonb ELSE published END,
    version=version+1,published_version=CASE WHEN ${publish} THEN version+1 ELSE published_version END,
    visible=CASE WHEN ${publish} THEN true WHEN ${hide} THEN false ELSE visible END,updated_by=${session.adminId},updated_at=now()
   WHERE content_key=${d.id} AND version=${body.version} AND ${body.version}>0 AND (SELECT valid FROM dependency_check) RETURNING content_key
   ), history AS (
    INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation)
    SELECT 'content',${d.id},${body.version+1},${JSON.stringify(d)}::jsonb,${session.adminId},${body.operation==='draft'&&Number.isSafeInteger(body.restoredFrom)?'draft:restore:'+body.restoredFrom:body.operation}
    WHERE EXISTS(SELECT 1 FROM created UNION ALL SELECT 1 FROM changed)
   ), previous_revision AS (
    INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation)
    SELECT 'content',content_key,version,draft,updated_by,'previous' FROM rivya_content WHERE content_key=${d.id} AND EXISTS(SELECT 1 FROM changed)
    ON CONFLICT DO NOTHING
   ), logged AS (
   INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},${'content:'+body.operation},content_key FROM(SELECT * FROM created UNION ALL SELECT * FROM changed) c
  ) SELECT * FROM created UNION ALL SELECT * FROM changed`;
  if(!rows.length)return json({error:'A newer record or changed published reference exists. Keep your edits, compare the latest version, then save and preview again.'},409);
  let refreshPending=false;
  if(publish||hide){try{if(d.id===sharedCopyId)revalidatePath('/','layout');else revalidatePath(d.route);revalidatePath('/journal');revalidatePath('/');revalidatePath('/sitemap.xml');}catch{refreshPending=true;}}
  return json({saved:true,version:body.version+1,publishedVersion:publish?body.version+1:Number(existing[0]?.published_version||0),document:d,issues:(d.homeSnapshot||d.pageSnapshot)?.issues||[],refreshPending});
 }catch{return json({error:'Content was not saved. Keep your edits and try again.'},503);}
}
