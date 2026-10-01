import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {baselineContent,localizeContent,validContent,type ContentDocument} from './content-model';
import type {Locale} from './site-settings-model';
import {publishedMedia} from './published-media';
import {captureHomepage} from './homepage-persistence';
export type PublishedContentDocument=ContentDocument&{imagePosition?:string;publishedRevision?:number};
/** Reads only durable published revisions. Source candidates never become a public fallback. */
export const publishedContent=cache(async(locale:Locale='en'):Promise<PublishedContentDocument[]>=>{
 const sql=studioDb();
 const [rows,images]=await Promise.all([
  sql`SELECT content_key,kind,route,published,published_version FROM rivya_content WHERE visible=true AND published IS NOT NULL ORDER BY content_key`,
  publishedMedia()
 ]);
 const routes=new Set<string>(),documents:PublishedContentDocument[]=[];
 for(const row of rows){
  const d=row.published,version=Number(row.published_version);
  if(!d||d.id!==row.content_key||d.route!==row.route||d.kind!==row.kind||!Number.isSafeInteger(version)||version<1||!validContent(d,baselineContent.find(b=>b.id===d.id))||routes.has(d.route))continue;
  const image=d.image?images.get(d.image):undefined;
  // Only public fields leave the persistence layer. Drafts and extra stored keys never do.
  const publicDocument:PublishedContentDocument={id:d.id,kind:d.kind,route:d.route,title:d.title,eyebrow:d.eyebrow,description:d.description,publishedRevision:version,
   sections:d.sections.map(b=>({id:b.id,heading:b.heading,paragraphs:[...b.paragraphs],...(b.checklist?{checklist:[...b.checklist]}:{})})),
   ...(image?{image:image.path,imageAlt:d.imageAlt||image.alt,imagePosition:image.focalX+'% '+image.focalY+'%'}:{}),
   ...(d.relatedProductIds?{relatedProductIds:[...d.relatedProductIds]}:{}),
   ...(d.translations?{translations:d.translations}:{}),
   // Public references follow current publication/withdrawal. Private saved previews retain their exact snapshot.
   ...(d.homepage&&d.homeSnapshot?.schemaVersion===1?{homepage:d.homepage,homeSnapshot:await captureHomepage(d)}:{})};
  documents.push(localizeContent(publicDocument,locale));
  routes.add(d.route);
 }
 return documents;
});
export async function publishedPage(route:string,locale:Locale='en'){return (await publishedContent(locale)).find(d=>d.route===route);}
