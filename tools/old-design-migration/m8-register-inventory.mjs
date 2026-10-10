import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {neon} from '@neondatabase/serverless';
assert.equal(globalThis.__rivyaMigrationLocalSql,true);
const sql=neon(process.env.DATABASE_URL);
const rows=await sql`SELECT content_key AS id,route,draft->>'title' AS title,published->>'title' AS "publishedTitle",COALESCE((SELECT jsonb_agg(value->>'heading') FROM jsonb_array_elements(draft->'sections')),'[]'::jsonb) AS headings,COALESCE((SELECT jsonb_agg(value->>'heading') FROM jsonb_array_elements(published->'sections')),'[]'::jsonb) AS "publishedHeadings" FROM rivya_content ORDER BY content_key LIMIT 2001`;
assert.ok(rows.length<=2000);writeFileSync('test-results/old-design-migration/m8-content-inventory.json',JSON.stringify(rows,null,2)+'\n');console.log(JSON.stringify({readOnly:true,contentRecords:rows.length,includes:'Draft and published titles and section headings; no customer or private evidence fields'}));
