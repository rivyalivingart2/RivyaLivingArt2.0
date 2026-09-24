import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {baselineContent,validContent,type ContentDocument} from './content-model';
import {publishedMedia} from './published-media';
export type PublishedContentDocument=ContentDocument&{imagePosition?:string};
/** Reads only durable published revisions. Source candidates never become a public fallback. */
export const publishedContent=cache(async():Promise<PublishedContentDocument[]>=>{
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
  documents.push({id:d.id,kind:d.kind,route:d.route,title:d.title,eyebrow:d.eyebrow,description:d.description,
   sections:d.sections.map(b=>({id:b.id,heading:b.heading,paragraphs:[...b.paragraphs],...(b.checklist?{checklist:[...b.checklist]}:{})})),
   ...(image?{image:image.path,imageAlt:d.imageAlt||image.alt,imagePosition:image.focalX+'% '+image.focalY+'%'}:{}),
   ...(d.relatedProductIds?{relatedProductIds:[...d.relatedProductIds]}:{})});
  routes.add(d.route);
 }
 return documents;
});
export async function publishedPage(route:string){return (await publishedContent()).find(d=>d.route===route);}
