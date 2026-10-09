import 'server-only';
import {studioDb} from './studio-db';
import {baselineContent,validContent} from './content-model';
import {compileHomepageSnapshot} from './homepage-dependencies';
import {publishedSource} from './published-source';
import {homeId} from './homepage-model';
import {homePresentationId,validHomepageLayout,type HomepageLayout,type PresentationDocument,type PresentationEntry,type PresentationRevision} from './presentation-model';

export function validPresentationDocument(d:PresentationDocument|undefined|null):d is PresentationDocument{
 return !!d&&d.schemaVersion===1&&d.id===homePresentationId&&validHomepageLayout(d.layout)&&d.home?.id===homeId&&validContent(d.home,baselineContent.find(b=>b.id===homeId))&&!!d.home.homeSnapshot?.products&&Array.isArray(d.home.homeSnapshot.issues)&&Array.isArray(d.dependencies)&&Number.isSafeInteger(d.homeVersion)&&d.homeVersion>0;
}
/** Capture one coherent current publication, never a draft or a client snapshot. */
export async function capturePresentation(layout:HomepageLayout):Promise<PresentationDocument>{
 const source=await publishedSource(),row=source.content.find(r=>r.key===homeId),home=row?.document;
 if(!row||!validContent(home,baselineContent.find(b=>b.id===homeId)))throw new Error('Published homepage is unavailable');
 const document=home as PresentationDocument['home'];
 if(!document.homepage)throw new Error('Homepage structure is unavailable');
 const snapshot=compileHomepageSnapshot(document,{...source,content:source.content.filter(r=>r.key!==homeId)});
 return {schemaVersion:1,id:homePresentationId,layout,home:{...document,homeSnapshot:snapshot},homeVersion:row.version,dependencies:[...snapshot.dependencies,{kind:'content',key:homeId,version:row.version,fingerprint:row.fingerprint}]};
}
export async function presentationEntry():Promise<PresentationEntry>{
 const rows=await studioDb()`SELECT draft,version,published_version,published->'layout' AS published_layout FROM rivya_presentations WHERE presentation_key=${homePresentationId}`;
 const r=rows[0];if(!r)return {document:null,version:0,publishedVersion:0,publishedLayout:null};
 if(!validPresentationDocument(r.draft))throw new Error('Unsupported presentation');
 return {document:r.draft,version:Number(r.version),publishedVersion:Number(r.published_version),publishedLayout:validHomepageLayout(r.published_layout)?r.published_layout:null};
}
export async function presentationHistory():Promise<PresentationRevision[]>{
 const rows=await studioDb()`SELECT version,operation,created_at,document->'layout' AS layout FROM rivya_presentation_revisions WHERE presentation_key=${homePresentationId} ORDER BY version DESC LIMIT 30`;
 return rows.map(r=>({version:Number(r.version),operation:r.operation,createdAt:r.created_at,layout:r.layout}));
}
export async function savedPresentation(version:number):Promise<PresentationDocument|null>{
 if(!Number.isSafeInteger(version)||version<1)return null;
 const rows=await studioDb()`SELECT document FROM rivya_presentation_revisions WHERE presentation_key=${homePresentationId} AND version=${version}`;
 const d=rows[0]?.document;return validPresentationDocument(d)?d:null;
}
/** Missing additive tables preserve the old renderer before the explicit migration.
 * Other storage failures propagate; never claim the latest design was read. */
export async function publishedPresentation():Promise<{layout:HomepageLayout;version:number}|null>{
 try{
  const rows=await studioDb()`SELECT published->'layout' AS layout,published_version FROM rivya_presentations WHERE presentation_key=${homePresentationId} AND published IS NOT NULL`;
  if(!rows.length)return null;
  if(!validHomepageLayout(rows[0].layout))throw new Error('Unsupported published layout');
  return {layout:rows[0].layout,version:Number(rows[0].published_version)};
 }catch(error){if((error as {code?:string}).code==='42P01')return null;throw error;}
}
