import type {ContentDocument} from '@/lib/content-model';
import type {ShopProduct} from '@/lib/shop-model';
import type {Locale} from '@/lib/site-settings-model';
import {siteOrigin} from '@/lib/site-metadata';
import {StructuredData,editorialStructuredDataValue} from './structured-data-markup';
export {StructuredData} from './structured-data-markup';
export function EditorialStructuredData({document:d}:{document:ContentDocument&{contentLanguage?:Locale}}){
 return <StructuredData value={editorialStructuredDataValue(d,siteOrigin)}/>;
}
export function WebsiteStructuredData(){return <StructuredData value={{'@context':'https://schema.org','@graph':[
 {'@type':'Organization','@id':siteOrigin+'/#atelier',name:'RivyaLivingArt',url:siteOrigin+'/'},
 {'@type':'WebSite','@id':siteOrigin+'/#website',name:'RivyaLivingArt',url:siteOrigin+'/',publisher:{'@id':siteOrigin+'/#atelier'},inLanguage:'en'}
]}}/>;}
export function ProductStructuredData({product:p}:{product:ShopProduct}){
 const url=siteOrigin+'/pieces/'+p.slug,collection=siteOrigin+(p.tier==='large'?'/collectible-design':p.tier==='memory'?'/memory-art':'/personal-art');
 return <StructuredData value={{'@context':'https://schema.org','@graph':[
  {'@type':'BreadcrumbList',itemListElement:[
   {'@type':'ListItem',position:1,name:'Home',item:siteOrigin+'/'},
   {'@type':'ListItem',position:2,name:p.tier==='large'?'Furniture & spatial art':p.tier==='memory'?'Memory art':'Personal art & gifts',item:collection},
   {'@type':'ListItem',position:3,name:p.name,item:url}
  ]},
  {'@type':'Product','@id':url,url,name:p.name,description:p.story,sku:p.id,category:p.category,mainEntityOfPage:url,image:[...new Set([p.image,p.scene,...(p.gallery||[]).map(g=>g.src)].filter((src):src is string=>!!src))].map(src=>siteOrigin+src),brand:{'@type':'Brand',name:'RivyaLivingArt'}}
 ]}}/>;
}
export function CollectionStructuredData({title,description,url,products}:{title:string;description:string;url:string;products:Pick<ShopProduct,'slug'|'name'>[]}){
 return <StructuredData value={{'@context':'https://schema.org','@type':'CollectionPage','@id':siteOrigin+url,url:siteOrigin+url,name:title,description,mainEntity:{'@type':'ItemList',numberOfItems:products.length,itemListElement:products.map((p,index)=>({'@type':'ListItem',position:index+1,url:siteOrigin+'/pieces/'+p.slug,name:p.name}))}}}/>;
}
