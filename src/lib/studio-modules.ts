/** One public contract for Studio navigation, route admission and renderer keys.
 * Authentication and API permissions remain server-owned.
 */
export const studioModules = [
 {key:'overview',segment:'',label:'Overview',group:'Today',aliases:[],adminOnly:false},
 {key:'inquiries',segment:'inquiries',label:'Inquiries & orders',group:'Today',aliases:['orders','kanban','enquiries'],adminOnly:false},
 {key:'follow-ups',segment:'follow-ups',label:'Follow-ups due',group:'Today',aliases:[],adminOnly:false},
 {key:'products',segment:'products',label:'Catalogue & forms',group:'Catalogue',aliases:['forms'],adminOnly:false},
 {key:'content',segment:'content',label:'Pages & journal',group:'Editorial',aliases:['pages','journal'],adminOnly:false},
 {key:'media',segment:'media',label:'Public media',group:'Catalogue',aliases:[],adminOnly:false},
 {key:'site-copy',segment:'site-copy',label:'Site copy',group:'Content',aliases:[],adminOnly:false},
 {key:'site-images',segment:'site-images',label:'Site images',group:'Content',aliases:[],adminOnly:false},
 {key:'content-health',segment:'content-health',label:'Content health',group:'Settings',aliases:[],adminOnly:false},
 {key:'site-settings',segment:'navigation',label:'Navigation & languages',group:'Content',aliases:[],adminOnly:true},
 {key:'legacy',segment:'legacy',label:'Legacy decisions',group:'Settings',aliases:[],adminOnly:true},
 {key:'translations',segment:'translations',label:'Language review',group:'Content',aliases:[],adminOnly:false},
 {key:'route-review',segment:'route-review',label:'Old links & publication',group:'Settings',aliases:[],adminOnly:true},
 {key:'activity',segment:'activity',label:'Activity & logs',group:'Today',aliases:[],adminOnly:false},
 {key:'staff',segment:'staff',label:'Staff access',group:'Settings',aliases:[],adminOnly:true},
 {key:'settings',segment:'settings',label:'Atelier settings',group:'Settings',aliases:[],adminOnly:true},
] as const;
export type StudioModule = typeof studioModules[number];
export type StudioModuleKey = StudioModule['key'];
export function studioModule(segment:string) {
 return studioModules.find(module=>module.segment===segment||(module.aliases as readonly string[]).includes(segment));
}
export function studioModuleHref(module:StudioModule) { return '/studio'+(module.segment?'/'+module.segment:''); }

/** Record selection uses query parameters; unsupported path tails must not open an unrelated list. */
export function studioRoute(path:readonly string[]) { return path.length===1?studioModule(path[0]):undefined; }
