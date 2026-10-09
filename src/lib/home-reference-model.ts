import type {ContentDocument} from './content-model';
import type {HomeDependency,EditorialUsage} from './homepage-model';

/** Source order from OLDWEBSITE page-sections.ts. Data ownership stays current. */
export const referenceHomeSections=[
 {key:'pour',label:'Hero',source:'Current homepage opening',defaultVisible:true},
 {key:'manifesto',label:'Manifesto',source:'Current homepage three-line statement',defaultVisible:true},
 {key:'pieces',label:'Featured pieces',source:'Current selected product IDs, in their existing order',defaultVisible:true},
 {key:'large-format',label:'Large format',source:'Published architects page',defaultVisible:true},
 {key:'material',label:'Material story',source:'Current material chapter',defaultVisible:true},
 {key:'collections',label:'Collections',source:'Current categories and three journeys',defaultVisible:true},
 {key:'furniture',label:'Furniture concepts',source:'Existing selected pieces; always labelled design visualizations',defaultVisible:false},
 {key:'maker',label:'Atelier story',source:'Published story text; no invented person or staff portrait',defaultVisible:true},
 {key:'rooms',label:'Room concepts',source:'Existing selected scene images; always labelled design visualizations',defaultVisible:false},
 {key:'work',label:'Portfolio',source:'Reviewed new Portfolio records',defaultVisible:true},
 {key:'words',label:'Testimonials',source:'Reviewed feedback or explicitly labelled fictional samples',defaultVisible:true},
 {key:'bespoke',label:'Commission band',source:'Published commission page and current inquiry destination',defaultVisible:true},
 {key:'workshops',label:'Workshops',source:'Confirmed current workshop offering',defaultVisible:true},
 {key:'print',label:'Printing',source:'Confirmed current printing offering',defaultVisible:true},
 {key:'process',label:'How it works',source:'Current customer steps, wording and chronology',defaultVisible:true},
 {key:'why',label:'The approach',source:'Published story chapters',defaultVisible:true},
 {key:'journal',label:'Journal',source:'Existing selected article IDs; no automatic replacement',defaultVisible:true},
 {key:'closing',label:'Closing invitation',source:'Current final invitation',defaultVisible:true},
] as const;
export type HomeReferenceKey=typeof referenceHomeSections[number]['key'];
export type HomeComposition={schemaVersion:1;template:'reference';hidden:HomeReferenceKey[]};
export function referenceComposition():HomeComposition{return {schemaVersion:1,template:'reference',hidden:referenceHomeSections.filter(s=>!s.defaultVisible).map(s=>s.key)};}
export function validHomeComposition(value:unknown):value is HomeComposition{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;const c=value as HomeComposition;
 return Object.keys(c).length===3&&c.schemaVersion===1&&c.template==='reference'&&Array.isArray(c.hidden)&&c.hidden.length<18&&new Set(c.hidden).size===c.hidden.length&&c.hidden.every(key=>key!=='pour'&&referenceHomeSections.some(s=>s.key===key));
}
/** Optional adapters are populated only by approved additive records, never old-site defaults. */
export type ReferencePortfolio={id:string;classification:'concept'|'evidenced-project';title:string;description:string;href:string;image?:EditorialUsage};
export type ReferenceFeedback={id:string;classification:'fictional-sample'|'approved-feedback';quote:string;attribution:string;image?:EditorialUsage};
export type ReferenceOffering={title:string;description:string;href:string;confirmationSource:string;image?:EditorialUsage;facts:{label:string;value:string}[]};
export type HomeReferenceSnapshot={schemaVersion:1;pages:{document:ContentDocument;version:number}[];dependencies:HomeDependency[];issues:string[];portfolio?:ReferencePortfolio[];feedback?:ReferenceFeedback[];workshops?:ReferenceOffering;printing?:ReferenceOffering;mediaPaths?:string[]};
export function referenceSectionStates(d:ContentDocument,reference:HomeReferenceSnapshot|undefined,composition:HomeComposition){
 const h=d.homepage!,snapshot=d.homeSnapshot;
 const blocks=h.sections.filter(s=>s.enabled&&!s.contentNeeded);
 const has=(type:string)=>blocks.some(s=>s.type===type),page=(route:string)=>reference?.pages.find(p=>p.document.route===route)?.document;
 return referenceHomeSections.map(section=>{
  let ready=true,reason='',heading:string=section.label;
  const key=section.key;
  if(key==='pour')heading=d.title;
  else if(key==='manifesto')heading=h.strip[0];
  else if(['pieces','material','process','journal','closing'].includes(key)){
   const type=({pieces:'selected',material:'story',process:'steps',journal:'journal',closing:'invitation'} as Record<string,string>)[key];
   const b=blocks.find(b=>b.type===type);ready=!!b;heading=d.sections.find(s=>s.id===b?.id)?.heading||heading;
   if(key==='pieces')ready=!!b?.productIds?.some(id=>snapshot?.products.some(p=>p.id===id));
   if(key==='journal')ready=!!b?.articleIds?.some(id=>snapshot?.articles.some(a=>a.id===id));
   if(!ready)reason='No available current '+type+' chapter or selected published reference.';
  }else if(key==='collections'){ready=has('categories')||has('journeys');heading=d.sections.find(s=>blocks.some(b=>b.id===s.id&&b.type==='categories'))?.heading||heading;}
  else if(key==='furniture'||key==='rooms'){const selected=blocks.find(b=>b.type==='selected')?.productIds||[];ready=!!snapshot?.products.some(p=>selected.includes(p.id)&&(key==='furniture'||!!p.scene));if(!ready)reason='No existing selected '+(key==='rooms'?'scene':'piece')+' image is available.';}
  else if(key==='large-format'||key==='maker'||key==='why'||key==='bespoke'){
   const route=key==='large-format'?'/architects':key==='bespoke'?'/commission':'/our-story',p=page(route);ready=!!p;heading=p?.title||heading;if(!ready)reason='Publish the current '+route+' page before this section can appear.';
  }else if(key==='work'){ready=!!reference?.portfolio?.length;reason=ready?'':'No reviewed Portfolio entries are connected yet.';}
  else if(key==='words'){ready=!!reference?.feedback?.length;reason=ready?'':'No reviewed testimonials or labelled samples are connected yet.';}
  else{const offering=key==='print'?reference?.printing:reference?.workshops;ready=!!offering?.confirmationSource;heading=offering?.title||heading;reason=ready?'':'The current '+(key==='print'?'printing':'workshop')+' offering has not been confirmed.';}
  const enabled=!composition.hidden.includes(key);
  return {...section,heading,ready,enabled,visible:enabled&&ready,reason};
 });
}
