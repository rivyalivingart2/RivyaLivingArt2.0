import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {neon} from '@neondatabase/serverless';
import {translationFields} from '../../src/lib/translation-review.ts';

// Read only the public English editorial fields; never export drafts or customer records.
const config=parseEnv(readFileSync(process.env.RIVYA_READONLY_CONFIG_PATH,'utf8'));
const target=new URL(config.DATABASE_URL);
assert.equal(target.hostname,'ep-delicate-silence-awjxadrd-pooler.c-12.us-east-1.aws.neon.tech');
assert.equal(target.pathname,'/neondb');
assert.equal(decodeURIComponent(target.username),'rivya_runtime_20260924');
const sql=neon(config.DATABASE_URL);
const [rows]=await sql.transaction([sql`SELECT content_key,version,published_version,draft=published AS aligned,published-'translations'-'homeSnapshot'-'pageSnapshot' AS document FROM rivya_content WHERE visible=true AND published IS NOT NULL AND (published->>'kind'='article' OR route IN ('/architects','/privacy','/terms','/shipping-delivery','/returns-cancellations','/accessibility','/imprint')) ORDER BY content_key`],{readOnly:true,isolationLevel:'RepeatableRead'});
const records=rows.map(r=>({id:r.content_key,route:r.document.route,kind:r.document.kind,version:r.version,publishedVersion:r.published_version,aligned:r.aligned,sourceHash:createHash('sha256').update(JSON.stringify(translationFields(r.document))).digest('hex'),fields:translationFields(r.document),images:{cover:r.document.headerImage||{path:r.document.image,alt:r.document.imageAlt},sections:r.document.sections.filter(s=>s.image).map(s=>({id:s.id,...s.image}))}}));
mkdirSync('test-results/final-acceptance',{recursive:true});
writeFileSync('test-results/final-acceptance/translation-source.json',JSON.stringify({at:new Date().toISOString(),records},null,2));
console.log(JSON.stringify({records:records.length,pages:records.filter(r=>r.kind==='page').length,articles:records.filter(r=>r.kind==='article').length,fields:records.reduce((n,r)=>n+r.fields.length,0),words:records.reduce((n,r)=>n+r.fields.reduce((m,f)=>m+f.source.split(/\s+/).length,0),0)}));
