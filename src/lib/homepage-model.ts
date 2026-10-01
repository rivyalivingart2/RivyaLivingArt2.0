import type {ContentDocument} from './content-model';
import {baselineProducts, type ShopProduct} from './shop-model';
import {allowedEditorialPath} from './editorial-media-model';

export type HomeAction={label:string;href:string};
export type ImageCrop={x:number;y:number;ratio:'4/5'|'3/2'|'1/1'};
export type EditorialUsage={path:string;alt:string;caption:string;desktop:ImageCrop;mobile:ImageCrop};
export const homeSectionTypes=['selected','categories','story','steps','journeys','journal','invitation'] as const;
export type HomeSectionType=typeof homeSectionTypes[number];
export type HomeSection={id:string;type:HomeSectionType;enabled:boolean;contentNeeded?:boolean;eyebrow:string;action?:HomeAction;productIds?:string[];articleIds?:string[];categories?:string[];image?:EditorialUsage;items?:{id:string;title:string;body:string;productId?:string;image?:EditorialUsage;action?:HomeAction}[]};
export type Homepage={schemaVersion:1;heroProductId:string;heroImage?:EditorialUsage;primary:HomeAction;secondary:HomeAction;annotation:string;strip:string[];sections:HomeSection[]};
export type HomeProduct=Pick<ShopProduct,'id'|'slug'|'name'|'subtitle'|'category'|'tier'|'material'|'image'|'imageAlt'|'imagePosition'|'price'|'scene'|'sceneAlt'|'scenePosition'|'revision'>;
export type HomeArticle=Pick<ContentDocument,'id'|'route'|'title'|'description'|'eyebrow'|'image'|'imageAlt'|'sections'>&{imagePosition?:string};
export type HomeDependency={kind:'product'|'content'|'media';key:string;version:number;fingerprint:string};
/** Server-created, public-only dependencies saved in the same revision as the document. */
export type HomeSnapshot={schemaVersion:1;products:HomeProduct[];articles:HomeArticle[];mediaPaths:string[];categories:{name:string;count:number;tiers:string[]}[];dependencies:HomeDependency[];issues:string[];unavailableActionHrefs?:string[]};
export const homeId='page:home';
export const homeCandidate:ContentDocument={
 id:homeId,kind:'page',route:'/',title:'Art for the way you live.',eyebrow:'RivyaLivingArt / A material-led atelier',description:'Furniture with presence. Objects with meaning. Discover a piece, then make its story your own.',
 sections:[
  {id:'selected',heading:'Objects that hold a room.',paragraphs:['A natural edge. A pool of colour. A silhouette that draws you closer. Begin with a design and explore its place in your space.']},
  {id:'categories',heading:'Find your language.',paragraphs:['Distinct forms. A shared attention to material, proportion and personal meaning.']},
  {id:'material',heading:'The beauty is in the dialogue.',paragraphs:['Wood brings its grain. Resin brings depth, colour and light. Together, they invite a different way of looking at an everyday object.','Your room, your references and your preferences give that conversation direction.']},
  {id:'process',heading:'Considered together. Made personal.',paragraphs:['From an idea to your piece.']},
  {id:'journeys',heading:'A room. A memory. A personal gesture.',paragraphs:['The worlds of Rivya.']},
  {id:'journal',heading:'A closer look.',paragraphs:['Notes on material, proportion and preparing a thoughtful brief.']},
  {id:'invitation',heading:'Let’s make it meaningful.',paragraphs:['A room in mind. A memory to hold. A person to celebrate. Tell us where your piece begins.']}
 ],
 homepage:{schemaVersion:1,heroProductId:baselineProducts.find(p=>p.slug==='river-channel')?.id||'DP001',primary:{label:'Explore the collection',href:'/collectible-design'},secondary:{label:'Our approach',href:'/process'},annotation:'Resin, timber & the personal / Surat, India',strip:['Designed around your brief','Furniture · Memory art · Personal gifts','A conversation, then a creation'],sections:[
  {id:'selected',type:'selected',enabled:true,eyebrow:'01 / Selected forms',productIds:baselineProducts.filter(p=>p.tier==='large').slice(0,3).map(p=>p.id),action:{label:'View all pieces',href:'/collectible-design'}},
  {id:'categories',type:'categories',enabled:true,eyebrow:'02 / Explore by form',categories:[]},
  {id:'material',type:'story',enabled:true,eyebrow:'03 / Material, movement, meaning',action:{label:'Explore the material language',href:'/materials-care#materials'},image:{path:'/media/product-hero-026-4x5.webp',alt:'Timber grain and resin in a sculptural design',caption:'Design visualization',desktop:{x:50,y:50,ratio:'4/5'},mobile:{x:50,y:50,ratio:'1/1'}}},
  {id:'process',type:'steps',enabled:true,eyebrow:'04 / From an idea to your piece',action:{label:'Our process',href:'/process'},items:[
   {id:'find',title:'Find your starting point',body:'Explore furniture, preservation pieces and gifts. Choose a design or begin a custom brief.'},
   {id:'personalize',title:'Make it your own',body:'Share dimensions, colour choices and reference images through the customization form.'},
   {id:'save',title:'Save your brief',body:'Your choices and references are saved for the atelier before your message is prepared.'},
   {id:'send',title:'Begin the conversation',body:'Open or copy the prepared WhatsApp message, then tap Send yourself. The atelier reviews the details with you before an order is agreed.'}]},
  {id:'journeys',type:'journeys',enabled:true,eyebrow:'05 / The worlds of Rivya',items:[
   {id:'large',title:'A presence in your space.',body:'Furniture and sculptural forms, considered around the way you live.',productId:baselineProducts.find(p=>p.tier==='large')!.id,action:{label:'Explore furniture',href:'/collectible-design'}},
   {id:'memory',title:'A moment. A lasting form.',body:'Flowers, keepsakes and the stories they carry. Begin a preservation conversation.',productId:baselineProducts.find(p=>p.tier==='memory')!.id,action:{label:'Explore memory art',href:'/memory-art'}},
   {id:'personal',title:'For someone. Like no one else.',body:'A name, a message, a colour only they would choose. Give a piece personal meaning.',productId:baselineProducts.find(p=>p.tier==='personal')!.id,action:{label:'Explore personal gifts',href:'/personal-art'}}]},
  {id:'journal',type:'journal',enabled:true,eyebrow:'06 / The journal',articleIds:[],action:{label:'All stories',href:'/journal'}},
  {id:'invitation',type:'invitation',enabled:true,eyebrow:'A place for your idea',action:{label:'Begin your piece',href:'/commission'}}
 ]}
};
const text=(v:unknown,max=300,required=true):v is string=>typeof v==='string'&&v.length<=max&&(!required||!!v.trim())&&!/[<>]/.test(v);
export function validHomeHref(v:unknown):v is string{return typeof v==='string'&&/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?)?(?:#[a-z0-9-]+)?$/.test(v)&&v.length<=240;}
const action=(v:HomeAction|undefined)=>!v||(text(v.label,80)&&validHomeHref(v.href));
const ids=(v:unknown,max:number)=>Array.isArray(v)&&v.length<=max&&new Set(v).size===v.length&&v.every(x=>text(x,100));
export function validUsage(v:EditorialUsage){return !!v&&allowedEditorialPath(v.path)&&text(v.alt,180)&&text(v.caption,180,false)&&[v.desktop,v.mobile].every(c=>c&&['4/5','3/2','1/1'].includes(c.ratio)&&[c.x,c.y].every(n=>Number.isFinite(n)&&n>=0&&n<=100));}
export function validHomepage(d:ContentDocument):boolean{
 try{return checkHomepage(d);}catch{return false;}
}
function checkHomepage(d:ContentDocument):boolean{
 const h=d.homepage;if(!h||h.schemaVersion!==1||d.id!==homeId||d.route!=='/'||d.kind!=='page')return false;
 if(!text(h.heroProductId,100)||!h.primary||!h.secondary||!action(h.primary)||!action(h.secondary)||!text(h.annotation,180)||!ids(h.strip,3)||h.strip.length!==3||!Array.isArray(h.sections)||h.sections.length!==d.sections.length)return false;
 if(h.heroImage&&!validUsage(h.heroImage))return false;
 const seen=new Set<string>();
 for(const s of h.sections){
  if(!s||!d.sections.some(b=>b.id===s.id)||seen.has(s.id)||!homeSectionTypes.includes(s.type)||typeof s.enabled!=='boolean'||!text(s.eyebrow,100,false)||!action(s.action))return false;
  seen.add(s.id);
  if(s.contentNeeded!==undefined&&typeof s.contentNeeded!=='boolean')return false;
  if(s.image&&!validUsage(s.image))return false;
  if(s.type==='selected'&&!ids(s.productIds,6))return false;
  if(s.type==='journal'&&!ids(s.articleIds,6))return false;
  if(s.type==='categories'&&!ids(s.categories,80))return false;
  if(s.type==='journeys'||s.type==='steps'){
   if(!Array.isArray(s.items)||s.items.length<(s.type==='journeys'?3:1)||s.items.length>(s.type==='journeys'?3:8)||new Set(s.items.map(x=>x.id)).size!==s.items.length)return false;
   if(s.items.some(i=>!i||!text(i.id,80)||!text(i.title,120)||!text(i.body,1000)||!action(i.action)||(i.image&&!validUsage(i.image))||(s.type==='journeys'&&(!text(i.productId,100)||!i.action))))return false;
  }
 }
 return true;
}
export function homeProductIds(h:Homepage){return [...new Set([...(h.heroImage?[]:[h.heroProductId]),...h.sections.filter(s=>s.enabled).flatMap(s=>[...(s.productIds||[]),...(s.items||[]).flatMap(i=>i.productId&&!i.image?[i.productId]:[])])])];}
export function homeActions(h:Homepage){return [h.primary,h.secondary,...h.sections.filter(s=>s.enabled).flatMap(s=>[...(s.action?[s.action]:[]),...(s.items||[]).flatMap(i=>i.action?[i.action]:[])])];}
export {previewHref} from './content-preview';
