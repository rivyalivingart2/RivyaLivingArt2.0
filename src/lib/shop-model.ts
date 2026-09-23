import reviewedCopy from './reviewed-product-copy.json';
import {products} from './rivya/data';
import {productFields} from './product-form';
import type {CustomField} from './product-form';
export type {CustomField} from './product-form';
export type ShopProduct={
 id:string;slug:string;name:string;subtitle:string;category:string;tier:'large'|'memory'|'personal';
 image:string;imageAlt?:string;imagePosition?:string;imageCaption?:string;scene?:string;sceneAlt?:string;scenePosition?:string;sceneCaption?:string;story:string;dimensions?:string;material?:string;
 gallery?:{src:string;alt:string;position?:string;caption?:string}[];fields:CustomField[];revision:number;
};
export const baselineProducts:ShopProduct[]=products.map(p=>({
 id:p.id,slug:p.slug,...reviewedCopy[p.id as keyof typeof reviewedCopy],tier:p.tier,
 image:p.image,...(p.scene?{scene:p.scene}:{}),revision:2,material:p.material,
 gallery:p.source?.gallery.map(g=>({src:g.src,alt:g.alt.replace(/owner-supplied AI concept visualization|supplied AI concept|AI concept/g,'design visualization')})),
 fields:productFields({...p,...reviewedCopy[p.id as keyof typeof reviewedCopy]})
}));
const permittedImages=new Set(products.flatMap(p=>[p.image,p.scene,...(p.source?.gallery.map(g=>g.src)||[])]).filter(Boolean));
export function validProduct(value:unknown,base?:ShopProduct):value is ShopProduct{
 if(!value||typeof value!=='object')return false;
 const p=value as ShopProduct;
 const text=(v:unknown,max:number)=>typeof v==='string'&&!!v.trim()&&v.length<=max;
 if(base&&(p.id!==base.id||p.slug!==base.slug))return false;
 if(!base&&(!/^RLA-[0-9a-f-]{36}$/.test(p.id)||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)||p.slug.length>100))return false;
 if(!['large','memory','personal'].includes(p.tier)||!text(p.category,80)||!permittedImages.has(p.image)||p.scene&&!permittedImages.has(p.scene)||!text(p.name,100)||!text(p.subtitle,120)||!text(p.story,1800)||/\b(demo|dummy|sample|fictional)\b/i.test(p.name+' '+p.subtitle+' '+p.story))return false;
 if(p.dimensions!==undefined&&!text(p.dimensions,200)||p.material!==undefined&&!text(p.material,300))return false;
 if(p.gallery&&(!Array.isArray(p.gallery)||p.gallery.length>12||p.gallery.some(g=>!permittedImages.has(g.src)||!text(g.alt,180))))return false;
 if(!Array.isArray(p.fields)||p.fields.length<1||p.fields.length>16)return false;
 const preceding=new Map<string,CustomField>();const labels=new Set<string>();
 for(const f of p.fields){
   if(!f||!/^[a-z][a-z0-9_]{0,30}$/.test(f.id)||['constructor','prototype'].includes(f.id)||preceding.has(f.id)||!text(f.label,100)||labels.has(f.label)||!['text','select','number'].includes(f.type)||typeof f.required!=='boolean')return false;
   if(f.type==='select'&&(!Array.isArray(f.options)||!f.options.length||f.options.length>12||new Set(f.options).size!==f.options.length||f.options.some(o=>!text(o,80))))return false;
   if(f.hint!==undefined&&!text(f.hint,400))return false;
   if(f.maxLength!==undefined&&(!Number.isInteger(f.maxLength)||f.maxLength<1||f.maxLength>240))return false;
   if(f.min!==undefined&&(!Number.isInteger(f.min)||f.min<1||f.min>500))return false;
   if(f.max!==undefined&&(!Number.isInteger(f.max)||f.max<(f.min??1)||f.max>500))return false;
   if(f.visibleWhen){const parent=preceding.get(f.visibleWhen.field);if(!parent||parent.type!=='select'||parent.visibleWhen||!parent.options?.includes(f.visibleWhen.value))return false;}
   preceding.set(f.id,f);labels.add(f.label);
 }
 return true;
}
export {whatsappNumber} from './whatsapp';

