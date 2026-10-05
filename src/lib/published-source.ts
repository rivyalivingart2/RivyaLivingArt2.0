import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {verifiedSnapshot} from './verified-snapshot';
import type {DependencyRow,DependencySource} from './homepage-dependencies';
export type PublishedSource=Omit<DependencySource,'content'>&{content:(DependencyRow&{route:string;kind:string})[]};
type SourceIdentity={products:Omit<DependencyRow,'document'>[];content:(Omit<DependencyRow,'document'>&{route:string;kind:string})[];media:Omit<DependencyRow,'document'>[]};
export const publicationIdentity=(source:SourceIdentity)=>JSON.stringify([
 source.products.map(r=>[r.key,r.version,r.fingerprint]),
 source.content.map(r=>[r.key,r.route,r.kind,r.version,r.fingerprint]),
 source.media.map(r=>[r.key,r.version,r.fingerprint]),
]);
/** The same ordered publication identities and full-document fingerprints as the
 * complete read, including membership changes, metadata and withdrawn records.
 * Never includes drafts, private customer records or sign-in information.
 */
export async function publishedSourceIdentity():Promise<string>{
 const rows=await studioDb()`SELECT
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',product_id,'version',published_version,'fingerprint',md5(published::text)) ORDER BY product_id) FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL),'[]'::jsonb) AS products,
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',content_key,'route',route,'kind',kind,'version',published_version,'fingerprint',md5(published::text)) ORDER BY content_key) FROM rivya_content WHERE visible=true AND published IS NOT NULL),'[]'::jsonb) AS content,
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',path,'version',0,'fingerprint',md5(published::text)) ORDER BY path) FROM rivya_public_media WHERE published IS NOT NULL),'[]'::jsonb) AS media`;
 return publicationIdentity(rows[0] as SourceIdentity);
}
/** One coherent database snapshot; identity is derived from these exact rows. */
export async function readPublishedSource():Promise<PublishedSource>{
 const rows=await studioDb()`SELECT
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',product_id,'document',published,'version',published_version,'fingerprint',md5(published::text)) ORDER BY product_id) FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL),'[]'::jsonb) AS products,
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',content_key,'route',route,'kind',kind,'document',(published-'pageSnapshot'-'homeSnapshot') || CASE WHEN content_key='page:home' AND published->'homeSnapshot'->>'schemaVersion'='1' THEN jsonb_build_object('homeSnapshot',jsonb_build_object('schemaVersion',1)) ELSE '{}'::jsonb END,'version',published_version,'fingerprint',md5(published::text)) ORDER BY content_key) FROM rivya_content WHERE visible=true AND published IS NOT NULL),'[]'::jsonb) AS content,
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',path,'document',published,'version',0,'fingerprint',md5(published::text)) ORDER BY path) FROM rivya_public_media WHERE published IS NOT NULL),'[]'::jsonb) AS media`;
 return rows[0] as PublishedSource;
}
let sourceReader:{database:string|undefined;read:()=>Promise<PublishedSource>}|undefined;
/** React memoization is render-local. Cross-request reuse requires a new database
 * identity read every time and fails closed if storage is unavailable. A changed
 * database configuration receives a separate empty slot. Saved previews continue
 * to read their captured revision and never use this mutable public snapshot.
 */
export const publishedSource=cache(async():Promise<PublishedSource>=>{
 const database=process.env.DATABASE_URL;
 if(!sourceReader||sourceReader.database!==database)sourceReader={database,read:verifiedSnapshot(async()=>{const value=await readPublishedSource();return {identity:publicationIdentity(value),value};},publishedSourceIdentity)};
 return sourceReader.read();
});
