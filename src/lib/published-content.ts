import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {baselineContent,localizeContent,validContent,type ContentDocument} from './content-model';
import type {Locale} from './site-settings-model';
import {publishedMedia} from './published-media';
import {sharedCopyId} from './shared-copy-model';
import {homepageDependencies} from './homepage-persistence';
import {compileHomepageSnapshot} from './homepage-dependencies';
import {compilePageSnapshot} from './page-dependencies';
export type PublishedContentDocument=ContentDocument&{imagePosition?:string;publishedRevision?:number};
/** Reads only durable published revisions. Source candidates never become a public fallback. */
export const publishedContent=cache(async(locale:Locale='en'):Promise<PublishedContentDocument[]>=>{
 const sql=studioDb();
 const [rows,images,dependencies]=await Promise.all([
  sql`SELECT content_key,kind,route,published-'pageSnapshot' AS published,published_version FROM rivya_content WHERE visible=true AND published IS NOT NULL ORDER BY content_key`,
  publishedMedia(),homepageDependencies()
 ]);
 const routes=new Set<string>(),documents:PublishedContentDocument[]=[];
 for(const row of rows){
  const original=row.published,version=Number(row.published_version);
  const d:ContentDocument=original?localizeContent(original,locale):original;
  if(!d||d.id===sharedCopyId||d.id!==row.content_key||d.route!==row.route||d.kind!==row.kind||!Number.isSafeInteger(version)||version<1||!validContent(original,baselineContent.find(b=>b.id===d.id))||routes.has(d.route))continue;
  const coverPath=d.headerImage?.path||d.image;const image=coverPath?images.get(coverPath):undefined;
  // Only public fields leave the persistence layer. Drafts and extra stored keys never do.
  const publicDocument:PublishedContentDocument={id:d.id,kind:d.kind,route:d.route,title:d.title,eyebrow:d.eyebrow,description:d.description,publishedRevision:version,
   sections:d.sections.map(b=>({id:b.id,heading:b.heading,paragraphs:[...b.paragraphs],checklist:b.checklist,body:b.body,enabled:b.enabled,group:b.group,stage:b.stage,layout:b.layout,policyHref:b.policyHref,image:b.image,action:b.action,material:b.material})),
   ...(d.headerImage?{headerImage:d.headerImage}:{}),
   ...(d.featuredArticleIds?{featuredArticleIds:[...d.featuredArticleIds]}:{}),
   ...(d.effectiveDate?{effectiveDate:d.effectiveDate}:{}),
   ...(!d.homepage?{pageSnapshot:compilePageSnapshot(d,dependencies)}:{}),
   ...(image?{image:image.path,imageAlt:d.headerImage?.alt||d.imageAlt||image.alt,imagePosition:image.focalX+'% '+image.focalY+'%'}:{}),
   ...(d.relatedProductIds?{relatedProductIds:[...d.relatedProductIds]}:{}),
   ...(d.translations?{translations:d.translations}:{}),
   // Public references follow current publication/withdrawal. Private saved previews retain their exact snapshot.
   ...(d.homepage&&d.homeSnapshot?.schemaVersion===1?{homepage:d.homepage,homeSnapshot:compileHomepageSnapshot(d,dependencies)}:{})};
  documents.push(publicDocument);
  routes.add(d.route);
 }
 return documents;
});
export async function publishedPage(route:string,locale:Locale='en'){return (await publishedContent(locale)).find(d=>d.route===route);}
