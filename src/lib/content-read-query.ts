// Fixed SQL fragments only. Request values are bound parameters, never SQL text.
export const contentSummarySql = (column: 'draft' | 'published') => `jsonb_build_object(
 'id',${column}->'id','kind',${column}->'kind','route',${column}->'route',
 'editorial',CASE WHEN ${column}->'editorial' IS NOT NULL THEN jsonb_build_object('schemaVersion',1,'kind',${column}->'editorial'->'kind','classification',${column}->'editorial'->'classification') ELSE NULL END,
 'landing',CASE WHEN ${column}->'landing' IS NOT NULL THEN jsonb_build_object('schemaVersion',1,'blocks','[]'::jsonb) ELSE NULL END,
 'title',${column}->'title','eyebrow',${column}->'eyebrow','description','',
 'sections',COALESCE((SELECT jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
  'id',section->'id','heading',section->'heading','group',section->'group','paragraphs','[]'::jsonb)) ORDER BY position)
  FROM jsonb_array_elements(${column}->'sections') WITH ORDINALITY AS sections(section,position)),'[]'::jsonb))`;

/** $1: compact editor list; $2: selected record, or null. Equality runs before
 * projection so snapshot-only, translation-only and body-only edits stay visible. */
export const contentReadQuery = `SELECT content_key,version,published_version,visible,
 ($1::boolean AND content_key IS DISTINCT FROM $2::text) AS detail_pending,
 CASE WHEN published IS NULL THEN CASE WHEN version=0 THEN 'Source candidate' ELSE 'Unpublished draft' END
  WHEN draft=published THEN 'Aligned' ELSE 'Changes pending' END AS draft_status,
 CASE WHEN $1::boolean AND content_key IS DISTINCT FROM $2::text THEN ${contentSummarySql('draft')} ELSE draft END AS draft,
 CASE WHEN published IS NULL THEN NULL
  WHEN $1::boolean AND content_key IS DISTINCT FROM $2::text THEN ${contentSummarySql('published')} ELSE published END AS published
 FROM rivya_content WHERE $1::boolean OR $2::text IS NULL OR content_key=$2::text ORDER BY content_key`;
