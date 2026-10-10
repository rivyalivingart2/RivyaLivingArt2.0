import 'server-only';
import {cache} from 'react';
import {publishedSource} from './published-source';
import {baselineContent,validContent,type ContentDocument} from './content-model';
import {publicEntry,type LandingEntry} from './landing-dependencies';
import {editorialPublicationIssues} from './editorial-record-model';
import {orderScopes,orderKey,groupId,validOrderIds,type EditorialOrder} from './editorial-order';
import {studioDb} from './studio-db';
export async function orderSource(){
 const source=await publishedSource();
 const docs=source.content.filter(r=>validContent(r.document,baselineContent.find(d=>d.id===r.key))&&!editorialPublicationIssues(r.document as ContentDocument).length).map(r=>r.document as ContentDocument);
 const entries:LandingEntry[]=docs.filter(d=>d.kind==='article'||d.editorial).map(d=>{
  const media=source.media.find(r=>r.key===d.image)?.document as {focalX:number;focalY:number}|undefined;
  const entry=publicEntry({...d,...(media?{imagePosition:media.focalX+'% '+media.focalY+'%'}:{})});
  if(entry.image&&!source.media.some(m=>m.key===entry.image?.path))delete entry.image;
  return entry;
 });
 // Match the existing Journal's ID order and retain existing FAQ section identities.
 entries.sort((a,b)=>a.id.localeCompare(b.id,'en'));
 const faq=docs.find(d=>d.id==='page:faq');
 entries.unshift(...(faq?.sections.filter(s=>s.enabled!==false).map(s=>({id:'page:faq#'+s.id,route:'/faq#'+s.id,title:s.heading,description:'',eyebrow:s.group||'Useful questions',sections:[{id:s.id,heading:s.heading,paragraphs:s.paragraphs,body:s.body,checklist:s.checklist,policyHref:s.policyHref}]}))||[]));
 const scopes=orderScopes(entries,docs.find(d=>d.route==='/journal')?.featuredArticleIds);
 const sourceStamp=Object.fromEntries([...source.content.map(r=>['content:'+r.key,r.fingerprint]),...source.media.map(r=>['media:'+r.key,r.fingerprint])]);
 return {entries,scopes,sourceStamp};
}
export async function captureOrder(key:string,ids:string[]):Promise<EditorialOrder|null>{
 const source=await orderSource(),scope=source.scopes.find(s=>s.key===key);if(!scope||!validOrderIds(ids,scope))return null;
 const entries=key==='faq:groups'?scope.candidates.map(id=>({id,route:'/faq',title:decodeURIComponent(id.slice('faq-group:'.length)),description:'',eyebrow:'Question group',sections:[]})):source.entries.filter(e=>scope.candidates.includes(e.id));
 return {schemaVersion:1,scope,ids,entries,sourceStamp:source.sourceStamp};
}
export async function orderEntry(scope:string){
 const rows=await studioDb()`SELECT draft,version,published_version FROM rivya_presentations WHERE presentation_key=${orderKey(scope)}`;
 return rows[0]?{document:rows[0].draft as EditorialOrder,version:Number(rows[0].version),publishedVersion:Number(rows[0].published_version)}:{document:null,version:0,publishedVersion:0};
}
export async function orderHistory(scope:string){return studioDb()`SELECT version,operation,created_at AS "createdAt" FROM rivya_presentation_revisions WHERE presentation_key=${orderKey(scope)} ORDER BY version DESC LIMIT 30`;}
export async function savedOrder(scope:string,version:number):Promise<EditorialOrder|null>{const rows=await studioDb()`SELECT document FROM rivya_presentation_revisions WHERE presentation_key=${orderKey(scope)} AND version=${version}`;return rows[0]?.document||null;}
export const publishedOrders=cache(async():Promise<Record<string,string[]>>=>{
 try{const rows=await studioDb()`SELECT published FROM rivya_presentations WHERE presentation_key LIKE 'editorial-order:%' AND published IS NOT NULL`;return Object.fromEntries(rows.map(r=>[r.published.scope.key,r.published.ids]));}
 catch(e){if((e as {code?:string}).code==='42P01')return {};throw e;}
});
export function orderedFaqSections<T extends {id:string;group?:string}>(sections:T[],orders:Record<string,string[]>){
 const groups=[...new Set(sections.map(s=>s.group||'Useful questions'))];
 const ranked=(ids:string[]|undefined,id:string,fallback:number)=>ids?.includes(id)?ids.indexOf(id):100000+fallback;
 groups.sort((a,b)=>ranked(orders['faq:groups'],groupId(a),0)-ranked(orders['faq:groups'],groupId(b),0));
 return sections.map((s,index)=>({s,index})).sort((a,b)=>{
  const ga=a.s.group||'Useful questions',gb=b.s.group||'Useful questions';
  if(ga!==gb)return groups.indexOf(ga)-groups.indexOf(gb);
  const ids=orders['category:faq:'+encodeURIComponent(ga)]||orders['archive:faq'];
  return ranked(ids,a.s.id.startsWith('editorial-')?'editorial:'+a.s.id.slice(10):'page:faq#'+a.s.id,a.index)-ranked(ids,b.s.id.startsWith('editorial-')?'editorial:'+b.s.id.slice(10):'page:faq#'+b.s.id,b.index);
 }).map(v=>v.s);
}
