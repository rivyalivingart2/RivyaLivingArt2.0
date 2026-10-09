import test from 'node:test';
import assert from 'node:assert/strict';
import {assertLocalConfig,localRuntime,localUrl} from '../tools/old-design-migration/guard.mjs';
const config={DATABASE_URL:localUrl,RIVYA_QA_TARGET:'migration-local',RIVYA_DATA_MODE:'isolated',STUDIO_ADMIN_ID:'fixture',STUDIO_ADMIN_PASSWORD:'fixture-only',STUDIO_SESSION_SECRET:'fixture-only'};
test('migration QA refuses remote, wrong-port and previous QA targets',()=>{
  for(const url of ['postgresql://user@host.neon.tech/neondb',localUrl.replace('55439','55432'),localUrl.replace('localhost','example.com'),localUrl.replace('rivya_migration_local','rivya_acceptance_local')]) assert.throws(()=>assertLocalConfig({...config,DATABASE_URL:url}));
  assert.throws(()=>assertLocalConfig({...config,BLOB_READ_WRITE_TOKEN:'fixture'}));
});
test('migration child environment drops inherited live credentials and forces isolated nonindexable reads',()=>{
  const runtime=localRuntime(config,{PATH:'retained',DATABASE_URL:'live',DATABASE_URL_UNPOOLED:'live',BLOB_READ_WRITE_TOKEN:'live',VERCEL_TOKEN:'live',NEON_API_KEY:'live',STUDIO_SESSION_SECRET:'live',RIVYA_ENV:'production',SITE_INDEXABLE:'true'});
  assert.equal(runtime.PATH,'retained');assert.equal(runtime.DATABASE_URL,localUrl);
  assert.equal(runtime.DATABASE_URL_UNPOOLED,'');assert.equal(runtime.BLOB_READ_WRITE_TOKEN,'');
  assert.equal(runtime.VERCEL_TOKEN,undefined);assert.equal(runtime.NEON_API_KEY,undefined);
  assert.equal(runtime.STUDIO_SESSION_SECRET,'fixture-only');assert.equal(runtime.SITE_INDEXABLE,'false');assert.equal(runtime.RIVYA_ENV,undefined);
});
