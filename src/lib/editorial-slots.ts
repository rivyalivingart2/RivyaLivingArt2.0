import type {ContentDocument} from './content-model';
import type {EditorialUsage} from './homepage-model';
import {validUsage} from './homepage-model';
import {sharedCopyId} from './shared-copy-model';

export type EditorialSlot={key:string;sectionId?:string;itemId?:string;label:string;editable:boolean;usage?:EditorialUsage;path?:string;productId?:string;reason?:string};
/** Inventory only slots consumed by the current renderer; do not invent inactive placements. */
export function editorialSlots(document:ContentDocument):EditorialSlot[]{
 if(document.id===sharedCopyId)return [];
 if(document.homepage)return [
  {key:'hero',label:'Homepage hero',editable:true,usage:document.homepage.heroImage,path:document.homepage.heroImage?.path,productId:document.homepage.heroProductId},
  ...document.homepage.sections.flatMap<EditorialSlot>(section=>{
   const label=document.sections.find(s=>s.id===section.id)?.heading||section.id;
   const slots:EditorialSlot[]=section.type==='story'?[{key:'home:'+section.id,sectionId:section.id,label,editable:true,usage:section.image,path:section.image?.path}]:[];
   const copy=document.sections.find(s=>s.id===section.id);
   if(copy?.image)slots.push({key:'section:'+section.id,sectionId:section.id,label:label+' · copy illustration',editable:true,usage:copy.image,path:copy.image.path});
   if(section.type==='journeys')slots.push(...(section.items||[]).map(item=>({key:'journey:'+section.id+':'+item.id,sectionId:section.id,itemId:item.id,label:label+' · '+item.title,editable:true,usage:item.image,path:item.image?.path,productId:item.productId})));
   return slots;
  })
 ];
 return [{key:'header',label:'Page header',editable:true,usage:document.headerImage,path:document.headerImage?.path||document.image},...document.sections.map(section=>({key:'section:'+section.id,sectionId:section.id,label:section.heading,editable:true,usage:section.image,path:section.image?.path}))];
}

/** A cloned page owns its usage. Never update shared media or product records. */
export function assignEditorialSlot(document:ContentDocument,key:string,usage?:EditorialUsage):ContentDocument{
 const slot=editorialSlots(document).find(s=>s.key===key);
 if(!slot?.editable)throw Error('This placement is unavailable. Reload its owning page.');
 if(usage&&!validUsage({...usage,alt:usage.alt===''?'Description needed':usage.alt}))throw Error('Choose an approved public image with a description and valid crops.');
 const next=structuredClone(document);
 if(key==='hero')next.homepage!.heroImage=usage?structuredClone(usage):undefined;
 else if(key==='header')next.headerImage=usage?structuredClone(usage):undefined;
 else if(key.startsWith('journey:'))next.homepage!.sections=next.homepage!.sections.map(s=>s.id===slot.sectionId?{...s,items:s.items?.map(i=>i.id===slot.itemId?{...i,image:usage?structuredClone(usage):undefined}:i)}:s);
 else if(key.startsWith('home:'))next.homepage!.sections=next.homepage!.sections.map(s=>s.id===slot.sectionId?{...s,image:usage?structuredClone(usage):undefined}:s);
 else next.sections=next.sections.map(s=>s.id===slot.sectionId?{...s,image:usage?structuredClone(usage):undefined}:s);
 return next;
}

export type UsageOwner={document:ContentDocument;published:ContentDocument|null};
export function editorialUsages(entries:UsageOwner[],path:string){
 return entries.flatMap(entry=>(['draft','published'] as const).flatMap(state=>{
  const d=state==='draft'?entry.document:entry.published;
  if(!d)return [];
  const direct=editorialSlots(d).filter(slot=>slot.path===path).map(slot=>({record:d.id,title:d.title,route:d.route,slot:slot.key,label:slot.label,state}));
  // A saved preview may also reference the image through a product, article card or fallback.
  if(!direct.length&&(d.homeSnapshot||d.pageSnapshot)?.mediaPaths.includes(path))direct.push({record:d.id,title:d.title,route:d.route,slot:'references',label:'Saved product / article reference',state});
  return direct;
 }));
}
