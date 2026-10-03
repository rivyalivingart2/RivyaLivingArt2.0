import {resolveLegacyRoute} from './legacy-routes';
const publicPaths=new Set(['/','/search','/journal','/commission','/commission/customize','/collectible-design','/memory-art','/personal-art','/our-story','/process','/materials-care','/contact','/faq','/privacy','/terms','/accessibility','/shipping-delivery','/returns-cancellations','/imprint','/architects','/portfolio','/preserve','/personalize']);
const aliases:Record<string,string>={'/about':'/our-story','/materials':'/materials-care#materials','/care':'/materials-care#care'};
export function resolveLegacyLocale(pathname:string,params:URLSearchParams){
 const [,locale,...parts]=pathname.split('/');const path='/'+parts.join('/');
 if(!['en','hi','gu','ar','es','de','fr','zh','ja'].includes(locale))return null;
 const old=resolveLegacyRoute(path==='/search'?'/shop':path==='/journal'?'/blog':path,params);
 const target=(path==='/search'||path==='/journal')&&old.kind==='redirect'?old.href:publicPaths.has(path)?path:Object.hasOwn(aliases,path)?aliases[path]:old.kind==='redirect'?old.href:null;
 if(!target)return {locale:'en',target:null};
 // A cookie preference is temporary and cannot justify a permanent SEO redirect.
 return {locale:['en','hi','gu'].includes(locale)?locale:'en',target};
}
