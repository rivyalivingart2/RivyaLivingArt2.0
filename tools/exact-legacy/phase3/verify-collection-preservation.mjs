/** Read-only confirmation against the completed f64294f local baseline. */
import assert from 'node:assert/strict';
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import {target, verifyDatabase} from '../local-guard.mjs';
import {reconciliationDigest} from '../reconcile.mjs';
import {collectionRoot, digest} from './prepare-owner-collection.mjs';
const websiteSelection=process.argv.includes('--website-selection');
const prior = JSON.parse(await readFile('test-results/exact-legacy-2026-10-21/phase3-implementation/after-private.json', 'utf8'));
const config = JSON.parse(await readFile('test-results/exact-legacy-2026-10-21/runtime/config.json', 'utf8'));
const {default: pg} = await import(pathToFileURL(config.pgModule).href);
const db = new pg.Client(target), tables = [];
try {
  await db.connect(); await verifyDatabase(db);
  await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
  assert.equal((await db.query('SHOW transaction_read_only')).rows[0].transaction_read_only, 'on');
  for (const original of prior.tables) {
    assert.match(original.table, /^rivya_[a-z_]+$/);
    const rows = (await db.query('SELECT to_jsonb(t) AS data FROM "'+original.table+'" t')).rows.map(r=>r.data);
    const current = {table: original.table, rows: rows.length, digest: reconciliationDigest(rows.map(reconciliationDigest).sort())};
    assert.deepEqual(current, original, 'Existing local table changed: '+original.table); tables.push(current);
  }
  await db.query('ROLLBACK');
} finally { await db.end(); }
for (const file of prior.source) assert.equal(digest(await readFile(file.path)), file.sha256, file.path);
const protectedRows = (await readFile('docs/restoration/exact-legacy-2026-10-21/inventory/protected-source.csv', 'utf8')).trim().split(/\r?\n/).slice(1).map(r=>r.split(',').map(s=>s.replaceAll('"','')));
for (const [path, hash] of protectedRows) assert.equal(digest(await readFile(path)), hash, path);
if(websiteSelection){
 const allowed=new Set(['src/components/shop/homepage-document.tsx','src/components/shop/reference-homepage.tsx','src/components/shop/shop-site.tsx','src/components/shop/portfolio-index.tsx','src/components/shop/owner-creations-gallery.tsx','src/components/shop/owner-creations-preview.tsx','src/components/shop/owner-creations.module.css','src/lib/owner-creations.ts','src/lib/owner-creation-model.ts','src/app/creations/page.tsx','src/app/api/local-creations/[id]/[size]/route.ts','next.config.ts']);
 const changed=execFileSync('git',['diff','--name-only','f64294f','--','src','public','package.json','package-lock.json','next.config.ts'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
 const newFiles=execFileSync('git',['ls-files','--others','--exclude-standard','--','src','public'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
 for(const file of [...changed,...newFiles])assert.ok(allowed.has(file),'Unrelated application change: '+file);
}else assert.equal(execFileSync('git', ['diff','f64294f','--','src','public','package.json','package-lock.json'], {encoding:'utf8'}), '', 'Application and original media untouched');
const report = {at: new Date().toISOString(), scope:'existing synthetic loopback database only; no production connection', readOnly:true, tables:tables.length, rows:tables.reduce((n,t)=>n+t.rows,0), baseline:'f64294f completed local after snapshot', tableDigestsUnchanged:true, originalMediaAndLoginFiles:prior.source.length, protectedByteHashes:protectedRows.length, appSourceUnchanged:!websiteSelection,appChangesScopedToOwnerSelection:websiteSelection,productsAdded:0, archivedImports:0, databaseWrites:0, published:0};
await writeFile(resolve(collectionRoot,websiteSelection?'../phase3-website-selection/preservation-verification.json':'preservation-verification.json'),JSON.stringify(report,null,2)); console.log(JSON.stringify(report));
