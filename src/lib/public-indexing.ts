import type {PublishedContentDocument} from './published-content';

/** Search and private/task routes are never sitemap or indexable destinations. */
export function isIndexablePublicPath(route:string){
 if(!/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(route))return false;
 return !/^\/(?:studio|api|inquiry|preview|search|saved-pieces|personalize|preserve)(?:\/|$)/.test(route)
  && !/^\/(?:commission|pieces\/[^/]+)\/customize(?:\/|$)/.test(route);
}

/** Use only images in the current published projection, including withdrawal checks. */
export function publishedShareImage(document:PublishedContentDocument){
 const hero=document.homepage?.heroImage,snapshot=document.homeSnapshot;
 if(hero&&snapshot?.mediaPaths.includes(hero.path))return {path:hero.path,alt:hero.alt};
 if(document.homepage&&snapshot){
  const lead=snapshot.products.find(p=>p.id===document.homepage!.heroProductId);
  if(lead)return {path:lead.image,alt:lead.imageAlt||lead.name};
 }
 return document.image?{path:document.image,alt:document.imageAlt||document.title}:null;
}
