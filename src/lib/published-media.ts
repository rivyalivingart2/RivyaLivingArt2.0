import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {validMedia,type PublicMedia} from './public-media';

/** Deduplicate public-media reads within one server render, never across users or requests. */
export const publishedMedia=cache(async()=>{
 const rows=await studioDb()`SELECT path,published FROM rivya_public_media WHERE published IS NOT NULL`;
 const images=new Map<string,PublicMedia>();
 for(const row of rows)if(validMedia(row.published)&&row.path===row.published.path)images.set(row.path,row.published);
 return images;
});
