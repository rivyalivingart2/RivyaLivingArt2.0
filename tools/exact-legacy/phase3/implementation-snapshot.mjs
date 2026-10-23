/** Read-only local preservation evidence; no production URL/config is accepted. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {target,verifyDatabase} from '../local-guard.mjs';
import {reconciliationDigest} from '../reconcile.mjs';
const label=process.argv[2];assert.ok(['before','after'].includes(label));
const root='test-results/exact-legacy-2026-10-21/phase3-implementation';mkdirSync(root,{recursive:true});
if(label==='before')assert.ok(!existsSync(resolve(root,'before-private.json')),'Never replace the original preservation baseline');
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
  if(['rivya_catalogue','rivya_content','rivya_public_media','rivya_revisions'].includes(name))documents[name]=rows;
 }
 await db.query('ROLLBACK');
}finally{await db.end();}
const tracked=execFileSync('git',['ls-files','-z','public','src/app/studio/login','src/lib/studio-auth.ts'],{encoding:'utf8'}).split('\0').filter(Boolean).sort();
const source=tracked.map(path=>({path,sha256:createHash('sha256').update(readFileSync(path)).digest('hex')}));
const receipt={at:new Date().toISOString(),scope:'EXISTING_SYNTHETIC_LOOPBACK_DATABASE_ONLY',readOnly:true,tables,source,documents,productionBaseline:false};
writeFileSync(resolve(root,label+'-private.json'),JSON.stringify(receipt,null,2)+'\n');
if(label==='after'){
 const before=JSON.parse(readFileSync(resolve(root,'before-private.json'),'utf8'));
 for(const prior of before.tables){
  const current=tables.find(t=>t.table===prior.table);assert.ok(current);
  if(prior.table==='rivya_public_media'){
   const existing=new Set(before.documents.rivya_public_media.map(reconciliationDigest));
   for(const row of before.documents.rivya_public_media)assert.ok(documents.rivya_public_media.some(r=>reconciliationDigest(r)===reconciliationDigest(row)),'Existing media changed');
   const registered=JSON.parse(readFileSync(resolve(root,'registered-assets-private.json'),'utf8')).registered;
   for(const row of documents.rivya_public_media.filter(r=>!existing.has(reconciliationDigest(r)))){assert.equal(row.published,null);assert.deepEqual(row.draft.products,[]);assert.ok(registered.some(r=>r.path===row.path&&r.sha256===row.draft.editorial.sha256),'Unexpected new media');}
  }else if(prior.table==='rivya_revisions'){
   assert.equal(prior.rows,0,'Nonempty baseline revision history needs a full row comparison');
   const registered=JSON.parse(readFileSync(resolve(root,'registered-assets-private.json'),'utf8')).registered;
   for(const row of documents.rivya_revisions)assert.ok(registered.some(r=>Object.values(row).includes(r.path)),'Unexpected revision outside new private image drafts');
  }else assert.deepEqual(current,prior,'Protected table changed: '+prior.table);
 }
 assert.deepEqual(source,before.source);
 const protectedPaths=['src/styles/tokens.css','src/lib/contact.ts','src/lib/business-settings-model.ts','src/lib/shop-model.ts','src/lib/rivya/data.ts','src/lib/reviewed-product-copy.json','src/components/studio/access-shell.tsx','src/components/studio-login.tsx','src/components/studio/studio-access.module.css','src/app/studio/login/page.tsx'];
 for(const path of protectedPaths){const base=execFileSync('git',['show','5545ffb:'+path],{encoding:'utf8'});assert.equal(base.replaceAll('\r\n','\n'),readFileSync(path,'utf8').replaceAll('\r\n','\n'),path);}
 const byteProtected=readFileSync('docs/restoration/exact-legacy-2026-10-21/inventory/protected-source.csv','utf8').trim().split(/\r?\n/).slice(1).map(row=>row.split(',').map(v=>v.replaceAll('"','')));
 for(const [path,expected] of byteProtected)assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'),expected,path);
 writeFileSync(resolve(root,'preservation-verification.json'),JSON.stringify({at:new Date().toISOString(),scope:'existing synthetic loopback data',baselineRows:before.tables.reduce((n,t)=>n+t.rows,0),allExistingRowsUnchanged:true,productsAdded:0,contentWrites:0,approvedMediaWrites:0,originalFilesUnchanged:source.length,additionalProtectedContractsUnchanged:protectedPaths.length,protectedBaselineByteHashes:byteProtected.length,gitTextComparison:'CRLF normalized; separate baseline byte hashes exact',productionAccess:false},null,2));
}
console.log(JSON.stringify({label,readOnly:true,tables:tables.map(t=>({table:t.table,rows:t.rows})),protectedSourceAndMediaFiles:source.length,preservationCompared:label==='after',productionAccess:false},null,2));
