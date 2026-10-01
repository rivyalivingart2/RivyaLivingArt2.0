/** One public contract for Studio navigation, route admission and renderer keys.
 * Authentication and API permissions remain server-owned.
 */
export const studioModules = [
 {key:'overview',segment:'',label:'Overview',group:'Work',aliases:[],adminOnly:false},
 {key:'inquiries',segment:'inquiries',label:'Inquiries & orders',group:'Work',aliases:['orders','kanban','enquiries'],adminOnly:false},
 {key:'follow-ups',segment:'follow-ups',label:'Follow-ups due',group:'Work',aliases:[],adminOnly:false},
 {key:'products',segment:'products',label:'Catalogue & forms',group:'Catalogue',aliases:['forms'],adminOnly:false},
 {key:'content',segment:'content',label:'Pages & journal',group:'Website',aliases:['pages','journal'],adminOnly:false},
 {key:'media',segment:'media',label:'Public media',group:'Media',aliases:[],adminOnly:false},
 {key:'site-copy',segment:'site-copy',label:'Site copy',group:'Website',aliases:[],adminOnly:false},
 {key:'site-images',segment:'site-images',label:'Site images',group:'Media',aliases:[],adminOnly:false},
 {key:'content-health',segment:'content-health',label:'Content health',group:'Website',aliases:[],adminOnly:false},
 {key:'site-settings',segment:'navigation',label:'Navigation & languages',group:'Administration',aliases:[],adminOnly:true},
 {key:'activity',segment:'activity',label:'Activity & logs',group:'Administration',aliases:[],adminOnly:false},
 {key:'staff',segment:'staff',label:'Staff access',group:'Administration',aliases:[],adminOnly:true},
 {key:'settings',segment:'settings',label:'Atelier settings',group:'Administration',aliases:[],adminOnly:true},
] as const;
export type StudioModule = typeof studioModules[number];
export type StudioModuleKey = StudioModule['key'];
export function studioModule(segment:string) {
 return studioModules.find(module=>module.segment===segment||(module.aliases as readonly string[]).includes(segment));
}
export function studioModuleHref(module:StudioModule) { return '/studio'+(module.segment?'/'+module.segment:''); }

/** Record selection uses query parameters; unsupported path tails must not open an unrelated list. */
export function studioRoute(path:readonly string[]) { return path.length===1?studioModule(path[0]):undefined; }
