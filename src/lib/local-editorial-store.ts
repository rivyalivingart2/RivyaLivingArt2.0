import {resolve} from 'node:path';
/** Explicitly isolated migration harness only. Never a fallback for missing production storage. */
export function localEditorialRoot(env:NodeJS.ProcessEnv=process.env,cwd=process.cwd()){
 if(env.RIVYA_RESTORATION_LOCAL==='true'){
  if(env.VERCEL||env.RIVYA_QA_TARGET!=='exact-legacy-local'||env.RIVYA_DATA_MODE!=='isolated'||env.DATABASE_URL!=='postgresql://rivya_restoration_qa@localhost:55443/rivya_restoration_local'||env.BLOB_READ_WRITE_TOKEN)throw Error('Local editorial storage requires the isolated restoration target.');
  return resolve(cwd,'test-results/exact-legacy-2026-10-21/runtime/editorial-store');
 }
 if(env.RIVYA_MIGRATION_LOCAL_SQL!=='true')return null;
 if(env.VERCEL||env.RIVYA_QA_TARGET!=='migration-local'||env.RIVYA_DATA_MODE!=='isolated'||env.DATABASE_URL!=='postgresql://rivya_migration_qa@localhost:55439/rivya_migration_local'||env.BLOB_READ_WRITE_TOKEN)throw Error('Local editorial storage requires the isolated loopback QA harness.');
 return resolve(cwd,'test-results/old-design-migration/editorial-store');
}
