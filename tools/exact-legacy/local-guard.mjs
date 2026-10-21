import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {readdirSync} from 'node:fs';

export const target=Object.freeze({host:'127.0.0.1',port:55443,user:'rivya_restoration_qa',database:'rivya_restoration_local'});
// Neon derives an HTTP endpoint from this label; a numeric host produces an
// invalid api.0.0.1 URL inside Next's fetch wrapper. SQL still uses target above.
export const localUrl='postgresql://rivya_restoration_qa@localhost:55443/rivya_restoration_local';
export const localRoot=resolve('test-results/exact-legacy-2026-10-21/runtime');
export function localEnvironment(config,inherited=process.env){
 assert.equal(config.DATABASE_URL,localUrl,'Only the fixed restoration loopback database is allowed');
 assert.equal(config.RIVYA_DATA_MODE,'isolated');
 assert.equal(config.RIVYA_QA_TARGET,'exact-legacy-local');
 assert.ok(!config.BLOB_READ_WRITE_TOKEN&&!config.VERCEL&&!config.DATABASE_URL_UNPOOLED,'Remote configuration refused');
 for(const key of ['STUDIO_ADMIN_ID','STUDIO_ADMIN_PASSWORD','STUDIO_SESSION_SECRET'])assert.ok(typeof config[key]==='string'&&config[key].length>=16,'Synthetic local authentication required');
 const env={};
 for(const key of ['PATH','Path','SystemRoot','SYSTEMROOT','WINDIR','COMSPEC','TEMP','TMP','USERPROFILE','APPDATA','LOCALAPPDATA'])if(inherited[key])env[key]=inherited[key];
 for(const key of ['DATABASE_URL','RIVYA_DATA_MODE','RIVYA_QA_TARGET','STUDIO_ADMIN_ID','STUDIO_ADMIN_PASSWORD','STUDIO_SESSION_SECRET'])env[key]=config[key];
 return {...env,RIVYA_ENV:'production',RIVYA_PUBLISHED_PREVIEW:'1',RIVYA_RESTORATION_LOCAL:'true',RIVYA_ORDER_INTAKE_ENABLED:'false',RIVYA_ORDER_MESSAGE_RETRY_ENABLED:'false',BLOB_READ_WRITE_TOKEN:'',DATABASE_URL_UNPOOLED:'',VERCEL:'',NEXT_TELEMETRY_DISABLED:'1',SITE_INDEXABLE:'false',NODE_ENV:'production'};
}
export function assertNoEnvironmentFiles(root=process.cwd()){
 assert.equal(readdirSync(root).filter(name=>/^\.env(?:\.|$)/.test(name)&&name!=='.env.example').length,0,'Next may reload root .env files; use a separate checkout');
}
export async function verifyDatabase(client){
 const row=(await client.query('SELECT current_database() AS database,current_user AS "user",host(inet_server_addr()) AS host,inet_server_port() AS port')).rows[0];
 assert.deepEqual(row,target,'Actual PostgreSQL identity must match the local target');
 assert.equal(resolve((await client.query('SHOW data_directory')).rows[0].data_directory).toLowerCase(),resolve(localRoot,'pgdata').toLowerCase(),'Must use the task-owned cluster');
 return row;
}
