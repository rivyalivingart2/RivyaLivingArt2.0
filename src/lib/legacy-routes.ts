/** Reviewed route intent only. This registry never imports or changes catalogue records. */
export type LegacyRoute = {
 source:string;
 destination?:string;
 disposition:'redirect'|'existing'|'review'|'retired'|'private'|'planned';
 reason:string;
 evidence:string;
};
export const legacyRoutes:readonly LegacyRoute[]=[
 {source:'/shop',destination:'/search',disposition:'redirect',reason:'Browse the current published catalogue. Supported search and sort choices are retained.',evidence:'OLDWEBSITE shop/(index); current CatalogueBrowser'},
 {source:'/blog',destination:'/journal',disposition:'redirect',reason:'The editorial index continues in Journal. Unsupported old taxonomy needs review.',evidence:'OLDWEBSITE blog/(index); current JournalBrowser'},
 {source:'/custom-order',destination:'/commission',disposition:'redirect',reason:'Retain the choice of an existing design or a bespoke brief.',evidence:'OLDWEBSITE custom-order; current commission entry'},
 {source:'/large-resin-art',destination:'/collectible-design',disposition:'redirect',reason:'Furniture and spatial-art collection intent is retained.',evidence:'OLDWEBSITE large-resin-art; current large collection'},
 {source:'/shop/resin-furniture-surfaces',destination:'/collectible-design',disposition:'redirect',reason:'Furniture, tables, consoles and surface panels belong to the current furniture journey.',evidence:'OLDWEBSITE prisma/seed.ts category description; current large collection'},
 {source:'/shop/gift-collections',destination:'/personal-art',disposition:'redirect',reason:'The current gifts journey is the reviewed collection-level equivalent; individual products are not transferred.',evidence:'OLDWEBSITE catalog-taxonomy.ts Gift Collections; current personal collection'},
 {source:'/shop/varmala-preservation',destination:'/memory-art',disposition:'redirect',reason:'Wedding garland preservation continues in the memory-art journey.',evidence:'OLDWEBSITE prisma/seed.ts Varmala Preservation; current memory collection'},
 {source:'/about',destination:'/our-story',disposition:'existing',reason:'Existing story alias retained.',evidence:'src/app/about/page.tsx'},
 {source:'/materials',destination:'/materials-care#materials',disposition:'existing',reason:'Existing material chapter alias retained.',evidence:'src/app/materials/page.tsx'},
 {source:'/care',destination:'/materials-care#care',disposition:'existing',reason:'Existing care chapter alias retained.',evidence:'src/app/care/page.tsx'},
 {source:'/shop/wishlist',destination:'/saved-pieces',disposition:'retired',reason:'Explain that the old browser-local saved list has not been transferred; offer the current saved-pieces view.',evidence:'OLDWEBSITE shop/wishlist; current browser-local saved-pieces contract'},
 {source:'/whatsapp-order',destination:'/contact',disposition:'private',reason:'Old receipt credentials belong to another service. Never forward tokens, customer fields or message payloads.',evidence:'OLDWEBSITE whatsapp-order token reader; current private inquiry contract'},
 {source:'/product/[slug]',disposition:'review',reason:'An exact old-to-current product identity must be recorded before redirecting. Similar names or slugs are insufficient.',evidence:'P0 protected catalogue; owner excludes product transfer'},
 {source:'/blog/[slug]',disposition:'review',reason:'An exact retained article and published destination must be reviewed before redirecting.',evidence:'P0 route inventory; current published articles'},
 {source:'/shop/[category]',disposition:'review',reason:'Only the named category mappings above are active. Other shelves need an explicit intent comparison.',evidence:'OLDWEBSITE seeded and canonical category vocabularies'},
 {source:'/workshops',disposition:'retired',reason:'No verified current workshop offering was supplied. Do not collect a waitlist or invent dates.',evidence:'P6 W31 conditional offering boundary'},
 {source:'/portfolio/[slug]',disposition:'review',reason:'Require genuine project facts, permission and exact identity; never substitute a design visualization.',evidence:'Current approvedProjects is empty'},
 {source:'/p/[slug]',disposition:'review',reason:'Current published custom pages remain available; old pages require an individual content comparison.',evidence:'P4 durable custom-page contract'},
 {source:'/[locale]/[path]',disposition:'planned',reason:'Language-prefixed compatibility and reviewed journeys are P6B. No blanket locale stripping or locale SEO migration is active.',evidence:'P6 T36/T37; current cookie-based locale selection'},
] as const;

export type LegacyResolution={kind:'redirect';href:string}|{kind:'notice';status:404|410;title:string;message:string;href:string;label:string};
const unavailable:LegacyResolution={kind:'notice',status:404,title:'This older address needs a new starting point.',message:'We have not verified a matching page in the current website. Explore the current collection or contact the atelier with the name of the piece or story.',href:'/search',label:'Explore current pieces'};
const first=(params:URLSearchParams,key:string)=>params.getAll(key).length===1?params.get(key)?.trim()||'':'';
const withQuery=(path:string,query:URLSearchParams)=>path+(query.size?'?'+query.toString():'');

/** Only supported discovery fields survive. Never copy arbitrary query parameters. */
export function legacyDiscoveryQuery(params:URLSearchParams,kind:'shop'|'journal'){
 const result=new URLSearchParams(),q=first(params,'q');
 if(q&&!/[\u0000-\u001f\u007f]/.test(q))result.set('q',q.slice(0,100));
 if(kind==='shop'){
  const sort=first(params,'sort');
  if(sort==='name-asc'||sort==='name')result.set('sort','name');
  else if(sort==='name-desc')result.set('sort','name-desc');
 }
 // Old price/stock/occasion/category IDs, cursors and numbered pages have no
 // verified equivalent in the new catalogue. Do not misrepresent their meaning.
 return result;
}

export function resolveLegacyRoute(path:string,params=new URLSearchParams()):LegacyResolution{
 if(path==='/whatsapp-order')return {kind:'notice',status:410,title:'This link belongs to the previous request system.',message:'It cannot open a saved request in this website. Contact the atelier using the details you already have. Opening this page has not created an inquiry or prepared a message.',href:'/contact',label:'Contact the atelier'};
 if(path==='/shop/wishlist')return {kind:'notice',status:410,title:'Your saved pieces have a new home.',message:'The older saved list was stored in your browser and has not been transferred. The current saved-pieces view contains only pieces saved on this website in this browser.',href:'/saved-pieces',label:'Open current saved pieces'};
 if(path==='/workshops'||/^\/shop\/(?:supplies-|print-)/.test(path)||path==='/shop/workshops'||path==='/shop'&&['supplies','print'].includes(first(params,'type')))return {kind:'notice',status:410,title:'This offering is not listed on the current website.',message:'Workshop, supplies and printing availability must be confirmed with the atelier. This page does not offer booking, ordering or a waitlist.',href:'/contact',label:'Ask the atelier'};
 const mapping=legacyRoutes.find(row=>row.source===path&&row.disposition==='redirect');
 if(!mapping?.destination)return unavailable;
 const kind=path==='/blog'?'journal':'shop';
 const query=path==='/shop'||path.startsWith('/shop/')||path==='/blog'?legacyDiscoveryQuery(params,kind):new URLSearchParams();
 const unsupported=['category','occasion','band','stock','sizeTier','page','after','tag'].some(key=>!!first(params,key))||!!first(params,'sort')&&!['name','name-asc','name-desc'].includes(first(params,'sort'));
 if(unsupported)query.set('legacyFilters','reset');
 return {kind:'redirect',href:withQuery(mapping.destination,query)};
}
