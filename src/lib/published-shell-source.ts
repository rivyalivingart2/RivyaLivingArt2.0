import 'server-only';
import {cache} from 'react';
import {studioDb} from './studio-db';
/** Small shared shell read. Published copy and anchor identities only; no customer/staff data. */
export const publishedShellSource=cache(async()=>{
 const rows=await studioDb()`SELECT
  (SELECT jsonb_build_object('details',details,'version',version) FROM rivya_business_settings WHERE id=1) AS business,
  (SELECT jsonb_build_object('published',published,'published_version',published_version) FROM rivya_content WHERE content_key='page:site-copy' AND visible=true AND published IS NOT NULL) AS copy,
  COALESCE((SELECT jsonb_agg(jsonb_build_object('route',route,'sections',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',s->>'id','enabled',s->'enabled')) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(published->'sections')='array' THEN published->'sections' ELSE '[]'::jsonb END) s),'[]'::jsonb),'home_sections',CASE WHEN published->'homepage' IS NOT NULL THEN COALESCE((SELECT jsonb_agg(jsonb_build_object('id',s->>'id','enabled',s->'enabled','contentNeeded',s->'contentNeeded')) FROM jsonb_array_elements(CASE WHEN jsonb_typeof(published->'homepage'->'sections')='array' THEN published->'homepage'->'sections' ELSE '[]'::jsonb END) s),'[]'::jsonb) ELSE NULL END)) FROM rivya_content WHERE visible=true AND published IS NOT NULL AND content_key<>'page:site-copy'),'[]'::jsonb) AS pages,
  COALESCE((SELECT jsonb_agg(jsonb_build_object('slug',published->>'slug')) FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL),'[]'::jsonb) AS products`;
 return rows[0];
});
