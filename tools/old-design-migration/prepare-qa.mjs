import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
import {baselineProducts} from '../../src/lib/shop-model.ts';
import {baselineContent} from '../../src/lib/content-model.ts';
import {approvedPublicMedia} from '../../src/lib/public-media.ts';
import {defaultBusiness} from '../../src/lib/business-settings-model.ts';
import {compileHomepageSnapshot} from '../../src/lib/homepage-dependencies.ts';
import {localTarget,localUrl} from './guard.mjs';

assert.ok(!process.env.VERCEL,'Local preparation only');
const output=resolve('test-results/old-design-migration');
assert.ok(!existsSync(resolve(output,'.env.qa')),'Existing QA configuration must be preserved');
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_MIGRATION_PG_MODULE).href);
const admin=new pg.Client({...localTarget,database:'postgres'});
await admin.connect();
try {
  const identity=(await admin.query('SELECT current_user AS role, host(inet_server_addr()) AS host, inet_server_port() AS port')).rows[0];
  assert.equal(identity.host,localTarget.host);assert.equal(identity.port,localTarget.port);assert.equal(identity.role,localTarget.user);
  assert.equal((await admin.query('SELECT 1 FROM pg_database WHERE datname=$1',[localTarget.database])).rowCount,0,'Never overwrite an existing QA database');
  await admin.query('CREATE DATABASE rivya_migration_local');
} finally {await admin.end();}
const client=new pg.Client(localTarget);await client.connect();
try {
  // Only current application schema and public source fixtures, never old data,
  // remote exports, private customer objects or deployment bootstrap routines.
  for(const file of ['studio-schema.sql','redesign-preview-migration.sql','business-settings-schema.sql','content-schema.sql','revision-schema.sql','storage-provider-schema.sql','phase2-order-contract.sql','phase6-upload-identity.sql','phase11-privacy-controls.sql','phase11-erasure-engine.sql']) await client.query(readFileSync(resolve('scripts',file),'utf8'));
  await client.query('BEGIN');
  const dependencies={products:baselineProducts.map(document=>({key:document.id,version:1,fingerprint:'local-source',document})),content:baselineContent.filter(d=>d.id!=='page:home').map(document=>({key:document.id,version:1,fingerprint:'local-source',document})),media:approvedPublicMedia.map(document=>({key:document.path,version:0,fingerprint:'local-source',document}))};
  for(const product of baselineProducts) await client.query("INSERT INTO rivya_catalogue(product_id,draft,published,version,published_version,visible,updated_by) VALUES($1,$2,$2,1,1,true,'migration-local-source')",[product.id,product]);
  for(const media of approvedPublicMedia) await client.query("INSERT INTO rivya_public_media(path,draft,published,version,updated_by) VALUES($1,$2,$2,1,'migration-local-source')",[media.path,media]);
  for(const candidate of baselineContent) {
    const document=candidate.id==='page:home'?{...candidate,homeSnapshot:compileHomepageSnapshot(candidate,dependencies)}:candidate;
    await client.query("INSERT INTO rivya_content(content_key,kind,route,draft,published,version,published_version,visible,updated_by) VALUES($1,$2,$3,$4,$4,1,1,true,'migration-local-source')",[document.id,document.kind,document.route,document]);
  }
  await client.query("INSERT INTO rivya_business_settings(id,details,version,updated_by) VALUES(1,$1,1,'migration-local-source')",[defaultBusiness]);
  await client.query('COMMIT');
  const config={DATABASE_URL:localUrl,RIVYA_QA_TARGET:'migration-local',RIVYA_DATA_MODE:'isolated',STUDIO_ADMIN_ID:'migration-local-admin',STUDIO_ADMIN_PASSWORD:randomBytes(24).toString('hex'),STUDIO_SESSION_SECRET:randomBytes(32).toString('hex')};
  mkdirSync(output,{recursive:true});writeFileSync(resolve(output,'.env.qa'),Object.entries(config).map(([k,v])=>k+'='+v).join('\n'),{mode:0o600,flag:'wx'});
  console.log(JSON.stringify({localOnly:true,products:baselineProducts.length,content:baselineContent.length,media:approvedPublicMedia.length,privateRecordsCopied:0,remoteWrites:0}));
}catch(error){await client.query('ROLLBACK').catch(()=>{});throw error;}finally{await client.end();}
