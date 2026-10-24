import {randomUUID} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {originAllowed,smallJson} from '@/lib/request-security';
import {validExtension,extensionImagePaths,extensionPublicationIssues,type EditorialExtension,type FileMetadata} from '@/lib/editorial-extension-model';
import {boundedFileBody,inspectEditorialFile} from '@/lib/editorial-file-processing';
import {saveEditorialFile} from '@/lib/editorial-media-storage';
import {validPageMedia} from '@/lib/editorial-media-model';
import {revalidatePath} from 'next/cache';
import {editorialExtensionsEnabled} from '@/lib/editorial-extension-feature';
export const dynamic='force-dynamic';
export const runtime='nodejs';
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
export async function GET(request:Request){
 try{
  if(!await studioSession())return json({error:'Sign in to continue.'},401);
  if(!editorialExtensionsEnabled())return json({available:false,entries:[],categories:[]});
  const sql=studioDb();
  const params=new URL(request.url).searchParams;
  if(params.has('key')){const kind=params.get('kind'),key=params.get('key');if(!['category','video','model'].includes(kind||'')||!key||key.length>180)return json({error:'Invalid history selection.'},400);const revisions=await sql`SELECT version,operation,created_at FROM rivya_editorial_extension_revisions WHERE kind=${kind} AND entity_key=${key} ORDER BY version DESC LIMIT 100`;return json({revisions});}
  const [rows,categories]=await Promise.all([sql`SELECT draft,version,published FROM rivya_editorial_extensions ORDER BY kind,entity_key`,sql`SELECT DISTINCT category FROM (SELECT draft->>'category' AS category FROM rivya_catalogue UNION SELECT published->>'category' FROM rivya_catalogue WHERE published IS NOT NULL) c WHERE category IS NOT NULL ORDER BY category`]);
  return json({available:true,entries:rows.filter(r=>validExtension(r.draft)).map(r=>({document:r.draft,version:r.version,published:r.published})),categories:categories.map(r=>r.category)});
 }catch{return json({error:'Editorial extension storage is unavailable. Existing data is unchanged.'},503);}
}
export async function PUT(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  if(!editorialExtensionsEnabled())return json({error:'Category and file metadata are not enabled for this website.'},503);
  const driveId=request.headers.get('x-drive-file-id')||'',filename=decodeURIComponent(request.headers.get('x-file-name')||'');
  if(!/^[A-Za-z0-9_-]{10,100}$/.test(driveId)||!filename||filename.length>180||/[<>/\\]/.test(filename))return json({error:'Provide the exact source Drive ID and filename.'},400);
  let bytes:Buffer,source:ReturnType<typeof inspectEditorialFile>;
  try{bytes=await boundedFileBody(request);source=inspectEditorialFile(bytes);}catch{return json({error:'Use an MP4, WebM or self-contained GLB up to 40 MB. Nothing has been published.'},400);}
  const sql=studioDb(),existing=await sql`SELECT draft,version,published FROM rivya_editorial_extensions WHERE kind=${source.kind} AND draft->'source'->>'sha256'=${source.sha256} LIMIT 1`;
  if(existing.length)return json({reused:true,entry:{document:existing[0].draft,version:existing[0].version,published:existing[0].published}});
  const key=randomUUID();await saveEditorialFile(key,'original',bytes,source.mime);
  const d:FileMetadata={schemaVersion:1,kind:source.kind,key,title:'Review the media title',description:'',transcript:'',source:{driveId,filename,sha256:source.sha256,bytes:source.bytes,mime:source.mime},classification:'unknown',reviewNote:''};
  await sql`WITH added AS (INSERT INTO rivya_editorial_extensions(kind,entity_key,draft,updated_by) VALUES(${d.kind},${key},${JSON.stringify(d)}::jsonb,${session.adminId}) RETURNING kind,entity_key) INSERT INTO rivya_editorial_extension_revisions(kind,entity_key,version,document,actor,operation) SELECT kind,entity_key,1,${JSON.stringify(d)}::jsonb,${session.adminId},'upload' FROM added`;
  return json({entry:{document:d,version:1,published:null}});
 }catch{return json({error:'The file was not registered. Any partial upload remains private.'},503);}
}
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  if(!editorialExtensionsEnabled())return json({error:'Category and file metadata are not enabled for this website.'},503);
  const body=await smallJson(request,24000);
  if(!body||!['draft','review','publish','hide','restore'].includes(body.operation)||!Number.isSafeInteger(body.version)||body.version<0||!validExtension(body.document))return json({error:'Check the media fields and saved version.'},400);
  if(!['draft','restore'].includes(body.operation)&&session.role!=='admin')return json({error:'Administrator access required.'},403);
  const sql=studioDb();let d:EditorialExtension=body.document;
  const rows=await sql`SELECT draft,version FROM rivya_editorial_extensions WHERE kind=${d.kind} AND entity_key=${d.key}`;
  const old=rows[0];if(Number(old?.version||0)!==body.version)return json({error:'A newer revision exists. Keep your edits and reload.'},409);
  if(body.operation==='restore'){
   if(!Number.isSafeInteger(body.restoredFrom)||body.restoredFrom<1)return json({error:'Choose a saved revision.'},400);
   const history=await sql`SELECT document FROM rivya_editorial_extension_revisions WHERE kind=${d.kind} AND entity_key=${d.key} AND version=${body.restoredFrom}`;
   if(!history[0]||!validExtension(history[0].document))return json({error:'Recovery revision unavailable.'},400);d=history[0].document;
  }
  const publish=body.operation==='publish',hide=body.operation==='hide';
  if(publish||hide){if(!old||!isDeepStrictEqual(old.draft,d))return json({error:'Save and review this exact revision first.'},409);d=old.draft;}
  if(d.kind!=='category'){
   if(!old||!isDeepStrictEqual(old.draft.source,d.source))return json({error:'Original file provenance is immutable. Upload a separate version.'},400);
   if(!publish&&!hide){d={...d,reviewedBy:undefined,reviewedAt:undefined};if(body.operation==='review')d={...d,reviewedBy:session.adminId,reviewedAt:new Date().toISOString()};}
  }
  if(publish){const issues=extensionPublicationIssues(d);if(issues.length)return json({error:issues.join(' ')},400);}
  const paths=hide?[]:extensionImagePaths(d),media=paths.length?await sql`SELECT path,published,md5(published::text) AS fingerprint FROM rivya_public_media WHERE path=ANY(${paths}) AND published IS NOT NULL`:[];
  if(paths.some(path=>!media.some(r=>r.path===path&&validPageMedia(r.published))))return json({error:'Choose currently published poster/category images.'},400);
  const fingerprints=media.map(r=>({path:r.path,fingerprint:r.fingerprint}));
  const result=await sql`WITH allowed AS (SELECT (${hide} OR ${d.kind}<> 'category' OR EXISTS(SELECT 1 FROM rivya_catalogue WHERE draft->>'category'=${d.key} OR published->>'category'=${d.key})) AND NOT EXISTS(SELECT 1 FROM jsonb_array_elements(${JSON.stringify(fingerprints)}::jsonb) dep WHERE NOT EXISTS(SELECT 1 FROM rivya_public_media WHERE path=dep->>'path' AND md5(published::text)=dep->>'fingerprint')) AS valid),
   added AS (INSERT INTO rivya_editorial_extensions(kind,entity_key,draft,updated_by) SELECT ${d.kind},${d.key},${JSON.stringify(d)}::jsonb,${session.adminId} WHERE ${body.version}=0 AND (SELECT valid FROM allowed) ON CONFLICT DO NOTHING RETURNING kind,entity_key),
   changed AS (UPDATE rivya_editorial_extensions SET draft=${JSON.stringify(d)}::jsonb,version=version+1,published=CASE WHEN ${publish} THEN ${JSON.stringify(d)}::jsonb WHEN ${hide} THEN NULL ELSE published END,published_version=CASE WHEN ${publish} THEN version+1 ELSE published_version END,updated_by=${session.adminId},updated_at=now() WHERE kind=${d.kind} AND entity_key=${d.key} AND version=${body.version} AND (SELECT valid FROM allowed) RETURNING kind,entity_key),
   history AS (INSERT INTO rivya_editorial_extension_revisions(kind,entity_key,version,document,actor,operation) SELECT kind,entity_key,${body.version+1},${JSON.stringify(d)}::jsonb,${session.adminId},${body.operation==='restore'?'restore:'+body.restoredFrom:body.operation} FROM (SELECT * FROM added UNION ALL SELECT * FROM changed) c)
   SELECT * FROM added UNION ALL SELECT * FROM changed`;
  if(!result.length)return json({error:'The category, image or revision changed. Reload before saving.'},409);
  if(publish||hide)revalidatePath('/','layout');
  return json({saved:true,version:body.version+1,document:d});
 }catch{return json({error:'The extension was not saved. Your edits remain here.'},503);}
}
