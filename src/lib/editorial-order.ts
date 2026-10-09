import type {LandingEntry} from './landing-dependencies';
export type OrderScope={key:string;label:string;mode:'permutation'|'selection';defaults:string[];candidates:string[];limit:number};
export type EditorialOrder={schemaVersion:1;scope:OrderScope;ids:string[];entries:LandingEntry[];sourceStamp:Record<string,string>};
export const orderKey=(scope:string)=>'editorial-order:'+scope;
export function validOrderIds(ids:unknown,scope:OrderScope):ids is string[]{
 return Array.isArray(ids)&&ids.length<=scope.limit&&new Set(ids).size===ids.length&&ids.every(id=>typeof id==='string'&&scope.candidates.includes(id))&&(scope.mode==='selection'||ids.length===scope.candidates.length);
}
/** Unknown/new records keep their previous deterministic order; withdrawn IDs disappear. */
export function orderedItems<T extends {id:string}>(items:T[],ids:readonly string[]|undefined):T[]{
 if(!ids)return items;const rank=new Map(ids.map((id,i)=>[id,i]));
 return items.map((item,index)=>({item,index})).sort((a,b)=>(rank.get(a.item.id)??ids.length)-(rank.get(b.item.id)??ids.length)||a.index-b.index).map(v=>v.item);
}
export function selectedItems<T extends {id:string}>(items:T[],ids:readonly string[]|undefined,fallback:T[]=[]){return ids?ids.flatMap(id=>items.filter(item=>item.id===id)):fallback;}
export const groupId=(group:string)=>'faq-group:'+encodeURIComponent(group);
export const editorialArea=(entry:LandingEntry)=>entry.route.startsWith('/journal/')?'journal':entry.editorial?.kind==='testimonial'?'testimonials':entry.editorial?.kind==='portfolio'?'portfolio':entry.route.startsWith('/faq')?'faq':null;
export function orderScopes(entries:LandingEntry[],featured:string[]=[]):OrderScope[]{
 const scopes:OrderScope[]=[];
 const add=(key:string,label:string,items:LandingEntry[],mode:OrderScope['mode']='permutation',defaults=items.map(e=>e.id),limit=items.length)=>scopes.push({key,label,mode,defaults,candidates:items.map(e=>e.id),limit});
 for(const area of ['journal','portfolio','testimonials','faq']){
  const items=entries.filter(e=>editorialArea(e)===area);
  add('archive:'+area,area+' · archive',items);
  for(const category of [...new Set(items.map(e=>e.eyebrow))])add('category:'+area+':'+encodeURIComponent(category),area+' · '+category,items.filter(e=>e.eyebrow===category));
  if(area!=='faq')add('featured:'+area,area+' · featured',items,'selection',area==='journal'?featured.filter(id=>items.some(e=>e.id===id)):[],3);
 }
 const faqs=entries.filter(e=>editorialArea(e)==='faq');
 const groups=[...new Set(faqs.map(e=>e.eyebrow))].map(group=>({id:groupId(group),title:group} as LandingEntry));
 add('faq:groups','FAQ · group order',groups);
 for(const entry of entries.filter(e=>['journal','portfolio'].includes(editorialArea(e)||''))){
  const candidates=entries.filter(e=>e.id!==entry.id&&['journal','portfolio'].includes(editorialArea(e)||''));
  const defaults=entry.route.startsWith('/journal/')?candidates.filter(e=>e.route.startsWith('/journal/')).sort((a,b)=>Number(b.eyebrow===entry.eyebrow)-Number(a.eyebrow===entry.eyebrow)).slice(0,3).map(e=>e.id):[];
  add('related:'+entry.id,'Related · '+entry.title,candidates,'selection',defaults,3);
 }
 add('placement:testimonials:archive','Testimonials · opening placement',entries.filter(e=>editorialArea(e)==='testimonials'),'selection',[],3);
 return scopes;
}
export function moveOrder(ids:string[],id:string,to:number){const from=ids.indexOf(id);if(from<0||to<0||to>=ids.length)return ids;const next=[...ids];next.splice(from,1);next.splice(to,0,id);return next;}
