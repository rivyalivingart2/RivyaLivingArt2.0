import {spawn} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {localRuntime,localTarget} from './guard.mjs';
const config=parseEnv(readFileSync('test-results/old-design-migration/.env.qa','utf8'));
const env=localRuntime(config);
env.RIVYA_MIGRATION_LOCAL_SQL='true';
env.RIVYA_MIGRATION_PG_MODULE=process.env.RIVYA_MIGRATION_PG_MODULE;
const {default:pg}=await import(pathToFileURL(env.RIVYA_MIGRATION_PG_MODULE).href);
const client=new pg.Client(localTarget);await client.connect();
try {
  const row=(await client.query('SELECT current_database() AS database, current_user AS role, host(inet_server_addr()) AS host, inet_server_port() AS port')).rows[0];
  assert.deepEqual(row,{database:localTarget.database,role:localTarget.user,host:localTarget.host,port:localTarget.port});
}finally{await client.end();}
env.NODE_OPTIONS='--import='+pathToFileURL(resolve('tools/old-design-migration/local-sql.mjs')).href;
const command=process.argv[2]||'serve';
const args=command==='serve'?['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','4199']:
  command==='build'?['node_modules/next/dist/bin/next','build']:['--import','tsx',...process.argv.slice(2)];
const child=spawn(process.execPath,args,{env,stdio:'inherit',windowsHide:true});
process.on('SIGINT',()=>child.kill('SIGINT'));
child.on('error',()=>{console.error('Local child process could not start');process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??1;});
