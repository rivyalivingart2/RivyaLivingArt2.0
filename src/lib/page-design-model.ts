import type {ContentDocument,ContentSection} from './content-model';
import {isMaterialFilm} from './presentation-media';

export const designPages=[
 {route:'/our-story',label:'Our atelier',chapters:'numbered'},
 {route:'/process',label:'Process',chapters:'timeline'},
 {route:'/materials-care',label:'Materials & care',chapters:'accordion'},
 {route:'/architects',label:'Architects & large format',chapters:'alternating'},
 {route:'/collectible-design',label:'Large-format collection',chapters:'alternating'},
 {route:'/contact',label:'Contact',chapters:'numbered'},
 {route:'/commission',label:'Commission',chapters:'alternating'},
] as const;
export type DesignPageRoute=typeof designPages[number]['route'];
export type ChapterStyle='prose'|'split'|'reverse'|'statement';
export type PageDesign={schemaVersion:1;hero:'split'|'full';chapters:'numbered'|'timeline'|'accordion'|'alternating';styles:Record<string,ChapterStyle>;shared:('process'|'materials')[];bindings?:Record<string,string>;film?:'resin-pour'};
export type PageDesigns=Partial<Record<DesignPageRoute,PageDesign>>;
export type PageDesignSource={route:DesignPageRoute;title:string;sections:Pick<ContentSection,'id'|'heading'|'enabled'|'stage'|'group'>[];materialIds:string[]};
export const makingSlots=['concept','material-selection','wood-preparation','resin-composition','casting','curing','surface-refinement','hand-finishing','quality-inspection','delivery'] as const;
export const materialSlots=['epoxy-resin','teak-river-wood','mineral-pigments','preserved-botanicals'] as const;
export const pageSlotKeys=(route:string):readonly string[]=>route==='/process'?makingSlots:route==='/materials-care'?materialSlots:route==='/our-story'?['maker','craft','studio']:[];
export const isDesignPageRoute=(route:string):route is DesignPageRoute=>designPages.some(p=>p.route===route);
export function defaultPageDesign(route:DesignPageRoute):PageDesign{
 return {schemaVersion:1,hero:route==='/our-story'||route==='/process'?'full':'split',chapters:designPages.find(p=>p.route===route)!.chapters,styles:{},shared:route==='/our-story'?['process','materials']:route==='/process'?['materials']:[]};
}
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const sectionId=(v:unknown):v is string=>typeof v==='string'&&/^[-a-z0-9]{1,80}$/.test(v);
export function validPageDesigns(value:unknown):value is PageDesigns{
 if(!record(value)||Object.keys(value).length>designPages.length)return false;
 return Object.entries(value).every(([route,p])=>{
  if(!isDesignPageRoute(route)||!record(p)||!Object.keys(p).every(k=>['schemaVersion','hero','chapters','styles','shared','bindings','film'].includes(k)))return false;
  if(p.film!==undefined&&(!['/our-story','/process','/materials-care'].includes(route)||!isMaterialFilm(p.film)))return false;
  if(p.schemaVersion!==1||typeof p.hero!=='string'||!['split','full'].includes(p.hero)||typeof p.chapters!=='string'||!['numbered','timeline','accordion','alternating'].includes(p.chapters))return false;
  if(!record(p.styles)||Object.keys(p.styles).length>20||!Object.entries(p.styles).every(([id,v])=>sectionId(id)&&typeof v==='string'&&['prose','split','reverse','statement'].includes(v)))return false;
  if(!Array.isArray(p.shared)||new Set(p.shared).size!==p.shared.length||!p.shared.every(k=>route==='/our-story'?['process','materials'].includes(k):route==='/process'?k==='materials':false))return false;
  return p.bindings===undefined||(record(p.bindings)&&Object.entries(p.bindings).every(([key,id])=>pageSlotKeys(route).includes(key)&&sectionId(id))&&new Set(Object.values(p.bindings)).size===Object.keys(p.bindings).length);
 });
}
export function pageDesignSource(d:ContentDocument):PageDesignSource|null{
 if(!isDesignPageRoute(d.route))return null;
 return {route:d.route,title:d.title,sections:d.sections.map(({id,heading,enabled,stage,group})=>({id,heading,enabled,stage,group})),materialIds:d.sections.filter(s=>s.material).map(s=>s.id)};
}
export function eligibleSlotSections(source:PageDesignSource){
 return source.sections.filter(s=>s.enabled!==false&&(source.route==='/process'?s.stage==='making':source.route==='/materials-care'?source.materialIds.includes(s.id):true));
}
/** Presentation can bind existing published words; it cannot turn customer steps into making claims. */
export function pageDesignIssues(design:PageDesign,source:PageDesignSource){
 const issues:string[]=[],visible=source.sections.filter(s=>s.enabled!==false);
 for(const id of Object.keys(design.styles))if(!visible.some(s=>s.id===id))issues.push('Chapter '+id+' is no longer published.');
 const eligible=eligibleSlotSections(source);
 for(const [slot,id] of Object.entries(design.bindings||{}))if(!eligible.some(s=>s.id===id))issues.push('The '+slot+' binding needs an eligible published chapter.');
 return issues;
}
export const sharedPageRoutes=(design:PageDesign)=>design.shared.map(key=>key==='process'?'/process':'/materials-care');
export function pageDesignSummary(designs:PageDesigns|undefined){return designPages.filter(p=>designs?.[p.route]).map(p=>p.label+' · '+designs![p.route]!.chapters).join('; ')||'Original page layouts';}
