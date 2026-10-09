import {baselineContent,validContent,type ContentDocument} from './content-model';
import {isEditorialId} from './editorial-record-model';
import {isCustomPageId} from './custom-page-identity';
export const normalizedTitle=(s:string)=>s.normalize('NFKC').toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export function reviewIntake(value:unknown,existing:{id:string;route:string;title:string}[]){
 const issues:string[]=[];if(!Array.isArray(value)||value.length<1||value.length>10)return {issues:['Choose 1–10 new draft records.'],documents:[] as ContentDocument[]};
 const ids=new Set<string>(),routes=new Set<string>(),titles=new Set<string>();
 for(const [index,raw] of value.entries()){
  const d=raw as ContentDocument;
  if(!validContent(d)||!(isEditorialId(d.id)||isCustomPageId(d.id)||/^article:[0-9a-f-]{36}$/.test(d.id))||d.pageSnapshot||d.homeSnapshot){issues.push('Record '+(index+1)+': invalid new document or protected snapshot.');continue;}
  if(ids.has(d.id)||existing.some(e=>e.id===d.id)||baselineContent.some(e=>e.id===d.id))issues.push(d.title+': record ID already exists.');
  if(routes.has(d.route)||existing.some(e=>e.route===d.route)||baselineContent.some(e=>e.route===d.route))issues.push(d.title+': public address already exists.');
  const title=normalizedTitle(d.title);if(titles.has(title)||existing.some(e=>normalizedTitle(e.title)===title)||baselineContent.some(e=>normalizedTitle(e.title)===title))issues.push(d.title+': duplicate title; review a distinct proposal.');
  ids.add(d.id);routes.add(d.route);titles.add(title);
 }
 return {issues,documents:issues.length?[]:value as ContentDocument[]};
}
