import journal from './reviewed-journal.json';
import {approvedPublicMedia} from './public-media';
import {baselineProducts} from './shop-model';
import {shopPages,shopFaqs} from './shop-editorial';
export type ContentSection={id:string;heading:string;paragraphs:string[];checklist?:string[]};
export type ContentDocument={
 id:string;kind:'page'|'article';route:string;title:string;eyebrow:string;description:string;
 sections:ContentSection[];image?:string;imageAlt?:string;relatedProductIds?:string[];
};
export const articleAliases:Record<string,string>={
 'the-space-around-an-object':'a-room-begins-with-a-statement-table',
 'following-the-natural-edge':'reading-the-grain-wood-and-resin-in-a-shared-composition',
 'a-commission-begins-with-a-conversation':'a-guide-to-describing-your-commission'
};
const pageEntries=Object.entries(shopPages).filter(([route])=>!['/care','/materials'].includes(route));
export const baselineContent:ContentDocument[]=[
 ...pageEntries.map(([route,p])=>({id:'page:'+route.slice(1),kind:'page' as const,route,title:p.title,eyebrow:p.eyebrow,description:p.sections[0][1].slice(0,160),sections:p.sections.map(([heading,text],i)=>({id:'section-'+(i+1),heading,paragraphs:[text]}))})),
 {id:'page:materials-care',kind:'page',route:'/materials-care',title:'Texture, depth and everyday life.',eyebrow:'Materials & care',description:'Explore timber, resin, colour and care questions for your individual piece.',image:'/media/product-hero-026-4x5.webp',imageAlt:'Timber and resin design visualization',sections:[...shopPages['/materials'].sections,...shopPages['/care'].sections].map(([heading,text],i)=>({id:i===0?'materials':i===3?'care':'section-'+i,heading,paragraphs:[text]}))},
 {id:'page:faq',kind:'page',route:'/faq',title:'Your questions, considered.',eyebrow:'Before we begin',description:'Answers about customization, saving an inquiry, private references and the WhatsApp conversation.',sections:shopFaqs.map(([heading,text],i)=>({id:'question-'+i,heading,paragraphs:[text]}))},
 ...journal.map(a=>({id:a.id,kind:'article' as const,route:'/journal/'+a.slug,title:a.title,eyebrow:a.category,description:a.intro,sections:a.sections,image:a.image,imageAlt:a.imageAlt,relatedProductIds:a.relatedProductIds}))
];
const cleanText=(v:unknown,max:number,required=true)=>typeof v==='string'&&v.length<=max&&(!required||!!v.trim())&&!/[<>]/.test(v);
export function validContent(value:unknown,base?:ContentDocument):value is ContentDocument{
 if(!value||typeof value!=='object')return false;
 const d=value as ContentDocument;
 if(!cleanText(d.id,100)||!['page','article'].includes(d.kind)||!cleanText(d.title,120)||!cleanText(d.eyebrow,100)||!cleanText(d.description,300)||!Array.isArray(d.sections)||d.sections.length<1||d.sections.length>20)return false;
 if(base&&(d.id!==base.id||d.route!==base.route||d.kind!==base.kind))return false;
 if(!base&&(d.kind!=='article'||!/^article:[0-9a-f-]{36}$/.test(d.id)||!/^\/journal\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.route)))return false;
 if(d.image&&!approvedPublicMedia.some(m=>m.path===d.image))return false;
 if(d.relatedProductIds&&(!Array.isArray(d.relatedProductIds)||d.relatedProductIds.length>6||new Set(d.relatedProductIds).size!==d.relatedProductIds.length||d.relatedProductIds.some(id=>!baselineProducts.some(p=>p.id===id))))return false;
 if(d.image&&(!cleanText(d.imageAlt,180)||d.image.includes('..')))return false;
 const ids=new Set<string>();let chars=0;
 for(const s of d.sections){
  if(!s||!/^[-a-z0-9]{1,80}$/.test(s.id)||ids.has(s.id)||!cleanText(s.heading,150)||!Array.isArray(s.paragraphs)||s.paragraphs.length>12||s.paragraphs.some(p=>!cleanText(p,2500)))return false;
  if(s.checklist&&(!Array.isArray(s.checklist)||s.checklist.length>20||s.checklist.some(p=>!cleanText(p,500))))return false;
  if(!s.paragraphs.length&&!s.checklist?.length)return false;
  ids.add(s.id);chars+=s.paragraphs.join('').length+(s.checklist?.join('').length||0);
 }
 return chars<=24000&&!/\b(demo fixture|fictional project|sample content|private design trial)\b/i.test(JSON.stringify(d));
}
