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
export function CollectionStructuredData({title,description,url,products}:{title:string;description:string;url:string;products:ShopProduct[]}){
 return <StructuredData value={{'@context':'https://schema.org','@type':'CollectionPage','@id':siteOrigin+url,url:siteOrigin+url,name:title,description,mainEntity:{'@type':'ItemList',numberOfItems:products.length,itemListElement:products.map((p,index)=>({'@type':'ListItem',position:index+1,url:siteOrigin+'/pieces/'+p.slug,name:p.name}))}}}/>;
}
