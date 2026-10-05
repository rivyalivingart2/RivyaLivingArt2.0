import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
import {verifiedSnapshot} from './verified-snapshot';
import {publicationIdentityQuery,publishedSourceQuery} from './publication-read-query';
import type {DependencyRow,DependencySource} from './homepage-dependencies';
export type PublishedSource=Omit<DependencySource,'content'>&{identity:string;content:(DependencyRow&{route:string;kind:string})[]};
export const publicationIdentity=(source:Pick<PublishedSource,'identity'>)=>source.identity;
/** Only the database-computed digest crosses the connection on a warm read. */
export async function publishedSourceIdentity():Promise<string>{
 const rows=await studioDb().query(publicationIdentityQuery);
 return rows[0].identity as string;
}
/** One coherent database snapshot; identity is derived from these exact rows. */
export async function readPublishedSource():Promise<PublishedSource>{
 const rows=await studioDb().query(publishedSourceQuery);
 return rows[0] as PublishedSource;
}
let sourceReader:{database:string|undefined;read:()=>Promise<PublishedSource>}|undefined;
/** React memoization is render-local. Every cross-request reuse checks a fresh
 * digest and fails closed on storage errors. A changed database gets an empty
 * slot. Private previews retain their own exact captured revision. */
export const publishedSource=cache(async():Promise<PublishedSource>=>{
 const database=process.env.DATABASE_URL;
 if(!sourceReader||sourceReader.database!==database)sourceReader={database,read:verifiedSnapshot(async()=>{const value=await readPublishedSource();return {identity:publicationIdentity(value),value};},publishedSourceIdentity)};
 return sourceReader.read();
});
