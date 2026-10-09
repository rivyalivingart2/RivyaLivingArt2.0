import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const dir='docs/redesign/old-design-migration-2026-10-08';
const read=name=>JSON.parse(readFileSync(resolve(dir,name),'utf8'));
const source=read('source-reconciliation.json');
const sections=read('old-section-manifest.json');
const route=(path,owner,selection,state='existing')=>({path,owner,selection,state});
const content='src/lib/published-content.ts',products='src/lib/shop-catalogue.ts';
const publicRoutes={
 '/about':route('/our-story',content,'page:our-story; preserve /about alias'),
 '/blog':route('/journal',content,'published article documents; current featured IDs and locale'),
 '/blog/[slug]':route('/journal/[slug]',content,'exact existing article route or approved alias; absent identity = 404'),
 '/contact':route('/contact','src/lib/business-settings.ts','page:contact + current business values + existing inquiry form'),
 '/custom-order':route('/commission','src/lib/order-service.ts','current commission variants and SavedBriefV2; no old actions'),
 '/faq':route('/faq',content,'existing page:faq sections + separately published new FAQ records'),
 '/large-resin-art':route('/collectible-design',products,'existing large-tier discovery and page document'),
 '/p/[slug]':route('/p/[slug]',content,'exact published custom-page identity; additive block manifest proposed'),
 '/':route('/',content,'page:home + captured dependencies; separate presentation:home record proposed'),
 '/portfolio':route('/portfolio',content,'new published portfolio records; concepts visibly classified; existing records untouched'),
 '/portfolio/[slug]':route('/portfolio/[slug]',content,'exact published new record; concept label on cover, detail and gallery; absent = 404'),
 '/privacy':route('/privacy',content,'existing page:privacy exact approved wording'),
 '/process':route('/process',content,'page:process + page:materials; preserve real stage wording/chronology'),
 '/product/[slug]':route('/pieces/[slug]',products,'verified current slug only; legacy registry handles unmatched identity'),
 '/search':route('/search',products,'bounded published products + pages/articles + new published editorial records; no private/draft data'),
 '/shop':route('/search',products,'complete shop composition in existing search: query, tier, category, facets, pagination; preserve current /shop legacy behavior'),
 '/shop/[category]':route('/search?category=[verified-category]',products,'explicit category identity lookup; unknown old category = existing legacy unavailable response'),
 '/shop/wishlist':route('/saved-pieces','src/components/shop/saved-pieces.tsx','existing browser-local saved product IDs; no account sync'),
 '/terms':route('/terms',content,'existing page:terms exact approved wording'),
 '/whatsapp-order':route('/inquiry/received','src/lib/order-receipt.ts','authorized current receipt capability only; no automatic old-token redirect or Send'),
 '/workshops':route('/workshops',content,'new optional offering document; no source = unpublished/404','conditional'),
 '/gone':route('/preview/states','src/lib/legacy-route-handler.ts','private visual sample; public 410 only through real legacy disposition'),
 '/maintenance':route('/preview/states','src/lib/public-website.ts','private holding sample; real unavailable mode retains existing responses'),
 '/too-many-requests':route('/preview/states','src/lib/order-service.ts','private 429 sample; real API keeps retry/rate policy'),
 '/design-lab':route('/preview/states','src/lib/preview-mode.ts','private/noindex component state catalogue only'),
};
// A proposed destination is a contract to implement, never proof it is admitted now.
const studio={
 exports:['exports','src/app/api/studio/operations/route.ts','new view of existing scoped managed exports; admin-only; no export executed by migration'],
 forms:['products','src/lib/studio-catalogue.ts','existing forms alias; immutable existing form schemas'],
 import:['import','src/lib/studio-catalogue.ts','conditional reference form only; product ingest excluded'],
 activity:['activity','src/lib/revision-history.ts','existing'],analytics:['analytics','src/lib/studio-work-queue.ts','new aggregate-only view; no tracking'],
 blog:['journal','src/lib/studio-content-data.ts','existing alias; dedicated article filter proposed'],
 categories:['categories','src/lib/studio-catalogue.ts','new read-only category projection'],
 'content-gaps':['content-gaps','src/lib/content-health-report.ts','new read-only view'],
 'content-health':['content-health','src/lib/content-health.ts','existing'],
 'content-lab':['content-lab','src/lib/studio-content-data.ts','new planning/review view; no automatic publish'],
 'custom-pages':['landing-pages','src/lib/studio-content-data.ts','new block editor under current revision permissions'],
 faqs:['faqs','src/lib/studio-content-data.ts','new additive editorial adapter'],
 inquiries:['inquiries','src/lib/studio-orders.ts','existing scoped order service'],
 materials:['materials','src/lib/studio-content-data.ts','new material-section view'],
 media:['media','src/lib/studio-media.ts','existing public assets; private references remain order-scoped'],
 navigation:['navigation','src/lib/site-settings.ts','existing admin-only'],
 pages:['pages','src/lib/studio-content-data.ts','existing alias; dedicated page filter proposed'],
 portfolio:['portfolio','src/lib/studio-content-data.ts','new classified editorial adapter'],
 process:['process','src/lib/studio-content-data.ts','new process-section view'],
 products:['products','src/lib/studio-catalogue.ts','existing; query-selected editor proposed; no old transfer'],
 research:['research','src/lib/content-health-report.ts','new editorial research notes only; ingestion excluded'],
 sections:['sections','src/lib/homepage-model.ts','new separate versioned presentation adapter'],
 seo:['seo','src/lib/content-issues.ts','new existing-document audit view; protected fields read-only'],
 settings:['settings','src/lib/business-settings.ts','existing admin-only'],
 'site-copy':['site-copy','src/lib/shared-copy-model.ts','existing'],
 'site-images':['site-images','src/lib/studio-media.ts','existing'],
 subscribers:['subscribers','src/lib/studio-auth.ts','conditional; no collection/service/export activation'],
 testimonials:['testimonials','src/lib/studio-content-data.ts','new classified editorial adapter; no fabricated ratings'],
 users:['staff','src/lib/studio-staff.ts','existing admin-only'],
};
const aliases={
 'src/lib/revision-history.ts':'src/app/api/studio/operations/route.ts',
 'src/lib/studio-content-data.ts':'src/app/api/studio/content/route.ts',
 'src/lib/studio-catalogue.ts':'src/app/api/studio/workspace/route.ts',
 'src/lib/studio-media.ts':'src/app/api/studio/media/route.ts',
};
function actualOwner(owner){const actual=aliases[owner]||owner;assert.ok(existsSync(actual),'Missing current owner '+actual);return actual;}
const routeContracts=source.sourceRows.map(row=>{
 let destination;
 if(!row.oldRoute.startsWith('/studio'))destination=publicRoutes[row.oldRoute];
 else if(row.disposition.startsWith('Excluded'))destination={path:null,owner:null,selection:'Reference-only source/layout coverage; no route, action, credential, import or ingest',state:'excluded'};
 else if(['/studio/login','/studio/signup','/studio/forgot-password','/studio/reset-password'].includes(row.oldRoute))destination=route('/studio/login','src/lib/studio-auth.ts',row.oldRoute==='/studio/login'?'current sign-in, error, throttle, expired state':'current sign-in and administrator-managed access; no public signup/password-email service','existing auth policy; unsupported old mutation excluded');
 else if(row.oldRoute==='/studio')destination=route('/studio','src/lib/studio-work-queue.ts','role-scoped counts, current eight-stage orders and IST due work');
 else{
  const [, , module]=row.oldRoute.split('/');const entry=studio[module];assert.ok(entry,row.oldRoute);
  const view=row.oldRoute.endsWith('/card')?'print':row.oldRoute.endsWith('/new')?'new':row.oldRoute.includes('[id]')?'detail':'list';
  const query=view==='print'?'?record=[id]&view=print':view==='new'?'?create=1':view==='detail'?'?record=[id]':'';
  destination=route('/studio/'+entry[0]+query,entry[1],view==='list'?'bounded role-scoped list':view==='new'?'explicit create intent, server-generated current ID; protected catalogue create withheld in this migration':view==='print'?'authorized saved order selection; read-only print composition; no send':'validated record query, current ID and server permissions; unknown ID shows unavailable',entry[2]);
 }
 assert.ok(destination,row.oldRoute);if(destination.owner)destination.owner=actualOwner(destination.owner);
 return {oldRoute:row.oldRoute,oldSource:row.source,phase:row.phase,destination,referenceOnly:row.disposition.startsWith('Excluded'),protectedGuard:row.guard,overrides:row.oldRoute.includes('portfolio')||row.oldRoute.includes('testimonials')?['2026-10-09-labelled-editorial-content']:[],implementation:'not-accepted',visual:'not-run'};
});
const groupRoutes={HOME:'/',ABOUT:'/our-story',PROCESS:'/process',PROCESS_STEPS_LIST:'/process',MATERIALS_LIST:'/materials',CUSTOM_ORDER:'/commission',CONTACT:'/contact',WORKSHOPS:'/workshops',LARGE_FORMAT:'/collectible-design'};
const homeBindings={
 pour:'home.hero: title, description, action IDs, existing desktop/mobile usages',
 manifesto:'home.strip exact existing strings; new copy only in separate additive record',
 pieces:'home.sections[selected].productIds in existing order; never choose replacement products',
 'large-format':'published collectible-design document; only existing collection/product identities',
 material:'home.sections[material] text, image usage and current action',
 collections:'home.sections[categories] exact category items and usages',
 furniture:'new labelled concept composition; disabled by default; no invented service promise',
 maker:'published our-story document; no generated person described as actual staff',
 rooms:'new labelled illustrative room composition; disabled by default',
 work:'new published portfolio records; concept/completed classification visible',
 words:'new published testimonial records; fictional sample label adjacent to every quote',
 bespoke:'home.sections[journeys] commission item and action; exact existing values',
 workshops:'new evidence-approved offering document only; inactive without it',
 print:'new evidence-approved printing offering only; inactive without it',
 process:'home.sections[process] steps with existing order/text',
 why:'published about/materials explanatory text only; no invented claims or awards',
 journal:'home.sections[journal] current IDs; article publication and locale guards',
 closing:'home.sections[invitation] exact title, description and action',
};
const sectionContracts=sections.flatMap(group=>group.sections.map((section,i)=>{
 const conditional=group.group==='WORKSHOPS'||['workshops','print'].includes(section.key)||section.conditional||section.defaultVisible===false;
 return {id:group.group+':'+section.key,group:group.group,key:section.key,label:section.label,route:groupRoutes[group.group],source:section.source,sourceLine:section.line,initialOrder:i,ownsH1:!!section.ownsH1,movable:!!section.movable,hideable:!!section.hideable,defaultVisible:section.defaultVisible!==false,condition:conditional?'Requires selected published record plus appropriate classification/factual source; omit when unavailable':'Requires bound current published copy; no invented old copy fallback',
 dataOwner:content,presentationOwner:'new versioned presentation manifest; never reorder existing content/product/gallery arrays',
 binding:group.group==='HOME'?homeBindings[section.key]:group.group==='PROCESS_STEPS_LIST'?'Bind matching current process-stage identity; ten structural slots do not authorize ten invented business steps':group.group==='MATERIALS_LIST'?'Bind current material entry by stable identity, preserving appearance/limitations/care/placement':group.group==='CONTACT'?'Current contact document and business settings; form uses order service':group.group==='WORKSHOPS'?'New optional approved offering; no imported old dates, prices, rooms or availability':'Current document for '+groupRoutes[group.group]+'; semantic section identity mapping, exact protected text and usage; absent slot omitted',
 empty:section.ownsH1?'Use current page heading and accessible non-image layout; unpublished page remains unavailable':'Omit public section; show labelled missing-dependency state in saved Studio preview',oldCopyPrefixes:section.copyPrefixes,oldImageKeys:section.imageKeys,implementation:'not-accepted',visual:'not-run'};
}));
const blockDetails={
 hero:['headline, body, eyebrow, image usage, CTA','single hero slot; current page owns H1'],
 richText:['heading, safe editorial body','bounded typed nodes; no arbitrary HTML/scripts'],
 productGrid:['existing product IDs / category / featured selection','max 12 published products; preserve selected ID order'],
 imageCta:['heading, body, image usage, imageSide, CTA','logical start/end; missing media retains readable copy'],
 faqPicker:['published FAQ IDs','max 12; unavailable answer omitted; existing FAQ text immutable'],
 finalCta:['heading, body, CTA, current business WhatsApp option','single closing slot; no automatic message Send'],
 collectionGrid:['verified collection identities','max 6; current collection visibility and href validation'],
 portfolioGrid:['published portfolio IDs / recent mode','max 6; concept labels on every card; no implied completed work'],
 journalGrid:['published article category and limit','max 6; bounded query; current locale/review state'],
 testimonial:['published classified testimonial ID, variant','fictional label adjacent to text; no rating/schema or customer identity'],
 testimonialGrid:['published classified IDs / featured selection','max 6; fictional/real classifications remain visible on every card'],
 videoHero:['video asset, poster usage, heading, CTA','single hero slot; poster LCP; controls/static fallback; reduced motion'],
 videoStory:['video asset, poster usage, heading, body, side','play on request; no information available only in motion'],
 masonryGallery:['new image usages with alt/captions','max 12; reserve dimensions; preserve subject/crop per usage'],
 bentoGallery:['new image usages with alt/captions','max 6; responsive reading order; no protected gallery reorder'],
 fullscreenGallery:['new image usages with alt/captions','max 12; shared keyboard dialog/lightbox; focus restored'],
};
const landingContracts=source.landingBlocks.map(type=>({type,fields:blockDetails[type][0],constraints:blockDetails[type][1],oldSource:'src/lib/custom-blocks.ts',owner:'new optional versioned landing presentation under current content revision service',empty:'omits missing optional dependency; never imports an old record; editor explains omission',implementation:'not-accepted',visual:'not-run'}));
const destinationRoutes=['','inquiries','analytics','activity','products','categories','media','import','catalog-fill','exports','scraper','research','content-gaps','site-copy','site-images','sections','process','materials','navigation','forms','blog','portfolio','testimonials','faqs','pages','custom-pages','settings','seo','users','subscribers','content-health','content-lab'];
const studioDestinationContracts=read('implementation-tracker.json').studioModules.map((label,index)=>{
 const oldRoute='/studio'+(destinationRoutes[index]?'/'+destinationRoutes[index]:'');
 const contract=routeContracts.find(row=>row.oldRoute===oldRoute);assert.ok(contract);
 return {label,oldRoute,destination:contract.destination,activation:contract.referenceOnly?'excluded':contract.destination.state.startsWith('existing')?'current supported view; detailed parity pending':'activate only after current-service adapter and authorization checks'};
});
assert.equal(studioDestinationContracts.length,32);
const shared=[
 ['header/menu','src/components/storefront/site-header.tsx','src/components/shop/header.tsx','published navigation + shared copy; real current links; focus, Escape, outside click, noscript'],
 ['footer','src/components/storefront/footer.tsx','src/components/shop/shop-frame.tsx','business values and available published navigation; no old contacts'],
 ['search','src/components/storefront/search-overlay.tsx','src/components/shop/header.tsx','current search dialog and query limits; no drafts/private results; restore trigger focus'],
 ['language','src/components/layout/locale-switcher.tsx','src/components/shop/locale-switcher.tsx','enabled public locales and existing reviewed translations; preserve route/selection'],
 ['dialog','src/components/storefront/dialog.tsx','src/components/shop/dialog.tsx','native modal semantics; labelled title, close, Escape, focus trap/return and scroll containment'],
 ['Studio navigation','src/components/studio/sidebar.tsx','src/components/studio/workspace.tsx','five reference groups; active links only for supported/authorized modules; persisted collapse presentation only'],
 ['unsaved changes','src/components/studio/unsaved-changes-dialog.tsx','src/components/studio/content-editor.tsx','existing dirty state/record switch/cancel; failed writes retain local fields'],
 ['loading','src/app/loading.tsx','src/components/page-loading.tsx','reserve destination geometry; readable status, reduced motion; never hide LCP image'],
 ['error/retry','src/app/error.tsx','src/app/studio/error.tsx','safe message; scoped retry; do not duplicate mutation after lost response'],
 ['authorization','src/app/studio/(auth)/login/page.tsx','src/lib/studio-auth.ts','current 401/403, expired-session renewal and no unauthorized data flashes'],
 ['cookie preferences',null,'src/components/shop/shop-frame.tsx','no optional trackers in current frame; implement preference surface only for actual optional storage; never invent tracking consent'],
 ['empty/not found',null,'src/app/not-found.tsx','real route/status semantics and next action; no fixture or draft fallback'],
];
const sharedContracts=shared.map(([name,oldSource,currentSource,contract])=>({name,oldSource,currentSource,contract,oldSourceObserved:oldSource?source.graph.some(file=>file.file===oldSource):false,implementation:'not-accepted',verification:'not-run'}));
for(const row of sharedContracts)assert.ok(existsSync(row.currentSource),row.currentSource);
assert.equal(routeContracts.length,85);assert.equal(sectionContracts.length,74);assert.equal(landingContracts.length,16);
const sheets=routeContracts.map((row,i)=>({id:'PARITY-'+String(i+1).padStart(3,'0'),oldRoute:row.oldRoute,target:row.destination.path,source:row.oldSource,phase:row.phase,viewports:[{width:1440,height:1000},{width:390,height:844}],captures:{old:null,target:null},states:row.referenceOnly?['source-only exclusion']:row.oldRoute.startsWith('/studio')?['loading','empty','populated','long values','unauthorized','expired','failure/retry','dirty/conflict','keyboard','reduced motion']:['published','empty dependencies','long locale','menu/search','keyboard','reduced motion'],contentVariance:'Use existing current content/media/crops on target. Old business facts, customer/record values and product identities are not copied. Review geometry separately from protected text/image differences.',adaptations:['44px touch controls','visible focus','static reduced-motion content','no hidden opening image','semantic headings and real HTTP/auth states'],baselineEvidence:['/','/process','/blog'].includes(row.oldRoute)?'test-results/old-design-migration/reference-baseline.json':null,result:row.referenceOnly?'excluded-source-only':'not-run'}));
writeFileSync(resolve(dir,'implementation-contracts.json'),JSON.stringify({schemaVersion:1,sourceRevision:source.oldRevision,decision:'docs/decisions/2026-10-09-labelled-editorial-content.md',meaning:'M1 specification only. Existing/proposed/conditional/excluded destinations are explicit; this is not implementation or acceptance evidence.',routeContracts,studioDestinationContracts,sectionContracts,landingContracts,sharedContracts,sheets},null,2)+'\n');
console.log(JSON.stringify({routes:routeContracts.length,sections:sectionContracts.length,blocks:landingContracts.length,shared:sharedContracts.length,sheets:sheets.length}));
const escape=value=>String(value??'No active destination').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const cards=sheets.map(sheet=>'<article><p>'+escape(sheet.id)+' · '+escape(sheet.phase)+' · '+escape(sheet.result)+'</p><h2>'+escape(sheet.oldRoute)+'</h2><p>Target: '+escape(sheet.target)+'</p><div class="pair"><section><h3>Before</h3><p>'+escape(sheet.source)+'</p><p>'+(sheet.baselineEvidence?'Opening-viewport baseline captured; see private reference-baseline.json.':'Capture pending; source contract available.')+'</p></section><section><h3>Target</h3><p>Capture pending implementation; never treat this placeholder as acceptance.</p></section></div><p>'+escape(sheet.contentVariance)+'</p><p>Required: '+sheet.states.map(escape).join(' · ')+'</p></article>').join('');
writeFileSync(resolve(dir,'PARITY-ACCEPTANCE-SHEETS.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rivya migration acceptance sheets</title><style>body{margin:auto;max-width:1200px;padding:32px;background:#080a0e;color:#f4f1e9;font:16px/1.6 system-ui}article{border-top:1px solid #6f7680;padding:24px 0;break-inside:avoid}h1{font-size:36px}h2{font-size:24px}p{overflow-wrap:anywhere}.pair{display:grid;grid-template-columns:1fr 1fr;gap:20px}.pair section{padding:20px;background:#08283a;border:1px solid #6f7680} @media(max-width:650px){.pair{grid-template-columns:1fr}}</style><h1>Before / target acceptance sheets</h1><p>M1 specification, 9 October 2026. All 85 source templates have a sheet. Visual implementation acceptance is NOT RUN. Capture both sides at 1440 × 1000 and 390 × 844, then review all long sections in M10. Existing content differs from old content by design and remains protected.</p>'+cards+'</html>');
