import type {ContentDocument} from './content-model';
import type {EditorialUsage} from './homepage-model';
import {validUsage} from './homepage-model';
import {sharedCopyId} from './shared-copy-model';

export type EditorialSlot={key:string;sectionId?:string;label:string;editable:boolean;usage?:EditorialUsage;path?:string;productId?:string;reason?:string};
/** Inventory only slots consumed by the current renderer; do not invent inactive placements. */
export function editorialSlots(document:ContentDocument):EditorialSlot[]{
 if(document.id===sharedCopyId)return [];
 if(document.homepage)return [
  {key:'hero',label:'Hero · existing product image',editable:false,productId:document.homepage.heroProductId,reason:'The hero follows the selected catalogue piece. Open the page editor to choose a different piece.'},
  ...document.homepage.sections.flatMap<EditorialSlot>(section=>{
   const label=document.sections.find(s=>s.id===section.id)?.heading||section.id;
   if(section.type==='story')return [{key:'home:'+section.id,sectionId:section.id,label,editable:true,usage:section.image,path:section.image?.path}];
   if(section.type==='journeys')return (section.items||[]).map(item=>({key:'journey:'+section.id+':'+item.id,sectionId:section.id,label:label+' · '+item.title,editable:false,productId:item.productId,reason:'This journey follows an existing product reference. Its gallery is protected.'}));
   return [];
  })
 ];
 return [{key:'header',label:'Page header',editable:false,path:document.image,reason:'The header uses the image’s published framing. Open the page editor to choose its image.'},...document.sections.map(section=>({key:'section:'+section.id,sectionId:section.id,label:section.heading,editable:true,usage:section.image,path:section.image?.path}))];
}

/** A cloned page owns its usage. Never update shared media or product records. */
export function assignEditorialSlot(document:ContentDocument,key:string,usage?:EditorialUsage):ContentDocument{
 const slot=editorialSlots(document).find(s=>s.key===key);
 if(!slot?.editable||!slot.sectionId)throw Error('This placement is read-only. Open its owning editor.');
 if(usage&&!validUsage(usage))throw Error('Choose an approved public image with a description and valid crops.');
 const next=structuredClone(document);
 if(key.startsWith('home:'))next.homepage!.sections=next.homepage!.sections.map(s=>s.id===slot.sectionId?{...s,image:usage?structuredClone(usage):undefined}:s);
 else next.sections=next.sections.map(s=>s.id===slot.sectionId?{...s,image:usage?structuredClone(usage):undefined}:s);
 return next;
}

export type UsageOwner={document:ContentDocument;published:ContentDocument|null};
export function editorialUsages(entries:UsageOwner[],path:string){
 return entries.flatMap(entry=>(['draft','published'] as const).flatMap(state=>{
  const d=state==='draft'?entry.document:entry.published;
  return d?editorialSlots(d).filter(slot=>slot.path===path).map(slot=>({record:d.id,title:d.title,route:d.route,slot:slot.key,label:slot.label,state})):[];
 }));
}
