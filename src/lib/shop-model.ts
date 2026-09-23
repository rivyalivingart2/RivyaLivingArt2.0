import reviewedCopy from './reviewed-product-copy.json';
import {products} from './rivya/data';
import {fieldSchemaIssues} from './field-schema';
import {productFields,productSchemaRevision} from './product-form';
import type {CustomField} from './product-form';
export type {CustomField} from './product-form';
export type ShopProduct={
 id:string;slug:string;name:string;subtitle:string;category:string;tier:'large'|'memory'|'personal';
 image:string;imageAlt?:string;imagePosition?:string;imageCaption?:string;scene?:string;sceneAlt?:string;scenePosition?:string;sceneCaption?:string;story:string;dimensions?:string;material?:string;
 gallery?:{src:string;alt:string;position?:string;caption?:string}[];fields:CustomField[];revision:number;
};
export const baselineProducts:ShopProduct[]=products.map(p=>({
 id:p.id,slug:p.slug,...reviewedCopy[p.id as keyof typeof reviewedCopy],tier:p.tier,
 image:p.image,...(p.scene?{scene:p.scene}:{}),revision:productSchemaRevision,material:p.material,
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
 if(fieldSchemaIssues(p.fields).length)return false;
 return true;
}
export {whatsappNumber} from './whatsapp';

