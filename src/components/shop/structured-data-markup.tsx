import type {ContentDocument} from '@/lib/content-model';
import type {Locale} from '@/lib/site-settings-model';

/** Escape markup boundaries even when an administrator supplied the visible text. */
export function StructuredData({value}:{value:Record<string,unknown>}){
 return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(value).replace(/</g,'\\u003c')}}/>;
}

export function editorialStructuredDataValue(d:ContentDocument&{contentLanguage?:Locale},origin:string){
 const article=d.kind==='article',url=origin+d.route;
 return {'@context':'https://schema.org','@graph':[
  {'@type':'BreadcrumbList',itemListElement:[
   {'@type':'ListItem',position:1,name:'Home',item:origin+'/'},
   ...(article?[{'@type':'ListItem',position:2,name:'Journal',item:origin+'/journal'}]:[]),
   {'@type':'ListItem',position:article?3:2,name:d.title,item:url}]},
  {'@type':article?'Article':'WebPage','@id':url,url,name:d.title,description:d.description,inLanguage:d.contentLanguage||'en',
   ...(article?{headline:d.title,author:{'@type':'Organization',name:'RivyaLivingArt',url:origin},mainEntityOfPage:url,articleSection:d.eyebrow}:{}),
   ...(d.image?{image:origin+d.image}:{})}
 ]};
}
