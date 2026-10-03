import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import type {DependencyRow,DependencySource} from './homepage-dependencies';
export type PublishedSource=Omit<DependencySource,'content'>&{content:(DependencyRow&{route:string;kind:string})[]};
/** One coherent publication read per render. Never cached across requests or staff mutations. */
export const publishedSource=cache(async():Promise<PublishedSource>=>{
 const rows=await studioDb()`SELECT
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',product_id,'document',published,'version',published_version,'fingerprint',md5(published::text)) ORDER BY product_id) FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL),'[]'::jsonb) AS products,
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',content_key,'route',route,'kind',kind,'document',CASE WHEN content_key='page:home' THEN published-'pageSnapshot' ELSE published-'pageSnapshot'-'homeSnapshot' END,'version',published_version,'fingerprint',md5(published::text)) ORDER BY content_key) FROM rivya_content WHERE visible=true AND published IS NOT NULL),'[]'::jsonb) AS content,
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',path,'document',published,'version',0,'fingerprint',md5(published::text)) ORDER BY path) FROM rivya_public_media WHERE published IS NOT NULL),'[]'::jsonb) AS media`;
 return rows[0] as PublishedSource;
});
