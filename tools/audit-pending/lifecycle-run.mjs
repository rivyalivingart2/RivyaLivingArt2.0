/** Creates a new, wholly synthetic loopback cluster. Never reuses the protected QA DB. */
import assert from 'node:assert/strict';
import {existsSync,mkdirSync,writeFileSync,appendFileSync,readFileSync} from 'node:fs';
import {resolve,sep} from 'node:path';
import {promisify} from 'node:util';
import {execFile,spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {pathToFileURL} from 'node:url';
import {randomBytes} from 'node:crypto';

const run=promisify(execFile),base=resolve('test-results/audit-pending/lifecycle');
const root=resolve(base,'run-'+new Date().toISOString().replace(/[:.]/g,'-'));
const allowed=resolve('test-results')+sep;
assert.ok(root.startsWith(allowed));
assert.ok(!existsSync(root),'Preserve any previous lifecycle evidence; never reuse its cluster.');
const bin='C:/Users/gonda/Documents/Codex/2026-09-23/continue-the-approved-rivyalivingart-redesign-read/work/tooling/postgresql-18.6/pgsql/bin';
const pgModule='C:/Users/gonda/Documents/Codex/2026-09-30/keep-rivyalivingart2-0-as-the-base/work/tooling/local-postgres/node_modules/pg/lib/index.js';
for(const name of ['initdb.exe','pg_ctl.exe','postgres.exe'])assert.ok(existsSync(resolve(bin,name)));
await new Promise((accept,reject)=>{const server=createServer();server.once('error',reject);server.listen(55441,'127.0.0.1',()=>server.close(accept));});
const env={...process.env};
for(const key of Object.keys(env))if(/DATABASE|BLOB|NEON|VERCEL|STUDIO_|^RIVYA_|^SITE_INDEXABLE$|^NODE_OPTIONS$/.test(key))delete env[key];
Object.assign(env,{RIVYA_LIFECYCLE_LOCAL:'true',RIVYA_LIFECYCLE_OUTPUT:root,RIVYA_LIFECYCLE_PG_MODULE:pgModule,DATABASE_URL:'postgresql://rivya_lifecycle_qa@127.0.0.1:55441/rivya_lifecycle_disposable',RIVYA_DATA_MODE:'isolated',RIVYA_QA_TARGET:'lifecycle-disposable',STUDIO_ADMIN_ID:'lifecycle-disposable-owner',STUDIO_ADMIN_PASSWORD:randomBytes(24).toString('hex'),STUDIO_SESSION_SECRET:randomBytes(32).toString('hex'),NODE_ENV:'production',NEXT_TELEMETRY_DISABLED:'1',SITE_INDEXABLE:'false'});
mkdirSync(root,{recursive:true});
writeFileSync(resolve(root,'SYNTHETIC-ONLY.txt'),'Disposable audit cluster. Source schema and wholly fictional records only. No production/private QA records copied.\n',{flag:'wx'});
const data=resolve(root,'pgdata'),ctl=resolve(bin,'pg_ctl.exe');
// On Windows the detached postgres child can retain captured pipe handles.
// Await pg_ctl exit with ignored stdio rather than execFile's pipe-close event.
const control=args=>new Promise((accept,reject)=>{const child=spawn(ctl,args,{env,windowsHide:true,stdio:'ignore'});child.once('error',reject);child.once('exit',code=>code===0?accept():reject(Error('pg_ctl exited '+code)));});
let started=false;
try{
 const init=await run(resolve(bin,'initdb.exe'),['-D',data,'-U','rivya_lifecycle_qa','--auth-local=trust','--auth-host=trust','--encoding=UTF8','--locale=C'],{env,windowsHide:true,maxBuffer:2_000_000});
 writeFileSync(resolve(root,'init.log'),init.stdout+init.stderr);
 appendFileSync(resolve(data,'postgresql.conf'),"\nlisten_addresses = '127.0.0.1'\nport = 55441\nmax_connections = 20\nshared_buffers = '16MB'\n");
 await control(['start','-D',data,'-l',resolve(root,'postgres.log'),'-w','-t','30']);started=true;
 const {default:pg}=await import(pathToFileURL(pgModule).href);
 const admin=new pg.Client({host:'127.0.0.1',port:55441,user:'rivya_lifecycle_qa',database:'postgres'});await admin.connect();
 try{
  const identity=(await admin.query('SELECT current_user AS role,host(inet_server_addr()) AS host,inet_server_port() AS port')).rows[0];
  assert.deepEqual(identity,{role:'rivya_lifecycle_qa',host:'127.0.0.1',port:55441});
  const actualData=(await admin.query('SHOW data_directory')).rows[0].data_directory;
  assert.equal(resolve(actualData).toLowerCase(),data.toLowerCase(),'The server must own this exact new disposable data directory.');
  assert.equal((await admin.query("SELECT count(*)::int AS n FROM pg_database WHERE datname='rivya_lifecycle_disposable'")).rows[0].n,0);
  await admin.query('CREATE DATABASE rivya_lifecycle_disposable');
 }finally{await admin.end();}
 const db=new pg.Client({connectionString:env.DATABASE_URL});await db.connect();
 try{
  const schemas=['studio-schema.sql','redesign-preview-migration.sql','business-settings-schema.sql','content-schema.sql','revision-schema.sql','storage-provider-schema.sql','phase2-order-contract.sql','phase6-upload-identity.sql','phase11-privacy-controls.sql','phase11-erasure-engine.sql'];
  for(const file of schemas)await db.query(readFileSync(resolve('scripts',file),'utf8'));
  writeFileSync(resolve(root,'schemas.json'),JSON.stringify({schemas,sourceOnly:true,privateRecordsCopied:0},null,2));
 }finally{await db.end();}
 const code=await new Promise((accept,reject)=>{const child=spawn(process.execPath,['--import','tsx','tools/audit-pending/lifecycle-tests.mjs'],{env,stdio:'inherit',windowsHide:true});child.once('error',reject);child.once('exit',accept);});
 process.exitCode=code??1;
  writeFileSync(resolve(root,'execution.json'),JSON.stringify({at:new Date().toISOString(),exitCode:process.exitCode},null,2));
}finally{
 if(started){await control(['stop','-D',data,'-m','fast','-w','-t','30']);writeFileSync(resolve(root,'cluster-stopped.json'),JSON.stringify({at:new Date().toISOString(),stopped:true,port:55441,dataDirectory:data},null,2));}
 writeFileSync(resolve(base,'latest-run.json'),JSON.stringify({root,results:resolve(root,'results.json')},null,2));
}
