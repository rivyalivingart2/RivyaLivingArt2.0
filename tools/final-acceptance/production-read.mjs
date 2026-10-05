import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {neon} from '@neondatabase/serverless';
import assert from 'node:assert/strict';
import {contentReadQuery} from '../../src/lib/content-read-query.ts';
import {publicationIdentityQuery} from '../../src/lib/publication-read-query.ts';
import {translationStatus} from '../../src/lib/translation-review.ts';
const config=parseEnv(readFileSync(process.env.RIVYA_READONLY_CONFIG_PATH,'utf8'));
const target=new URL(config.DATABASE_URL);
assert.equal(target.hostname,'ep-delicate-silence-awjxadrd-pooler.c-12.us-east-1.aws.neon.tech');assert.equal(target.pathname,'/neondb');assert.equal(decodeURIComponent(target.username),'rivya_runtime_20260924');assert.equal(config.RIVYA_DATA_MODE,'shared');
const sql=neon(config.DATABASE_URL);
const [identity,protectedRows,content,transfer,editorialMedia,translationRows]=await sql.transaction([
 sql`SELECT current_database() AS database,current_user AS role`,
 sql`SELECT (SELECT count(*)::integer FROM rivya_catalogue) AS products,(SELECT count(*)::integer FROM rivya_public_media) AS media,(SELECT count(*)::integer FROM rivya_content) AS content,(SELECT md5(string_agg(row_to_json(c)::text,'' ORDER BY product_id)) FROM rivya_catalogue c) AS catalogue_hash,(SELECT md5(string_agg(row_to_json(m)::text,'' ORDER BY path)) FROM rivya_public_media m) AS media_hash,(SELECT md5(string_agg(row_to_json(b)::text,'' ORDER BY id)) FROM rivya_business_settings b) AS business_hash`,
 sql`SELECT content_key,route,version,published_version,visible,draft=published AS aligned,md5(draft::text) AS draft_hash,md5(published::text) AS published_hash,published->'headerImage'->>'path' AS header_image,published->>'image' AS fallback_image,COALESCE((SELECT jsonb_agg(jsonb_build_object('id',s->>'id','heading',s->>'heading','image',s->'image'->>'path')) FROM jsonb_array_elements(published->'sections') s),'[]'::jsonb) AS sections,published->'translations' IS NOT NULL AS has_translations FROM rivya_content ORDER BY content_key`,
 sql.query(`SELECT (SELECT sum(octet_length(jsonb_build_array(draft,published)::text)) FROM rivya_content) AS full_document_bytes,(SELECT octet_length(jsonb_agg(t)::text) FROM (${contentReadQuery}) t) AS compact_row_bytes,(SELECT octet_length(identity) FROM (${publicationIdentityQuery}) p) AS warm_identity_bytes`,[true,null]),
 sql`SELECT path,version,published->>'alt' AS alt,published->'products' AS products FROM rivya_public_media WHERE path LIKE '/editorial/%' ORDER BY path`,
 sql`SELECT content_key,published-'homeSnapshot'-'pageSnapshot' AS document FROM rivya_content WHERE published->'translations' IS NOT NULL ORDER BY content_key`
],{readOnly:true,isolationLevel:'RepeatableRead'});
const routes=['/','/collectible-design','/memory-art','/personal-art','/pieces/river-channel','/commission/customize','/process','/our-story','/materials-care','/journal','/contact','/imprint','/privacy','/terms','/portfolio','/robots.txt','/sitemap.xml'];
const pages=[];
for(const path of routes){const start=performance.now();const response=await fetch('https://www.rivyalivingart.com'+path,{redirect:'manual',signal:AbortSignal.timeout(30000)});const body=await response.text();pages.push({path,status:response.status,ms:Math.round(performance.now()-start),bytes:Buffer.byteLength(body),title:body.match(/<title>(.*?)<\/title>/)?.[1],noindex:/<meta name="robots" content="[^"]*noindex/.test(body),hasImprintLink:body.includes('href="/imprint"'),hasCanonical:/<link rel="canonical"/.test(body),...(path==='/robots.txt'?{robots:body}:{})});}
const originalMedia=await sql`SELECT count(*)::integer AS count,md5(string_agg(row_to_json(m)::text,'' ORDER BY path)) AS hash FROM rivya_public_media m WHERE path NOT LIKE '/editorial/%'`;
const report={at:new Date().toISOString(),scope:'One read-only database transaction plus original-media aggregate; bounded anonymous HTTP reads. No content/customer/session mutations.',identity:identity[0],protected:protectedRows[0],originalMedia:originalMedia[0],editorialMedia,content,translations:translationRows.map(row=>({id:row.content_key,hi:translationStatus(row.document,'hi'),gu:translationStatus(row.document,'gu')})),transfer:transfer[0],pages};
mkdirSync('test-results/final-acceptance',{recursive:true});writeFileSync('test-results/final-acceptance/production-read.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({at:report.at,counts:{products:report.protected.products,media:report.protected.media,content:report.protected.content},transfer:report.transfer,translatedRecords:content.filter(c=>c.has_translations).length,pages:pages.map(({path,status,noindex,hasImprintLink})=>({path,status,noindex,hasImprintLink}))}));
