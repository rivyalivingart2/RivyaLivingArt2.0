import {validUsage,validHomeHref,type EditorialUsage,type HomeAction} from './homepage-model';
import {validEditorialBody,bodyParagraphs,type EditorialBody} from './editorial-body';
export const landingTypes=['hero','richText','productGrid','imageCta','faqPicker','finalCta','collectionGrid','portfolioGrid','journalGrid','testimonial','testimonialGrid','videoHero','videoStory','masonryGallery','bentoGallery','fullscreenGallery'] as const;
export type LandingType=typeof landingTypes[number];
export type LandingBlock={id:string;type:LandingType;enabled:boolean;heading:string;eyebrow?:string;whatsapp?:boolean;variant?:'editorial'|'featured';paragraphs:string[];body?:EditorialBody;image?:EditorialUsage;gallery?:EditorialUsage[];action?:HomeAction;side?:'start'|'end';ids?:string[];mode?:'manual'|'category'|'recent'|'featured';category?:string;limit?:number;film?:'resin-pour'};
export type LandingDocument={schemaVersion:1;blocks:LandingBlock[]};
export const landingLimit=(type:LandingType)=>type==='testimonial'?1:['productGrid','faqPicker','masonryGallery','fullscreenGallery'].includes(type)?12:6;
const text=(v:unknown,max:number)=>typeof v==='string'&&v.length<=max&&!/[<>]/.test(v);
export function validLanding(value:unknown):value is LandingDocument{
 try{
  const d=value as LandingDocument;if(!d||Object.keys(d).some(k=>!['schemaVersion','blocks'].includes(k))||d.schemaVersion!==1||!Array.isArray(d.blocks)||d.blocks.length<1||d.blocks.length>30)return false;
  if(new Set(d.blocks.map(b=>b.id)).size!==d.blocks.length)return false;
  if(d.blocks.filter(b=>['hero','videoHero'].includes(b.type)).length>1||d.blocks.filter(b=>b.type==='finalCta').length>1)return false;
  return d.blocks.every(b=>{
   if(!b||Object.keys(b).some(k=>!['id','type','enabled','heading','paragraphs','body','image','gallery','action','side','ids','mode','category','limit','film','eyebrow','whatsapp','variant'].includes(k)))return false;
   if(!b||!/^[-a-z0-9]{1,80}$/.test(b.id)||!landingTypes.includes(b.type)||typeof b.enabled!=='boolean'||!text(b.heading,150)||!b.heading.trim()||!Array.isArray(b.paragraphs)||b.paragraphs.length>12||b.paragraphs.some(p=>!text(p,2500)))return false;
   if(b.body!==undefined&&(b.type!=='richText'||!validEditorialBody(b.body)||JSON.stringify(bodyParagraphs(b.body))!==JSON.stringify(b.paragraphs)))return false;
   if(b.eyebrow!==undefined&&!text(b.eyebrow,100))return false;
   if(b.whatsapp!==undefined&&(b.type!=='finalCta'||typeof b.whatsapp!=='boolean'))return false;
   if(b.variant!==undefined&&(b.type!=='testimonial'||!['editorial','featured'].includes(b.variant)))return false;
   if(b.image!==undefined&&!validUsage(b.image))return false;
   if(b.gallery!==undefined&&(!['masonryGallery','bentoGallery','fullscreenGallery'].includes(b.type)||!Array.isArray(b.gallery)||b.gallery.length>landingLimit(b.type)||b.gallery.some(i=>!validUsage(i))))return false;
   if(b.action!==undefined&&(!text(b.action.label,80)||!b.action.label.trim()||!validHomeHref(b.action.href)))return false;
   if(b.side!==undefined&&!['start','end'].includes(b.side))return false;
   if(b.ids!==undefined&&(!Array.isArray(b.ids)||b.ids.length>landingLimit(b.type)||new Set(b.ids).size!==b.ids.length||b.ids.some(id=>!text(id,120))))return false;
   if(b.mode!==undefined&&!['manual','category','recent','featured'].includes(b.mode))return false;
   if(b.category!==undefined&&!text(b.category,100))return false;
   if(b.limit!==undefined&&(!Number.isInteger(b.limit)||b.limit<1||b.limit>landingLimit(b.type)))return false;
   if(b.film!==undefined&&(!['videoHero','videoStory'].includes(b.type)||b.film!=='resin-pour'))return false;
   return true;
  })&&JSON.stringify(d).length<=90000;
 }catch{return false;}
}
