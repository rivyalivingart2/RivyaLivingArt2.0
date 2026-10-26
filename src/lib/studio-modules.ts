/** One public contract for Studio navigation, route admission and renderer keys.
 * Authentication and API permissions remain server-owned.
 */
export type StudioWorkflow = 'operations' | 'catalogue' | 'editorial' | 'presentation' | 'governance';
export type StudioModuleStatus = 'active' | 'guarded' | 'status-only';

export const studioModules = [
 {key:'overview',segment:'',label:'Overview',group:'Today',aliases:[],adminOnly:false,workflow:'operations',status:'active'},
 {key:'inquiries',segment:'inquiries',label:'Inquiries & orders',group:'Today',aliases:['orders','kanban','enquiries'],adminOnly:false,workflow:'operations',status:'active'},
 {key:'follow-ups',segment:'follow-ups',label:'Follow-ups due',group:'Today',aliases:[],adminOnly:false,workflow:'operations',status:'active'},
 {key:'products',segment:'products',label:'Products',group:'Catalogue',aliases:[],adminOnly:false,workflow:'catalogue',status:'active'},
 {key:'content-register',segment:'content-register',label:'Production register',group:'Editorial',aliases:[],adminOnly:false,workflow:'editorial',status:'active'},
 {key:'editorial-order',segment:'editorial-order',label:'Editorial ordering',group:'Editorial',aliases:[],adminOnly:false,workflow:'editorial',status:'active'},
 {key:'content',segment:'content',label:'All content',group:'Editorial',aliases:[],adminOnly:false,workflow:'editorial',status:'active'},
 {key:'media',segment:'media',label:'Public media',group:'Catalogue',aliases:[],adminOnly:false,workflow:'catalogue',status:'active'},
 {key:'site-copy',segment:'site-copy',label:'Site copy',group:'Content',aliases:[],adminOnly:false,workflow:'presentation',status:'active'},
 {key:'sections',segment:'sections',label:'Page design',group:'Content',aliases:[],adminOnly:false,workflow:'presentation',status:'active'},
 {key:'site-images',segment:'site-images',label:'Site images',group:'Content',aliases:[],adminOnly:false,workflow:'presentation',status:'active'},
 {key:'content-health',segment:'content-health',label:'Content health',group:'Settings',aliases:[],adminOnly:false,workflow:'governance',status:'active'},
 {key:'site-settings',segment:'navigation',label:'Navigation & languages',group:'Content',aliases:[],adminOnly:true,workflow:'presentation',status:'guarded'},
 {key:'legacy',segment:'legacy',label:'Legacy decisions',group:'Settings',aliases:[],adminOnly:true,workflow:'governance',status:'guarded'},
 {key:'translations',segment:'translations',label:'Language review',group:'Content',aliases:[],adminOnly:false,workflow:'presentation',status:'active'},
 {key:'route-review',segment:'route-review',label:'Old links & publication',group:'Settings',aliases:[],adminOnly:true,workflow:'governance',status:'guarded'},
 {key:'activity',segment:'activity',label:'Activity & logs',group:'Today',aliases:[],adminOnly:false,workflow:'operations',status:'active'},
 {key:'staff',segment:'staff',label:'Staff access',group:'Settings',aliases:['users'],adminOnly:true,workflow:'governance',status:'guarded'},
 {key:'settings',segment:'settings',label:'Atelier settings',group:'Settings',aliases:[],adminOnly:true,workflow:'governance',status:'guarded'},
 {key:'analytics',segment:'analytics',label:'Analytics',group:'Today',aliases:[],adminOnly:false,workflow:'operations',status:'active'},
 {key:'categories',segment:'categories',label:'Categories',group:'Catalogue',aliases:[],adminOnly:false,workflow:'catalogue',status:'active'},
 {key:'import',segment:'import',label:'Bulk import',group:'Catalogue',aliases:[],adminOnly:true,workflow:'catalogue',status:'status-only'},
 {key:'exports',segment:'exports',label:'Exports',group:'Catalogue',aliases:[],adminOnly:true,workflow:'operations',status:'guarded'},
 {key:'research',segment:'research',label:'Research',group:'Catalogue',aliases:[],adminOnly:false,workflow:'catalogue',status:'active'},
 {key:'content-gaps',segment:'content-gaps',label:'Content gaps',group:'Catalogue',aliases:[],adminOnly:false,workflow:'catalogue',status:'active'},
 {key:'process',segment:'process',label:'Process steps',group:'Content',aliases:[],adminOnly:false,workflow:'presentation',status:'active'},
 {key:'materials',segment:'materials',label:'Materials',group:'Content',aliases:[],adminOnly:false,workflow:'presentation',status:'active'},
 {key:'forms',segment:'forms',label:'Commission forms',group:'Content',aliases:[],adminOnly:false,workflow:'presentation',status:'active'},
 {key:'journal',segment:'journal',label:'Journal',group:'Editorial',aliases:['blog'],adminOnly:false,workflow:'editorial',status:'active'},
 {key:'portfolio',segment:'portfolio',label:'Portfolio',group:'Editorial',aliases:[],adminOnly:false,workflow:'editorial',status:'active'},
 {key:'testimonials',segment:'testimonials',label:'Testimonials',group:'Editorial',aliases:[],adminOnly:false,workflow:'editorial',status:'active'},
 {key:'faqs',segment:'faqs',label:'FAQs',group:'Editorial',aliases:[],adminOnly:false,workflow:'editorial',status:'active'},
 {key:'pages',segment:'pages',label:'Pages',group:'Editorial',aliases:[],adminOnly:false,workflow:'editorial',status:'active'},
 {key:'landing-pages',segment:'landing-pages',label:'Landing pages',group:'Editorial',aliases:['custom-pages'],adminOnly:false,workflow:'editorial',status:'active'},
 {key:'seo',segment:'seo',label:'SEO',group:'Settings',aliases:[],adminOnly:false,workflow:'governance',status:'active'},
 {key:'subscribers',segment:'subscribers',label:'Subscribers',group:'Settings',aliases:[],adminOnly:true,workflow:'operations',status:'guarded'},
 {key:'content-lab',segment:'content-lab',label:'Content lab',group:'Settings',aliases:[],adminOnly:false,workflow:'governance',status:'active'},
] as const;

/** Status-only destinations retain guarded bookmarks but are not everyday tools. */
export const studioNavigationModules = studioModules.filter(module => module.status !== 'status-only');
export type StudioModule = typeof studioModules[number];
export type StudioModuleKey = StudioModule['key'];

export function studioModule(segment: string) {
  return studioModules.find(module => module.segment === segment || (module.aliases as readonly string[]).includes(segment));
}

export function studioModuleHref(module: StudioModule) {
  return '/studio' + (module.segment ? '/' + module.segment : '');
}

/** Record selection uses query parameters; unsupported path tails must not open an unrelated list. */
export function studioRoute(path: readonly string[]) {
  return path.length === 1 ? studioModule(path[0]) : undefined;
}

/** Old child views resolve only for supported current records; no old data or ingest is imported. */
export function studioChildHref(path: readonly string[]) {
  const selectedModule = studioModule(path[0]);
  if (!selectedModule || path.length !== 2 || !['inquiries','products','journal','portfolio','testimonials','faqs','pages','landing-pages'].includes(selectedModule.key)) return null;
  const id = path[1];
  if (!id || id.length > 240 || !/^[a-zA-Z0-9:_-]+$/.test(id)) return null;
  return studioModuleHref(selectedModule) + '?' + new URLSearchParams(id === 'new' ? {create: '1'} : {record: id});
}

export function studioModulesByWorkflow(workflow: StudioWorkflow): readonly StudioModule[] {
  return studioModules.filter(m => m.workflow === workflow);
}

export function studioActiveModules(): readonly StudioModule[] {
  return studioModules.filter(m => m.status === 'active');
}
