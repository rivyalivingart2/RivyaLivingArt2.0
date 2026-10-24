/** Additive local Phase 4 evidence. Never accepts a remote database. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {target,verifyDatabase} from '../local-guard.mjs';
import {reconciliationDigest} from '../reconcile.mjs';
const label=process.argv[2];assert.ok(['before','after'].includes(label));
const root=resolve('test-results/exact-legacy-2026-10-21/phase4');mkdirSync(root,{recursive:true});
if(label==='before')assert.ok(!existsSync(resolve(root,'before-private.json')),'Do not replace the baseline');
const config=JSON.parse(readFileSync('test-results/exact-legacy-2026-10-21/runtime/config.json','utf8'));
const {default:pg}=await import(pathToFileURL(config.pgModule).href),db=new pg.Client(target),tables=[];
try{
 await db.connect();await verifyDatabase(db);await db.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');
 const available=(await db.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name")).rows;
 for(const {table_name:name} of available){
  assert.match(name,/^rivya_[a-z_]+$/);
  const rows=(await db.query('SELECT to_jsonb(t) AS data FROM "'+name+'" t')).rows.map(r=>r.data);
  tables.push({name,hashes:rows.map(reconciliationDigest).sort()});
 }
 await db.query('ROLLBACK');
}finally{await db.end();}
const source=execFileSync('git',['ls-files','-z','public','src/app/studio/login','src/lib/studio-auth.ts'],{encoding:'utf8'}).split('\0').filter(Boolean).sort().map(path=>({path,sha256:createHash('sha256').update(readFileSync(path)).digest('hex')}));
const receipt={scope:'SYNTHETIC_LOOPBACK_ONLY',productionVerified:false,at:new Date().toISOString(),tables,source};
writeFileSync(resolve(root,label+'-private.json'),JSON.stringify(receipt,null,2)+'\n');
if(label==='after'){
 const before=JSON.parse(readFileSync(resolve(root,'before-private.json')));
 assert.deepEqual(source,before.source,'Original media/login changed');
 for(const prior of before.tables){
  // Normal sign-in expires/refreshes sessions and updates rate limits.
  // These are transient authentication records, not protected business rows.
  if(['rivya_studio_sessions','rivya_studio_login_limits'].includes(prior.name))continue;
  const now=tables.find(t=>t.name===prior.name);assert.ok(now);
  const counts=new Map();for(const hash of now.hashes)counts.set(hash,(counts.get(hash)||0)+1);
  for(const hash of prior.hashes){assert.ok(counts.get(hash)>0,prior.name+': an existing row changed');counts.set(hash,counts.get(hash)-1);}
  if(!['rivya_public_media','rivya_revisions','rivya_audit','rivya_newsletter_subscribers','rivya_login_attempts'].includes(prior.name))assert.equal(now.hashes.length,prior.hashes.length,prior.name+': unexpected addition');
 }
 textResult({preservedRows:before.tables.filter(t=>!['rivya_studio_sessions','rivya_studio_login_limits'].includes(t.name)).reduce((n,t)=>n+t.hashes.length,0),tables:before.tables.length-2,originalFiles:source.length,transientTables:['rivya_studio_sessions','rivya_studio_login_limits'],added:tables.filter(t=>!['rivya_studio_sessions','rivya_studio_login_limits'].includes(t.name)).map(t=>({table:t.name,rows:t.hashes.length-(before.tables.find(p=>p.name===t.name)?.hashes.length||0)})).filter(t=>t.rows)});
}else textResult({baselineRows:tables.reduce((n,t)=>n+t.hashes.length,0),tables:tables.length,originalFiles:source.length});
function textResult(value){console.log(JSON.stringify(value));}
