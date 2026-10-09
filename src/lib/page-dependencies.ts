import {isDiscoveryRoute,discoveryTier} from './detailed-pages';
import type {ShopProduct} from './shop-model';
import {baselineContent,validContent,type ContentDocument} from './content-model';
import {compileHomepageSnapshot,type DependencySource} from './homepage-dependencies';
import type {HomeSnapshot,EditorialUsage} from './homepage-model';
import {bodyLinks} from './editorial-body';
export type PageSnapshot=HomeSnapshot&{availableRoutes?:string[];image?:{path:string;alt:string;position:string}};
export function sectionHrefs(d:ContentDocument){return d.sections.filter(s=>s.enabled!==false).flatMap(s=>[...bodyLinks(s.body),...(s.policyHref?[s.policyHref]:[]),...(s.action?[s.action.href]:[])]);}
/** Reuse the same public projection and dependency gate as home. Older revisions stay readable. */
export function compilePageSnapshot(document:ContentDocument,source:DependencySource,options:{includeCatalogue?:boolean}={}):PageSnapshot{
 const tier=discoveryTier(document.route);
 const related=isDiscoveryRoute(document.route)&&options.includeCatalogue!==false?source.products.filter(r=>!tier||(r.document as ShopProduct).tier===tier).map(r=>r.key):document.relatedProductIds||[];const coverPath=document.headerImage?.path||document.image;
 const recommendations=source.content.map(r=>r.document as ContentDocument).filter(d=>d?.kind==='article'&&d.id!==document.id).sort((a,b)=>Number(b.eyebrow===document.eyebrow)-Number(a.eyebrow===document.eyebrow)).slice(0,3);
 const visible=document.sections.filter(s=>s.enabled!==false);
 const actions=sectionHrefs(document).filter(h=>h.split('#')[0]!==document.route).map(href=>({label:href,href}));
 const synthetic:ContentDocument={...document,homepage:{schemaVersion:1,heroProductId:related[0]||'',primary:{label:'Home',href:'/'},secondary:{label:'Home',href:'/'},annotation:'',strip:[],sections:[
  {id:'references',type:'story',enabled:true,eyebrow:'',productIds:related,articleIds:document.route==='/journal'?[...new Set([...(document.featuredArticleIds||[]),...source.content.filter(r=>(r.document as ContentDocument).kind==='article').map(r=>r.key)])]:document.kind==='article'?recommendations.map(a=>a.id):[],items:actions.map((action,i)=>({id:'link-'+i,title:action.label,body:'',action}))},
  ...visible.filter(s=>s.image).map(s=>({id:s.id,type:'story' as const,enabled:true,eyebrow:'',image:s.image})),
  ...(coverPath?[{id:'cover',type:'story' as const,enabled:true,eyebrow:'',image:document.headerImage||{path:coverPath,alt:document.imageAlt||'',caption:'',desktop:{x:50,y:50,ratio:'3/2'},mobile:{x:50,y:50,ratio:'4/5'}} as EditorialUsage}]:[])
 ]}};
 const snapshot=compileHomepageSnapshot(synthetic,source);
 if(isDiscoveryRoute(document.route))snapshot.products.sort((a,b)=>a.id.localeCompare(b.id,'en'));
 if(document.route==='/journal')snapshot.articles.sort((a,b)=>a.id.localeCompare(b.id,'en'));
 // The generic template has no hero product; exclude the synthetic empty identity.
 snapshot.issues=snapshot.issues.filter(issue=>issue!=='Product  is not available in the published catalogue.');
 for(const href of sectionHrefs(document))if(href.startsWith(document.route+'#')&&!visible.some(s=>s.id===href.split('#')[1])){snapshot.issues.push('Missing section: '+href);snapshot.unavailableActionHrefs?.push(href);}
 const cover=source.media.find(r=>r.key===coverPath)?.document as {path:string;alt:string;focalX:number;focalY:number}|undefined;
 return {...snapshot,availableRoutes:source.content.filter(r=>validContent(r.document,baselineContent.find(b=>b.id===r.key))).map(r=>(r.document as ContentDocument).route),...(cover&&snapshot.mediaPaths.includes(cover.path)?{image:{path:cover.path,alt:document.imageAlt||cover.alt,position:cover.focalX+'% '+cover.focalY+'%'}}:{})};
}
export const editorialDocument=(document:ContentDocument)=>{const d={...document};delete d.homeSnapshot;delete d.pageSnapshot;return d;};
