/** Ordered membership, route/kind, revision and full-document fingerprints.
 * No time-based cache or maximum-version shortcut: withdrawal is immediate. */
export const publicationIdentityQuery = `SELECT md5(jsonb_build_array(
 COALESCE((SELECT jsonb_agg(jsonb_build_array(product_id,published_version,md5(published::text)) ORDER BY product_id) FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL),'[]'::jsonb),
 COALESCE((SELECT jsonb_agg(jsonb_build_array(content_key,route,kind,published_version,md5(published::text)) ORDER BY content_key) FROM rivya_content WHERE visible=true AND published IS NOT NULL),'[]'::jsonb),
 COALESCE((SELECT jsonb_agg(jsonb_build_array(path,0,md5(published::text)) ORDER BY path) FROM rivya_public_media WHERE published IS NOT NULL),'[]'::jsonb)
 )::text) AS identity`;

/** The complete data and digest share one PostgreSQL statement/snapshot. */
export const publishedSourceQuery = `SELECT
 (${publicationIdentityQuery}) AS identity,
 COALESCE((SELECT jsonb_agg(jsonb_build_object('key',product_id,'document',published,'version',published_version,'fingerprint',md5(published::text)) ORDER BY product_id) FROM rivya_catalogue WHERE visible=true AND published IS NOT NULL),'[]'::jsonb) AS products,
 COALESCE((SELECT jsonb_agg(jsonb_build_object('key',content_key,'route',route,'kind',kind,'document',(published-'pageSnapshot'-'homeSnapshot') || CASE WHEN content_key='page:home' AND published->'homeSnapshot'->>'schemaVersion'='1' THEN jsonb_build_object('homeSnapshot',jsonb_build_object('schemaVersion',1)) ELSE '{}'::jsonb END,'version',published_version,'fingerprint',md5(published::text)) ORDER BY content_key) FROM rivya_content WHERE visible=true AND published IS NOT NULL),'[]'::jsonb) AS content,
 COALESCE((SELECT jsonb_agg(jsonb_build_object('key',path,'document',published,'version',0,'fingerprint',md5(published::text)) ORDER BY path) FROM rivya_public_media WHERE published IS NOT NULL),'[]'::jsonb) AS media`;
