import {createHmac,timingSafeEqual} from 'node:crypto';
import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {originAllowed,smallJson} from '@/lib/request-security';
import {reviewIntake,normalizedTitle} from '@/lib/editorial-intake';
import {capturePage} from '@/lib/homepage-persistence';
import {editorialPublicationIssues} from '@/lib/editorial-record-model';
export const dynamic='force-dynamic';
const json=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
const signature=(actor:string,expires:number,documents:unknown)=>createHmac('sha256',process.env.STUDIO_SESSION_SECRET!).update(JSON.stringify([actor,expires,documents])).digest('hex');
export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);
  const body=await smallJson(request,180000);if(!body||!['dry-run','create'].includes(body.mode)||Object.keys(body).some(k=>!['mode','documents','token','expires'].includes(k)))return json({error:'Choose a draft intake dry run or checked create.'},400);
  const sql=studioDb(),existing=await sql`SELECT content_key AS id,route,draft->>'title' AS title FROM rivya_content WHERE content_key=ANY(${Array.isArray(body.documents)?body.documents.map((d:{id?:string})=>typeof d?.id==='string'?d.id:''):[]}::text[]) OR route=ANY(${Array.isArray(body.documents)?body.documents.map((d:{route?:string})=>typeof d?.route==='string'?d.route:''):[]}::text[]) OR trim(regexp_replace(lower(normalize(draft->>'title',NFKC)),'[^[:alnum:]]+',' ','g'))=ANY(${Array.isArray(body.documents)?body.documents.map((d:{title?:string})=>typeof d?.title==='string'?normalizedTitle(d.title):''):[]}::text[]) LIMIT 31`;
  const review=reviewIntake(body.documents,existing as {id:string;route:string;title:string}[]);if(review.issues.length)return json({error:review.issues.join(' '),issues:review.issues},409);
  if(body.mode==='dry-run'){
   const expires=Date.now()+600000;return json({dryRun:true,expires,token:signature(session.adminId,expires,body.documents),records:review.documents.map(d=>({id:d.id,title:d.title,route:d.route,publicationIssues:editorialPublicationIssues(d)})),note:'Only new unpublished drafts can be created. Source and native-reader review remain separate.'});
  }
  const expected=signature(session.adminId,body.expires,body.documents);if(!Number.isSafeInteger(body.expires)||body.expires<Date.now()||body.expires>Date.now()+600000||typeof body.token!=='string'||body.token.length!==expected.length||!timingSafeEqual(Buffer.from(expected),Buffer.from(body.token)))return json({error:'The checked batch changed or expired. Run the dry run again.'},409);
  const documents=await Promise.all(review.documents.map(async d=>({...d,pageSnapshot:await capturePage(d)})));
  // One statement: collision anywhere rejects the complete batch, never updates an existing row.
  const rows=await sql`WITH candidates AS (SELECT value AS d FROM jsonb_array_elements(${JSON.stringify(documents)}::jsonb)), created AS (
   INSERT INTO rivya_content(content_key,kind,route,draft,version,published_version,visible,updated_by)
   SELECT d->>'id',d->>'kind',d->>'route',d,1,0,false,${session.adminId} FROM candidates
   WHERE NOT EXISTS(SELECT 1 FROM rivya_content r JOIN candidates c ON r.content_key=c.d->>'id' OR r.route=c.d->>'route' OR trim(regexp_replace(lower(normalize(r.draft->>'title',NFKC)),'[^[:alnum:]]+',' ','g'))=trim(regexp_replace(lower(normalize(c.d->>'title',NFKC)),'[^[:alnum:]]+',' ','g'))) RETURNING content_key,draft
  ), history AS (INSERT INTO rivya_revisions(kind,entity_key,version,document,actor,operation) SELECT 'content',content_key,1,draft,${session.adminId},'draft:intake' FROM created), audit AS (INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},'content:intake-draft',content_key FROM created) SELECT content_key AS id FROM created`;
  if(rows.length!==documents.length)return json({error:'A record or address now exists. No existing record was changed; repeat the dry run.'},409);
  return json({created:true,ids:rows.map(r=>r.id),published:0});
 }catch(error){if((error as {code?:string}).code==='23505')return json({error:'A concurrent create used this identity. Repeat the dry run; existing content is unchanged.'},409);return json({error:'Draft intake could not be confirmed. Check the library before retrying.'},503);}
}
