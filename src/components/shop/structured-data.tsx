import type {ContentDocument} from '@/lib/content-model';
import type {ShopProduct} from '@/lib/shop-model';
import {siteOrigin} from '@/lib/site-metadata';
/** Escape markup boundaries even when an administrator supplied the visible text. */
export function StructuredData({value}:{value:Record<string,unknown>}){
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(value).replace(/</g,'\\u003c')}}/>;
}
export function EditorialStructuredData({document:d}:{document:ContentDocument}){
 const article=d.kind==='article',url=siteOrigin+d.route;
 return <StructuredData value={{'@context':'https://schema.org','@graph':[
  {'@type':'BreadcrumbList',itemListElement:[
   {'@type':'ListItem',position:1,name:'Home',item:siteOrigin+'/'},
   ...(article?[{'@type':'ListItem',position:2,name:'Journal',item:siteOrigin+'/journal'}]:[]),
   {'@type':'ListItem',position:article?3:2,name:d.title,item:url}]},
  {'@type':article?'Article':'WebPage','@id':url,url,name:d.title,description:d.description,inLanguage:'en',
   ...(article?{headline:d.title,author:{'@type':'Organization',name:'RivyaLivingArt',url:siteOrigin},mainEntityOfPage:url,articleSection:d.eyebrow}:{}),
   ...(d.image?{image:siteOrigin+d.image}:{})}
 ]}}/>;
}
export function WebsiteStructuredData(){return <StructuredData value={{'@context':'https://schema.org','@graph':[
 {'@type':'Organization','@id':siteOrigin+'/#atelier',name:'RivyaLivingArt',url:siteOrigin+'/'},
 {'@type':'WebSite','@id':siteOrigin+'/#website',name:'RivyaLivingArt',url:siteOrigin+'/',publisher:{'@id':siteOrigin+'/#atelier'},inLanguage:'en'}
]}}/>;}
export function ProductStructuredData({product:p}:{product:ShopProduct}){
 return <StructuredData value={{'@context':'https://schema.org','@type':'Product',name:p.name,description:p.story,sku:p.id,category:p.category,url:siteOrigin+'/pieces/'+p.slug,image:[...new Set([p.image,p.scene,...(p.gallery||[]).map(g=>g.src)].filter((src):src is string=>!!src))].map(src=>siteOrigin+src),brand:{'@type':'Brand',name:'RivyaLivingArt'}}}/>;
}
