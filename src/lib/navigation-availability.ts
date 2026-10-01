import type {NavigationSettings} from './site-settings-model';
export type PublicDestination={route:string;anchors:string[]};
const structural=new Set(['/','/collectible-design','/memory-art','/personal-art','/search','/commission','/commission/customize','/journal','/portfolio','/preserve','/personalize']);
const aliases:Record<string,string>={'/materials':'/materials-care','/care':'/materials-care'};
/** Visibility is derived from current publication, without rewriting the owner's navigation settings. */
export function destinationAvailable(href:string,documents:PublicDestination[],productRoutes:string[]){
 if(!href.startsWith('/'))return /^(https:\/\/|mailto:|tel:)/i.test(href);
 if(href.startsWith('//'))return false;
 const [url,anchor]=href.split('#'),path=url.split('?')[0],canonical=aliases[path]||path;
 const document=documents.find(d=>d.route===canonical);
 if(anchor)return !!document?.anchors.includes(anchor);
 if(structural.has(canonical))return true;
 return !!document||productRoutes.includes(canonical)||productRoutes.some(route=>canonical===route+'/customize');
}
export function availableNavigation(navigation:NavigationSettings,documents:PublicDestination[],productRoutes:string[]):NavigationSettings{
 return Object.fromEntries(Object.entries(navigation).map(([key,items])=>[key,items.filter(item=>item.visible&&destinationAvailable(item.href,documents,productRoutes))])) as NavigationSettings;
}
