/** Read-only local preservation evidence; no production URL/config is accepted. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {target,verifyDatabase} from '../local-guard.mjs';
import {reconciliationDigest} from '../reconcile.mjs';
const label=process.argv[2];assert.ok(['before','after'].includes(label));
const root='test-results/exact-legacy-2026-10-21/phase3';mkdirSync(root,{recursive:true});
const config=JSON.parse(readFileSync('test-results/exact-legacy-2026-10-21/runtime/config.json','utf8'));
const {default:pg}=await import(pathToFileURL(config.pgModule).href);
const db=new pg.Client(target),tables=[],documents={};
const allow=new Set(['rivya_catalogue','rivya_content','rivya_public_media','rivya_editorial_media','rivya_editorial_media_assets','rivya_presentations','rivya_presentation_revisions','rivya_revisions','rivya_business_settings','rivya_inquiries','rivya_references','rivya_inquiry_notes','rivya_studio_orders','rivya_studio_order_events','rivya_newsletter_subscribers','rivya_site_settings']);
try{
 await db.connect();await verifyDatabase(db);await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 assert.equal((await db.query('SHOW transaction_read_only')).rows[0].transaction_read_only,'on');
 const available=(await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name")).rows;
 for(const {table_name:name} of available){
  if(!allow.has(name))continue;
  const rows=(await db.query('SELECT to_jsonb(t) AS data FROM "'+name+'" t')).rows.map(r=>r.data);
  tables.push({table:name,rows:rows.length,digest:reconciliationDigest(rows.map(reconciliationDigest).sort())});
  if(['rivya_catalogue','rivya_content','rivya_public_media'].includes(name))documents[name]=rows;
 }
 await db.query('ROLLBACK');
}finally{await db.end();}
const tracked=execFileSync('git',['ls-files','-z','src','public'],{encoding:'utf8'}).split('\0').filter(Boolean).sort();
const source=tracked.map(path=>({path,sha256:createHash('sha256').update(readFileSync(path)).digest('hex')}));
const receipt={at:new Date().toISOString(),scope:'EXISTING_SYNTHETIC_LOOPBACK_DATABASE_ONLY',readOnly:true,tables,source,documents,productionBaseline:false};
writeFileSync(resolve(root,label+'-private.json'),JSON.stringify(receipt,null,2)+'\n');
if(label==='after'){const before=JSON.parse(readFileSync(resolve(root,'before-private.json'),'utf8'));assert.deepEqual(tables,before.tables);assert.deepEqual(source,before.source);}
console.log(JSON.stringify({label,readOnly:true,tables:tables.map(t=>({table:t.table,rows:t.rows})),protectedSourceAndMediaFiles:source.length,preservationCompared:label==='after',productionAccess:false},null,2));
