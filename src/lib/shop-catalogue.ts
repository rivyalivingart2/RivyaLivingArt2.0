import 'server-only';
import {cache} from 'react';
import {publishedSource} from './published-source';
import {baselineProducts,localizeProduct,validProduct,type ShopProduct} from './shop-model';
import type {Locale} from './site-settings-model';
import {validPageMedia} from './editorial-media-model';
import type {PublicMedia} from './public-media';

const baseline=new Map(baselineProducts.map(p=>[p.id,p]));
/** Published versions only; fixtures are validation references, never a fallback. */
export const publishedProducts=cache(async(locale:Locale='en'):Promise<ShopProduct[]>=>{
 const source=await publishedSource();
 const rows=source.products.map(row=>({product_id:row.key,published:row.document,published_version:row.version}));
 const byPath=new Map<string,PublicMedia>();
 for(const row of source.media)if(validPageMedia(row.document)&&row.key===row.document.path)byPath.set(row.key,row.document);
 const products:ShopProduct[]=[];
 const slugs=new Set<string>();
 for(const row of rows){
  try{
   const p=row.published as ShopProduct,revision=Number(row.published_version);
   if(!p||p.id!==row.product_id||!validProduct(p,baseline.get(p.id))||!Number.isSafeInteger(revision)||revision<1||slugs.has(p.slug))continue;
   const owned=(path:string)=>{const m=byPath.get(path);return m?.products.includes(p.id)?m:undefined;};
   const primary=owned(p.image);
   if(!primary)continue;
   const scene=p.scene?owned(p.scene):undefined;
   const gallery=(p.gallery||[]).flatMap(g=>{const m=owned(g.src);return m?[{src:m.path,alt:m.alt,caption:m.caption,position:m.focalX+'% '+m.focalY+'%'}]:[];});
   // Project public fields only, even when stored JSON contains extra properties.
   const publicProduct:ShopProduct={id:p.id,slug:p.slug,name:p.name,subtitle:p.subtitle,category:p.category,tier:p.tier,story:p.story,dimensions:p.dimensions,material:p.material,revision,
    image:primary.path,imageAlt:primary.alt,imageCaption:primary.caption,imagePosition:primary.focalX+'% '+primary.focalY+'%',
    ...(scene?{scene:scene.path,sceneAlt:scene.alt,sceneCaption:scene.caption,scenePosition:scene.focalX+'% '+scene.focalY+'%'}:{}),gallery,
    fields:p.fields.map(f=>({id:f.id,label:f.label,type:f.type,required:f.required,options:f.type==='select'?f.options:undefined,hint:f.hint,maxLength:f.maxLength,min:f.min,max:f.max,visibleWhen:f.visibleWhen?{field:f.visibleWhen.field,value:f.visibleWhen.value}:undefined})),
    ...(p.translations?{translations:p.translations}:{})};
   products.push(localizeProduct(publicProduct,locale));
   slugs.add(p.slug);
  }catch{
   // Malformed published JSON is unavailable, never replaced with a draft or fixture.
  }
 }
 return products;
});
