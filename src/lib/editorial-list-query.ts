import {contentSummarySql} from './content-read-query';
/** All values are bound; source candidates are included without persisting or rewriting them. */
export const editorialListQuery=`WITH base AS (
 SELECT content_key,draft,published,version,published_version,visible,updated_at FROM rivya_content
 UNION ALL SELECT value->>'id',value,NULL,0,0,false,NULL FROM jsonb_array_elements($1::jsonb) WHERE NOT EXISTS(SELECT 1 FROM rivya_content WHERE content_key=value->>'id')
), area AS (
 SELECT * FROM base WHERE $2='all' OR $2='journal' AND draft->>'kind'='article'
 OR $2='portfolio' AND draft->'editorial'->>'kind'='portfolio' OR $2='testimonials' AND draft->'editorial'->>'kind'='testimonial'
 OR $2='faqs' AND (draft->'editorial'->>'kind'='faq' OR content_key='page:faq') OR $2='landing-pages' AND draft->'landing' IS NOT NULL
 OR $2='pages' AND draft->>'kind'='page' AND draft->'editorial' IS NULL AND draft->'landing' IS NULL
), filtered AS (
 SELECT * FROM area WHERE ($3='' OR concat_ws(' ',draft->>'title',draft->>'route',draft->>'eyebrow') ILIKE '%'||$3||'%')
 AND ($4='' OR $4='published' AND visible AND published IS NOT NULL OR $4='hidden' AND NOT visible AND published IS NOT NULL OR $4='draft' AND published IS NULL OR $4='changes' AND published IS NOT NULL AND draft<>published)
 AND ($5='' OR $5='needs-author' AND draft->'review'->'authorReview' IS NULL OR $5='needs-native' AND draft->'review'->'native'->'en' IS NULL OR $5='duplicate' AND COALESCE(draft->'review'->>'duplicateOf','')<>'')
 AND ($6='' OR $6='present' AND COALESCE(NULLIF(draft->'review'->>'source',''),NULLIF(draft->'editorial'->'evidence'->>'source',''),NULLIF(draft->'editorial'->>'policyHref','')) IS NOT NULL OR $6='missing' AND COALESCE(NULLIF(draft->'review'->>'source',''),NULLIF(draft->'editorial'->'evidence'->>'source',''),NULLIF(draft->'editorial'->>'policyHref','')) IS NULL)
 AND ($7='' OR $7='cover' AND COALESCE(NULLIF(draft->'headerImage'->>'path',''),NULLIF(draft->>'image','')) IS NULL OR $7='alt' AND COALESCE(NULLIF(draft->'headerImage'->>'path',''),NULLIF(draft->>'image','')) IS NOT NULL AND COALESCE(NULLIF(draft->'headerImage'->>'alt',''),NULLIF(draft->>'imageAlt','')) IS NULL OR $7='seo' AND (COALESCE(draft->>'title','')='' OR COALESCE(draft->>'description','')=''))
 AND ($8='' OR COALESCE(NULLIF(draft->>'eyebrow',''),'Unclassified')=$8)
 AND ($9='' OR COALESCE(NULLIF(draft->'discovery'->>'journey',''),'Unclassified')=$9)
 AND ($10='' OR $10='en' OR draft->'translations'->$10 IS NOT NULL)
 AND ($11='' OR draft->'review'->>'author'=$11)
 AND ($12='' OR updated_at>=NULLIF($12,'')::date::timestamp AT TIME ZONE 'Asia/Kolkata')
 AND ($13='' OR updated_at<(NULLIF($13,'')::date+1)::timestamp AT TIME ZONE 'Asia/Kolkata')
), page AS (
 SELECT *,${contentSummarySql('draft')} AS summary FROM filtered
 ORDER BY CASE WHEN $14='title' THEN lower(draft->>'title') END ASC,CASE WHEN $14='oldest' THEN updated_at END ASC NULLS LAST,CASE WHEN $14='newest' THEN updated_at END DESC NULLS LAST,content_key
 LIMIT 25 OFFSET $15
) SELECT (SELECT count(*)::integer FROM filtered) AS total,
 COALESCE((SELECT jsonb_agg(jsonb_build_object('document',summary,'version',version,'publishedVersion',published_version,'published',CASE WHEN published IS NOT NULL THEN jsonb_build_object('id',content_key) ELSE NULL END,'visible',visible,'detailPending',true,'draftStatus',CASE WHEN published IS NULL THEN CASE WHEN version=0 THEN 'Source candidate' ELSE 'Unpublished draft' END WHEN draft=published THEN 'Aligned' ELSE 'Changes pending' END,'updatedAt',updated_at)) FROM page),'[]'::jsonb) AS entries,
 jsonb_build_object('topics',COALESCE((SELECT jsonb_agg(v) FROM (SELECT DISTINCT COALESCE(NULLIF(draft->>'eyebrow',''),'Unclassified') AS v FROM area ORDER BY v LIMIT 200) t),'[]'::jsonb),'journeys',COALESCE((SELECT jsonb_agg(v) FROM (SELECT DISTINCT COALESCE(NULLIF(draft->'discovery'->>'journey',''),'Unclassified') AS v FROM area ORDER BY v LIMIT 200) t),'[]'::jsonb),'authors',COALESCE((SELECT jsonb_agg(v) FROM (SELECT DISTINCT draft->'review'->>'author' AS v FROM area WHERE NULLIF(draft->'review'->>'author','') IS NOT NULL ORDER BY v LIMIT 200) t),'[]'::jsonb)) AS facets`;
