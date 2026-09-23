import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import type {ContentDocument} from './content-model';
/** Reads only durable published revisions. Source candidates never become a public fallback. */
export const publishedContent=cache(async():Promise<ContentDocument[]>=>{
 const rows=await studioDb()`SELECT published FROM rivya_content WHERE visible=true AND published IS NOT NULL ORDER BY content_key`;
 return rows.map(r=>r.published as ContentDocument);
});
export async function publishedPage(route:string){return (await publishedContent()).find(d=>d.route===route);}
