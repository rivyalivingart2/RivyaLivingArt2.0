import journal from './reviewed-journal.json';
import {allowedEditorialPath} from './editorial-media-model';
import {shopPages,shopFaqs} from './shop-editorial';
import {isLocale,type Locale} from './site-settings-model';
import {homeCandidate,homeId,validHomepage,type Homepage,type HomeSnapshot} from './homepage-model';
import {validEditorialBody,bodyParagraphs,safeEditorialHref,type EditorialBody} from './editorial-body';
import {validUsage,type EditorialUsage,type HomeAction} from './homepage-model';
import {sharedCopyCandidate,sharedCopyId,validSharedCopy} from './shared-copy-model';
import type {PageSnapshot} from './page-dependencies';
export type ContentSection={id:string;heading:string;paragraphs:string[];checklist?:string[];body?:EditorialBody;enabled?:boolean;group?:string;stage?:'customer'|'making';policyHref?:string;sourceNote?:string;image?:EditorialUsage;action?:HomeAction;material?:{appearance:string;limitations:string;care:string;placement:string}};
export type ContentSectionTranslation={heading?:string;paragraphs?:string[];checklist?:string[]};
export type ContentTranslation={title?:string;eyebrow?:string;description?:string;sections?:Record<string,ContentSectionTranslation>};
export type ContentDocument={
 id:string;kind:'page'|'article';route:string;title:string;eyebrow:string;description:string;
 sections:ContentSection[];headerImage?:EditorialUsage;image?:string;imageAlt?:string;relatedProductIds?:string[];
 translations?:Partial<Record<Locale,ContentTranslation>>;
 homepage?:Homepage;homeSnapshot?:HomeSnapshot;
 pageSnapshot?:PageSnapshot;effectiveDate?:string;
};
export const articleAliases:Record<string,string>={
 'the-space-around-an-object':'a-room-begins-with-a-statement-table',
 'following-the-natural-edge':'reading-the-grain-wood-and-resin-in-a-shared-composition',
 'a-commission-begins-with-a-conversation':'a-guide-to-describing-your-commission'
};
const pageEntries=Object.entries(shopPages).filter(([route])=>!['/care','/materials'].includes(route));
export const baselineContent:ContentDocument[]=[
 homeCandidate,
 sharedCopyCandidate,
 ...pageEntries.map(([route,p])=>({id:'page:'+route.slice(1),kind:'page' as const,route,title:p.title,eyebrow:p.eyebrow,description:p.description||p.sections[0][1],...(p.image?{image:p.image,imageAlt:p.imageAlt}:{}),sections:p.sections.map(([heading,text],i)=>({id:'section-'+(i+1),heading,paragraphs:[text]}))})),
 {id:'page:materials-care',kind:'page',route:'/materials-care',title:'Texture, depth and everyday life.',eyebrow:'Materials & care',description:'Explore timber, resin, colour and care questions for your individual piece.',image:'/media/product-hero-026-4x5.webp',imageAlt:'Timber and resin design visualization',sections:[...shopPages['/materials'].sections,...shopPages['/care'].sections].map(([heading,text],i)=>({id:i===0?'materials':i===3?'care':'section-'+i,heading,paragraphs:[text]}))},
 {id:'page:faq',kind:'page',route:'/faq',title:'Your questions, considered.',eyebrow:'Before we begin',description:'Answers about customization, saving an inquiry, private references and the WhatsApp conversation.',sections:shopFaqs.map(([heading,text],i)=>({id:'question-'+i,heading,paragraphs:[text]}))},
 ...journal.map(a=>({id:a.id,kind:'article' as const,route:'/journal/'+a.slug,title:a.title,eyebrow:a.category,description:a.intro,sections:a.sections,image:a.image,imageAlt:a.imageAlt,relatedProductIds:a.relatedProductIds}))
];
const cleanText=(v:unknown,max:number,required=true)=>typeof v==='string'&&v.length<=max&&(!required||!!v.trim())&&!/[<>]/.test(v);
export function validContent(value:unknown,base?:ContentDocument):value is ContentDocument{try{return checkContent(value,base);}catch{return false;}}
function checkContent(value:unknown,base?:ContentDocument):value is ContentDocument{
 if(!value||typeof value!=='object')return false;
 const d=value as ContentDocument;
 if(!cleanText(d.id,100)||!['page','article'].includes(d.kind)||!cleanText(d.title,120)||!cleanText(d.eyebrow,100)||!cleanText(d.description,300)||!Array.isArray(d.sections)||d.sections.length<1||d.sections.length>(d.id===sharedCopyId?40:20))return false;
 if(base&&(d.id!==base.id||d.route!==base.route||d.kind!==base.kind))return false;
 if(d.id===homeId){if(!validHomepage(d)||!base)return false;}
 else if(d.homepage!==undefined||d.homeSnapshot!==undefined)return false;
 if(!cleanText(d.route,240)||(d.route!=='/'||d.id!==homeId)&&!/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(d.route))return false;
 if(d.kind==='article'&&(!/^\/journal\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.route)||Object.hasOwn(articleAliases,d.route.slice('/journal/'.length))))return false;
 if(!base&&(d.kind!=='article'||!/^article:[0-9a-f-]{36}$/.test(d.id)))return false;
 if(d.id===sharedCopyId&&!validSharedCopy(d))return false;
 if(d.effectiveDate!==undefined&&(!/^\d{4}-\d{2}-\d{2}$/.test(d.effectiveDate)||!Number.isFinite(Date.parse(d.effectiveDate))||new Date(d.effectiveDate).toISOString().slice(0,10)!==d.effectiveDate))return false;
 if(d.image&&!allowedEditorialPath(d.image))return false;
 if(d.headerImage&&!validUsage(d.headerImage))return false;
 if(d.relatedProductIds&&(!Array.isArray(d.relatedProductIds)||d.relatedProductIds.length>6||new Set(d.relatedProductIds).size!==d.relatedProductIds.length||d.relatedProductIds.some(id=>typeof id!=='string'||!/^[-a-zA-Z0-9:]{1,100}$/.test(id))))return false;
 if(d.translations!==undefined){
  if(!d.translations||typeof d.translations!=='object'||Array.isArray(d.translations))return false;
  for(const [locale,value] of Object.entries(d.translations)){
   if(locale==='en'||!isLocale(locale)||!value||typeof value!=='object'||Array.isArray(value))return false;
   const t=value as ContentTranslation;
   for(const [key,max] of [['title',120],['eyebrow',100],['description',300]] as const){const v=t[key];if(v!==undefined&&(typeof v!=='string'||v.length>max||/[<>]/.test(v)))return false;}
   if(t.sections!==undefined){
    if(!t.sections||typeof t.sections!=='object'||Array.isArray(t.sections))return false;
    for(const [id,translated] of Object.entries(t.sections)){
     if(!d.sections.some(section=>section.id===id)||!translated||typeof translated!=='object'||Array.isArray(translated))return false;
     if(translated.heading!==undefined&&(typeof translated.heading!=='string'||translated.heading.length>150||/[<>]/.test(translated.heading)))return false;
     if(translated.paragraphs!==undefined&&(!Array.isArray(translated.paragraphs)||translated.paragraphs.length>12||translated.paragraphs.some(p=>typeof p!=='string'||p.length>2500||/[<>]/.test(p))))return false;
     if(translated.checklist!==undefined&&(!Array.isArray(translated.checklist)||translated.checklist.length>20||translated.checklist.some(p=>typeof p!=='string'||p.length>500||/[<>]/.test(p))))return false;
    }
   }
  }
 }
 if(d.image&&(!cleanText(d.imageAlt,180)||d.image.includes('..')))return false;
 const ids=new Set<string>();let chars=0;
 for(const s of d.sections){
  if(!s||!/^[-a-z0-9]{1,80}$/.test(s.id)||ids.has(s.id)||!cleanText(s.heading,150)||!Array.isArray(s.paragraphs)||s.paragraphs.length>12||s.paragraphs.some(p=>!cleanText(p,2500)))return false;
  if(s.checklist&&(!Array.isArray(s.checklist)||s.checklist.length>20||s.checklist.some(p=>!cleanText(p,500))))return false;
  if(s.body&&(!validEditorialBody(s.body)||JSON.stringify(bodyParagraphs(s.body))!==JSON.stringify(s.paragraphs)))return false;
  if(s.enabled!==undefined&&typeof s.enabled!=='boolean')return false;
  if(s.group!==undefined&&!cleanText(s.group,80,false))return false;
  if(s.sourceNote!==undefined&&!cleanText(s.sourceNote,500,false))return false;
  if(s.stage!==undefined&&!['customer','making'].includes(s.stage))return false;
  if(s.policyHref!==undefined&&!safeEditorialHref(s.policyHref))return false;
  if(s.action&&(!cleanText(s.action.label,80)||!safeEditorialHref(s.action.href)))return false;
  if(s.image&&!validUsage(s.image))return false;
  if(s.material&&(!['appearance','limitations','care','placement'].every(k=>cleanText(s.material![k as keyof typeof s.material],1000,false))||Object.keys(s.material).length!==4))return false;
  if(!s.paragraphs.length&&!s.checklist?.length)return false;
  ids.add(s.id);chars+=s.paragraphs.join('').length+(s.checklist?.join('').length||0);
 }
 return chars<=24000&&!/\b(demo fixture|fictional project|sample content|private design trial)\b/i.test(JSON.stringify(d));
}

export function localizeContent(document:ContentDocument,locale:Locale):ContentDocument{
 if(locale==='en')return document;
 const t=document.translations?.[locale];
 if(!t)return document;
 const text=(value:string|undefined,fallback:string)=>value?.trim()?value:fallback;
 return {...document,
  title:text(t.title,document.title),
  eyebrow:text(t.eyebrow,document.eyebrow),
  description:text(t.description,document.description),
  sections:document.sections.map(section=>{
   const st=t.sections?.[section.id];
   if(!st)return section;
   const paragraphs=Array.isArray(st.paragraphs)&&st.paragraphs.some(p=>p.trim())?st.paragraphs.map((p,i)=>p.trim()?p:section.paragraphs[i]||''):section.paragraphs;
   const checklist=Array.isArray(st.checklist)&&st.checklist.some(p=>p.trim())?st.checklist.map((p,i)=>p.trim()?p:section.checklist?.[i]||''):section.checklist;
   return {...section,heading:text(st.heading,section.heading),paragraphs,...(st.paragraphs?.some(p=>p.trim())?{body:undefined}:{}),...(checklist?{checklist}:{})};
  })
 };
}
