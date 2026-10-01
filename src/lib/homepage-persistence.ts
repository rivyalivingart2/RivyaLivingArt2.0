import 'server-only';
import {studioDb} from './studio-db';
import {compileHomepageSnapshot,type DependencySource} from './homepage-dependencies';
import type {ContentDocument} from './content-model';

export async function homepageDependencies(){
 const rows=await studioDb()`SELECT
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',product_id,'document',published,'version',published_version,'fingerprint',md5(published::text))) FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL),'[]'::jsonb) AS products,
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',content_key,'document',published,'version',published_version,'fingerprint',md5(published::text))) FROM rivya_content WHERE visible=true AND published IS NOT NULL AND content_key<>'page:home'),'[]'::jsonb) AS content,
  COALESCE((SELECT jsonb_agg(jsonb_build_object('key',path,'document',published,'version',0,'fingerprint',md5(published::text))) FROM rivya_public_media WHERE published IS NOT NULL),'[]'::jsonb) AS media`;
 return rows[0] as DependencySource;
}
export async function captureHomepage(document:ContentDocument){return compileHomepageSnapshot(document,await homepageDependencies());}
