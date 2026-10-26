import 'server-only';
import {studioDb} from './studio-db';
import {subscriberPageSize,type SubscriberFilters,type SubscriberRow,type SubscriberPage} from './subscriber-model';
import {getOperationsAdapter} from './google-workspace/operations-adapter';
/** One snapshot supplies totals and the clamped page, even for an empty result. */
export async function readSubscribers(f:SubscriberFilters,exportAll=false):Promise<SubscriberPage>{
 const adapter = getOperationsAdapter();
 if (adapter) {
  return adapter.readNewsletterSubscribers(f, exportAll);
 }
 const result=await studioDb()`WITH filtered AS (
  SELECT email,source,created_at FROM rivya_newsletter_subscribers
  WHERE position(lower(${f.q}) in lower(email))>0
   AND (${f.source}='' OR source=${f.source})
   AND (NULLIF(${f.from},'')::date IS NULL OR created_at>=(NULLIF(${f.from},'')::date::timestamp AT TIME ZONE 'UTC'))
   AND (NULLIF(${f.to},'')::date IS NULL OR created_at<((NULLIF(${f.to},'')::date+1)::timestamp AT TIME ZONE 'UTC'))
 ), totals AS (SELECT count(*)::int AS total FROM filtered), bounds AS (
  SELECT total,greatest(1,ceil(total::numeric/${subscriberPageSize}))::int AS pages,
   least(${f.page},greatest(1,ceil(total::numeric/${subscriberPageSize})))::int AS page FROM totals
 ) SELECT total,pages,page,coalesce((SELECT jsonb_agg(to_jsonb(r)) FROM (
  SELECT email,source,to_char(created_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS "createdAt" FROM filtered
  ORDER BY CASE WHEN ${f.sort}='newest' THEN created_at END DESC,
   CASE WHEN ${f.sort}='oldest' THEN created_at END ASC,email ASC
  LIMIT CASE WHEN ${exportAll} THEN NULL::int ELSE ${subscriberPageSize} END
  OFFSET CASE WHEN ${exportAll} THEN 0 ELSE (bounds.page-1)*${subscriberPageSize} END
 ) r),'[]'::jsonb) AS rows FROM bounds`;
 const r=result[0];return {total:Number(r.total),pages:Number(r.pages),page:Number(r.page),pageSize:subscriberPageSize,rows:r.rows as SubscriberRow[]};
}
