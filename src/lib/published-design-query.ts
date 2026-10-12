/** One current snapshot of display settings. Never transfer saved preview bodies. */
export const publishedDesignQuery = `SELECT
 (SELECT jsonb_build_object('layout',published->'layout','version',published_version)
  FROM rivya_presentations WHERE presentation_key='presentation:home' AND published IS NOT NULL) AS presentation,
 COALESCE((SELECT jsonb_agg(jsonb_build_object('scope',published->'scope'->>'key','ids',published->'ids') ORDER BY presentation_key)
  FROM rivya_presentations WHERE presentation_key LIKE 'editorial-order:%' AND published IS NOT NULL),'[]'::jsonb) AS orders`;
