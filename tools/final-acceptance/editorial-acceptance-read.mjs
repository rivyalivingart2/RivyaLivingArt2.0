import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {parseEnv} from 'node:util';import assert from 'node:assert/strict';import {neon} from '@neondatabase/serverless';
import {translationStatus} from '../../src/lib/translation-review.ts';
const config=parseEnv(readFileSync(process.env.RIVYA_READONLY_CONFIG_PATH,'utf8')),target=new URL(config.DATABASE_URL);
assert.equal(target.hostname,'ep-delicate-silence-awjxadrd-pooler.c-12.us-east-1.aws.neon.tech');assert.equal(target.pathname,'/neondb');assert.equal(decodeURIComponent(target.username),'rivya_runtime_20260924');
const sql=neon(config.DATABASE_URL);
const [content,media,products,fingerprints]=await sql.transaction([
 sql`SELECT content_key,version,published_version,draft=published AS aligned,published-'homeSnapshot'-'pageSnapshot' AS document FROM rivya_content WHERE visible=true AND published IS NOT NULL ORDER BY content_key`,
 sql`SELECT path,version,published->>'alt' AS alt,published->>'focalX' AS x,published->>'focalY' AS y,published->'products' AS products FROM rivya_public_media WHERE published IS NOT NULL ORDER BY path`,
 sql`SELECT product_id,published->>'name' AS name,published->>'slug' AS slug,published->>'image' AS image,published->>'scene' AS scene,published->'gallery' AS gallery FROM rivya_catalogue ORDER BY product_id`,
 sql`SELECT (SELECT md5(string_agg(row_to_json(c)::text,'' ORDER BY product_id)) FROM rivya_catalogue c) AS catalogue_hash,(SELECT md5(string_agg(row_to_json(m)::text,'' ORDER BY path)) FROM rivya_public_media m WHERE path NOT LIKE '/editorial/%') AS media_hash,(SELECT md5(string_agg(row_to_json(b)::text,'' ORDER BY id)) FROM rivya_business_settings b) AS business_hash`
],{readOnly:true,isolationLevel:'RepeatableRead'});
const records=content.map(r=>({id:r.content_key,route:r.document.route,kind:r.document.kind,title:r.document.title,version:r.version,publishedVersion:r.published_version,aligned:r.aligned,hi:translationStatus(r.document,'hi'),gu:translationStatus(r.document,'gu'),images:{cover:r.document.headerImage||{path:r.document.image,alt:r.document.imageAlt},sections:r.document.sections.filter(s=>s.image).map(s=>({id:s.id,...s.image})),home:r.document.homepage?{hero:r.document.homepage.heroImage,sections:r.document.homepage.sections.map(s=>({id:s.id,image:s.image,items:s.items?.filter(i=>i.image).map(i=>({id:i.id,image:i.image}))}))}:undefined}}));
mkdirSync('test-results/final-acceptance',{recursive:true});
writeFileSync('test-results/final-acceptance/editorial-acceptance-read.json',JSON.stringify({at:new Date().toISOString(),scope:'Public editorial text/status and media metadata only. No customer records, drafts or mutation.',records,media,products,fingerprints:fingerprints[0]},null,2));
console.log(JSON.stringify({pages:records.filter(r=>r.kind==='page').length,articles:records.filter(r=>r.kind==='article').length,reviewedBoth:records.filter(r=>r.hi.state==='reviewed'&&r.gu.state==='reviewed').length,media:media.length,products:products.length}));
