import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {baselineProducts,validProduct,type ShopProduct} from './shop-model';
import {validMedia,type PublicMedia} from './public-media';

const baseline=new Map(baselineProducts.map(p=>[p.id,p]));
/** Published versions only; fixtures are validation references, never a fallback. */
export const publishedProducts=cache(async():Promise<ShopProduct[]>=>{
 const sql=studioDb();
 const [rows,media]=await Promise.all([
  sql`SELECT product_id, published, published_version FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL ORDER BY product_id`,
  sql`SELECT path,published FROM rivya_public_media WHERE published IS NOT NULL`
 ]);
 const byPath=new Map<string,PublicMedia>();
 for(const row of media)if(validMedia(row.published)&&row.path===row.published.path)byPath.set(row.path,row.published);
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
   products.push({id:p.id,slug:p.slug,name:p.name,subtitle:p.subtitle,category:p.category,tier:p.tier,story:p.story,dimensions:p.dimensions,material:p.material,revision,
    image:primary.path,imageAlt:primary.alt,imageCaption:primary.caption,imagePosition:primary.focalX+'% '+primary.focalY+'%',
    ...(scene?{scene:scene.path,sceneAlt:scene.alt,sceneCaption:scene.caption,scenePosition:scene.focalX+'% '+scene.focalY+'%'}:{}),gallery,
    fields:p.fields.map(f=>({id:f.id,label:f.label,type:f.type,required:f.required,options:f.type==='select'?f.options:undefined,hint:f.hint,maxLength:f.maxLength,min:f.min,max:f.max,visibleWhen:f.visibleWhen?{field:f.visibleWhen.field,value:f.visibleWhen.value}:undefined}))});
   slugs.add(p.slug);
  }catch{
   // Malformed published JSON is unavailable, never replaced with a draft or fixture.
  }
 }
 return products;
});
