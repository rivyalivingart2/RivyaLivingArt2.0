import {publicDiscovery} from './editorial-metadata';
import {publishedOrders} from './editorial-order-store';
import {orderedItems} from './editorial-order';
import 'server-only';
import {cache} from 'react';
import {publishedSource} from './published-source';
import {baselineContent,localizeContent,validContent,type ContentDocument} from './content-model';
import type {Locale} from './site-settings-model';
import {validPageMedia} from './editorial-media-model';
import type {PublicMedia} from './public-media';
import {sharedCopyId} from './shared-copy-model';
import {homepageDependencies} from './homepage-persistence';
import {compileHomepageSnapshot} from './homepage-dependencies';
import {compilePageSnapshot} from './page-dependencies';
import {editorialPublicationIssues,publicEditorial} from './editorial-record-model';
export type PublishedContentDocument=ContentDocument&{imagePosition?:string;publishedRevision?:number;availableEditorialLanguages?:string[];editorialOrders?:Record<string,string[]>};
/** Reads only durable published revisions. Source candidates never become a public fallback.
 * snapshotRoute retains the complete article/route list while compiling dependencies only for the rendered page.
 */
export const publishedContent=cache(async(locale:Locale='en',route?:string,snapshotRoute?:string):Promise<PublishedContentDocument[]>=>{
 const [source,dependencies,orders]=await Promise.all([publishedSource(),homepageDependencies(),publishedOrders()]);
 const images=new Map<string,PublicMedia>();
 for(const row of source.media)if(validPageMedia(row.document)&&row.key===row.document.path)images.set(row.key,row.document);
 const rows=source.content.map(row=>({content_key:row.key,kind:row.kind,route:row.route,published:row.document as ContentDocument,published_version:row.version}));
 const routes=new Set<string>(),documents:PublishedContentDocument[]=[];
 for(const row of rows){
  if(route!==undefined&&row.route!==route)continue;
  const original=row.published,version=Number(row.published_version);
  const d:ContentDocument=original?localizeContent(original,locale):original;
  if(!d||d.id===sharedCopyId||d.id!==row.content_key||d.route!==row.route||d.kind!==row.kind||!Number.isSafeInteger(version)||version<1||!validContent(original,baselineContent.find(b=>b.id===d.id))||routes.has(d.route))continue;
  const coverPath=d.headerImage?.path||d.image;const image=coverPath?images.get(coverPath):undefined;
  if(editorialPublicationIssues(original).length)continue;
  // Only public fields leave the persistence layer. Drafts and extra stored keys never do.
  const publicDocument:PublishedContentDocument={id:d.id,kind:d.kind,route:d.route,title:d.title,eyebrow:d.eyebrow,description:d.description,publishedRevision:version,availableEditorialLanguages:publicDiscovery(original).languages,
   ...(d.discovery?{discovery:d.discovery}:{}),
   sections:d.sections.map(b=>({id:b.id,heading:b.heading,paragraphs:[...b.paragraphs],checklist:b.checklist,body:b.body,enabled:b.enabled,group:b.group,stage:b.stage,layout:b.layout,policyHref:b.policyHref,image:b.image,action:b.action,material:b.material})),
   ...(d.headerImage?{headerImage:d.headerImage}:{}),
   ...(d.featuredArticleIds?{featuredArticleIds:[...d.featuredArticleIds]}:{}),
   ...(d.effectiveDate?{effectiveDate:d.effectiveDate}:{}),
   ...(d.editorial?{editorial:publicEditorial(d.editorial)}:{}),...(d.landing?{landing:d.landing}:{}),
   ...(!d.homepage&&(snapshotRoute===undefined||d.route===snapshotRoute)?{pageSnapshot:compilePageSnapshot(d,dependencies)}:{}),
   ...(image?{image:image.path,imageAlt:d.headerImage?.alt||d.imageAlt||image.alt,imagePosition:image.focalX+'% '+image.focalY+'%'}:{}),
   ...(d.relatedProductIds?{relatedProductIds:[...d.relatedProductIds]}:{}),
   ...(d.translations?{translations:d.translations}:{}),
   // Public references follow current publication/withdrawal. Private saved previews retain their exact snapshot.
   ...(d.homepage&&d.homeSnapshot?.schemaVersion===1&&(snapshotRoute===undefined||d.route===snapshotRoute)?{homepage:d.homepage,homeSnapshot:compileHomepageSnapshot(d,dependencies)}:{})};
  publicDocument.editorialOrders=Object.fromEntries(Object.entries(orders).filter(([key])=>key==='related:'+d.id||d.route==='/journal'&&(key.endsWith(':journal')||key.startsWith('category:journal:'))||d.route==='/faq'&&(key==='faq:groups'||key.endsWith(':faq')||key.startsWith('category:faq:'))));
  if(d.route==='/journal'&&publicDocument.pageSnapshot)publicDocument.pageSnapshot.articles=orderedItems(publicDocument.pageSnapshot.articles,orders['archive:journal']);
  documents.push(publicDocument);
  routes.add(d.route);
 }
 return documents;
});
export async function publishedPage(route:string,locale:Locale='en'){return (await publishedContent(locale,route)).find(d=>d.route===route);}
