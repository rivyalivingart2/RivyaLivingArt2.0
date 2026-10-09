import {isDiscoveryRoute,discoveryTier} from './detailed-pages';
import type {ShopProduct} from './shop-model';
import {baselineContent,validContent,type ContentDocument} from './content-model';
import {compileHomepageSnapshot,type DependencySource} from './homepage-dependencies';
import type {HomeSnapshot,EditorialUsage} from './homepage-model';
import {bodyLinks} from './editorial-body';
import {compileLanding,landingProductIds,landingActions,publicEntry,type LandingSnapshot,type LandingEntry} from './landing-dependencies';
import {editorialPublicationIssues} from './editorial-record-model';
export type PageSnapshot=HomeSnapshot&{availableRoutes?:string[];image?:{path:string;alt:string;position:string};landing?:LandingSnapshot;discovery?:LandingEntry[];faqEntries?:LandingEntry[]};
export function sectionHrefs(d:ContentDocument){return [...d.sections.filter(s=>s.enabled!==false).flatMap(s=>[...bodyLinks(s.body),...(s.policyHref?[s.policyHref]:[]),...(s.action?[s.action.href]:[])]),...(d.editorial?.policyHref?[d.editorial.policyHref]:[]),...landingActions(d.landing?.blocks||[])];}
/** Reuse the same public projection and dependency gate as home. Older revisions stay readable. */
export function compilePageSnapshot(document:ContentDocument,source:DependencySource,options:{includeCatalogue?:boolean}={}):PageSnapshot{
 const tier=discoveryTier(document.route),landing=compileLanding(document,source);
 const related=isDiscoveryRoute(document.route)&&options.includeCatalogue!==false?source.products.filter(r=>!tier||(r.document as ShopProduct).tier===tier).map(r=>r.key):document.relatedProductIds||[];const coverPath=document.headerImage?.path||document.image;
 const recommendations=source.content.map(r=>r.document as ContentDocument).filter(d=>d?.kind==='article'&&d.id!==document.id).sort((a,b)=>Number(b.eyebrow===document.eyebrow)-Number(a.eyebrow===document.eyebrow)).slice(0,3);
 const visible=document.sections.filter(s=>s.enabled!==false);
 const faqDocuments=document.route==='/faq'?source.content.filter(r=>validContent(r.document,baselineContent.find(b=>b.id===r.key))&&(r.document as ContentDocument).editorial?.kind==='faq'&&!editorialPublicationIssues(r.document as ContentDocument).length).map(r=>r.document as ContentDocument):[];
 const actions=[...sectionHrefs(document),...landing.hrefs,...faqDocuments.flatMap(sectionHrefs)].filter(h=>h.split('#')[0]!==document.route).map(href=>({label:href,href}));
 const synthetic:ContentDocument={...document,homepage:{schemaVersion:1,heroProductId:related[0]||'',primary:{label:'Home',href:'/'},secondary:{label:'Home',href:'/'},annotation:'',strip:[],sections:[
  {id:'references',type:'story',enabled:true,eyebrow:'',productIds:[...new Set([...related,...landingProductIds(document,source)])],articleIds:['/journal','/search'].includes(document.route)?[...new Set([...(document.featuredArticleIds||[]),...source.content.filter(r=>(r.document as ContentDocument).kind==='article').map(r=>r.key)])]:document.kind==='article'?recommendations.map(a=>a.id):[],items:actions.map((action,i)=>({id:'link-'+i,title:action.label,body:'',action}))},
  ...visible.filter(s=>s.image).map(s=>({id:s.id,type:'story' as const,enabled:true,eyebrow:'',image:s.image})),
  ...(coverPath?[{id:'cover',type:'story' as const,enabled:true,eyebrow:'',image:document.headerImage||{path:coverPath,alt:document.imageAlt||'',caption:'',desktop:{x:50,y:50,ratio:'3/2'},mobile:{x:50,y:50,ratio:'4/5'}} as EditorialUsage}]:[])
 ]}};
 const snapshot=compileHomepageSnapshot(synthetic,source);
 snapshot.dependencies.push(...landing.dependencies.filter(d=>!snapshot.dependencies.some(e=>e.kind===d.kind&&e.key===d.key)));
 snapshot.mediaPaths=[...new Set([...snapshot.mediaPaths,...landing.mediaPaths])];
 snapshot.issues.push(...landing.issues,...editorialPublicationIssues(document));
 const discovery=document.route==='/search'?source.content.filter(r=>validContent(r.document,baselineContent.find(b=>b.id===r.key))&&!editorialPublicationIssues(r.document as ContentDocument).length).map(r=>r.document as ContentDocument).filter(d=>d.editorial?.kind==='portfolio'||['/collectible-design','/memory-art','/personal-art'].includes(d.route)).map(publicEntry):undefined;
 if(discovery)for(const entry of discovery){const row=source.content.find(r=>r.key===entry.id)!;if(!snapshot.dependencies.some(d=>d.kind==='content'&&d.key===row.key))snapshot.dependencies.push({kind:'content',key:row.key,version:row.version,fingerprint:row.fingerprint});}
 const faqEntries=document.route==='/faq'?source.content.filter(r=>validContent(r.document,baselineContent.find(b=>b.id===r.key))&&(r.document as ContentDocument).editorial?.kind==='faq'&&!editorialPublicationIssues(r.document as ContentDocument).length).map(r=>{snapshot.dependencies.push({kind:'content',key:r.key,version:r.version,fingerprint:r.fingerprint});return publicEntry(r.document as ContentDocument);}):undefined;
 if(isDiscoveryRoute(document.route))snapshot.products.sort((a,b)=>a.id.localeCompare(b.id,'en'));
 if(document.route==='/journal')snapshot.articles.sort((a,b)=>a.id.localeCompare(b.id,'en'));
 // The generic template has no hero product; exclude the synthetic empty identity.
 snapshot.issues=snapshot.issues.filter(issue=>issue!=='Product  is not available in the published catalogue.');
 for(const href of sectionHrefs(document))if(href.startsWith(document.route+'#')&&!visible.some(s=>s.id===href.split('#')[1])){snapshot.issues.push('Missing section: '+href);snapshot.unavailableActionHrefs?.push(href);}
 const cover=source.media.find(r=>r.key===coverPath)?.document as {path:string;alt:string;focalX:number;focalY:number}|undefined;
 return {...snapshot,...(document.landing?{landing:landing.snapshot}:{}),...(discovery?{discovery}:{}),...(faqEntries?{faqEntries}:{}),availableRoutes:source.content.filter(r=>validContent(r.document,baselineContent.find(b=>b.id===r.key))).map(r=>(r.document as ContentDocument).route),...(cover&&snapshot.mediaPaths.includes(cover.path)?{image:{path:cover.path,alt:document.imageAlt||cover.alt,position:cover.focalX+'% '+cover.focalY+'%'}}:{})};
}
export const editorialDocument=(document:ContentDocument)=>{const d={...document};delete d.homeSnapshot;delete d.pageSnapshot;return d;};
