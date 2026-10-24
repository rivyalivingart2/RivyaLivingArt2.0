/** New loopback cluster only. Source fixtures are explicitly not live records. */
import {existsSync,mkdirSync,readFileSync,writeFileSync,appendFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFile,spawn} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {createServer} from 'node:net';
import {randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
import {target,localUrl,localRoot,localEnvironment,assertNoEnvironmentFiles,verifyDatabase} from './local-guard.mjs';
import {baselineProducts} from '../../src/lib/shop-model.ts';
import {baselineContent} from '../../src/lib/content-model.ts';
import {approvedPublicMedia} from '../../src/lib/public-media.ts';
import {defaultBusiness} from '../../src/lib/business-settings-model.ts';
import {compileHomepageSnapshot} from '../../src/lib/homepage-dependencies.ts';

assert.ok(process.versions.node.startsWith('22.'),'Use project Node 22');assertNoEnvironmentFiles();
const resumeEmpty=process.argv.includes('--resume-empty');
assert.ok(!existsSync(localRoot)||resumeEmpty,'Existing restoration resources must be preserved; an interrupted empty cluster requires --resume-empty');
assert.ok(!existsSync(resolve(localRoot,'config.json'))&&!existsSync(resolve(localRoot,'receipt.json')),'A prepared preview must never be reseeded');
const bin=resolve(process.env.RIVYA_RESTORATION_PG_BIN||''),pgModule=resolve(process.env.RIVYA_RESTORATION_PG_MODULE||'');
assert.ok(existsSync(resolve(bin,'initdb.exe'))&&existsSync(pgModule),'Existing PostgreSQL runtime paths required');
await new Promise((yes,no)=>{const socket=createServer();socket.once('error',no);socket.listen(target.port,target.host,()=>socket.close(yes));});
const config={DATABASE_URL:localUrl,RIVYA_DATA_MODE:'isolated',RIVYA_QA_TARGET:'exact-legacy-local',STUDIO_ADMIN_ID:'synthetic-restoration-owner',STUDIO_ADMIN_PASSWORD:randomBytes(24).toString('hex'),STUDIO_SESSION_SECRET:randomBytes(32).toString('hex')};
const env=localEnvironment(config),run=promisify(execFile),data=resolve(localRoot,'pgdata');
const control=args=>new Promise((yes,no)=>{const child=spawn(resolve(bin,'pg_ctl.exe'),args,{env,stdio:'ignore',windowsHide:true});child.once('error',no);child.once('exit',code=>code===0?yes():no(Error('Local PostgreSQL control failed: '+code)));});
mkdirSync(localRoot,{recursive:true});let started=false;
try{
 if(resumeEmpty){
  assert.equal(readFileSync(resolve(data,'PG_VERSION'),'utf8').trim(),'18','Only this task-created PostgreSQL 18 cluster may be resumed');
  const configuration=readFileSync(resolve(data,'postgresql.conf'),'utf8');
  assert.ok(configuration.includes("listen_addresses = '127.0.0.1'")&&configuration.includes('port = 55443'),'Unexpected local cluster configuration');
 }else{
  const init=await run(resolve(bin,'initdb.exe'),['-D',data,'-U',target.user,'--auth-local=trust','--auth-host=trust','--encoding=UTF8','--locale=C'],{env,windowsHide:true});writeFileSync(resolve(localRoot,'init.log'),init.stdout+init.stderr);
  appendFileSync(resolve(data,'postgresql.conf'),"\nlisten_addresses = '127.0.0.1'\nport = 55443\nmax_connections = 20\nshared_buffers = '16MB'\n");
 }
 await control(['start','-D',data,'-l',resolve(localRoot,'postgres.log'),'-w','-t','30']);started=true;
 const {default:pg}=await import(pathToFileURL(pgModule).href);
 const admin=new pg.Client({...target,database:'postgres'});await admin.connect();
 try{
  assert.equal(resolve((await admin.query('SHOW data_directory')).rows[0].data_directory).toLowerCase(),data.toLowerCase());
  const databases=(await admin.query("SELECT datname FROM pg_database WHERE NOT datistemplate AND datname <> 'postgres'")).rows;
  assert.equal(databases.length,0,'Refusing to modify any previously populated cluster');
  await admin.query('CREATE DATABASE rivya_restoration_local');
 }finally{await admin.end();}
 const db=new pg.Client(target);await db.connect();
 try{
  await verifyDatabase(db);
  const schemas=['studio-schema.sql','redesign-preview-migration.sql','business-settings-schema.sql','content-schema.sql','revision-schema.sql','storage-provider-schema.sql','phase2-order-contract.sql','phase6-upload-identity.sql','phase11-privacy-controls.sql','phase11-erasure-engine.sql','studio-access-migration.sql','presentation-schema.sql'];
  await db.query('BEGIN');for(const file of schemas)await db.query(readFileSync(resolve('scripts',file),'utf8'));
  const dependencies={products:baselineProducts.map(document=>({key:document.id,version:1,fingerprint:'synthetic-source',document})),content:baselineContent.filter(d=>d.id!=='page:home').map(document=>({key:document.id,version:1,fingerprint:'synthetic-source',document})),media:approvedPublicMedia.map(document=>({key:document.path,version:0,fingerprint:'synthetic-source',document}))};
  for(const p of baselineProducts)await db.query("INSERT INTO rivya_catalogue(product_id,draft,published,version,published_version,visible,updated_by) VALUES($1,$2,$2,1,1,true,'restoration-source-fixture')",[p.id,p]);
  for(const m of approvedPublicMedia)await db.query("INSERT INTO rivya_public_media(path,draft,published,version,updated_by) VALUES($1,$2,$2,1,'restoration-source-fixture')",[m.path,m]);
  for(const candidate of baselineContent){const d=candidate.id==='page:home'?{...candidate,homeSnapshot:compileHomepageSnapshot(candidate,dependencies)}:candidate;await db.query("INSERT INTO rivya_content(content_key,kind,route,draft,published,version,published_version,visible,updated_by) VALUES($1,$2,$3,$4,$4,1,1,true,'restoration-source-fixture')",[d.id,d.kind,d.route,d]);}
  await db.query("INSERT INTO rivya_business_settings(id,details,version,updated_by) VALUES(1,$1,1,'restoration-source-fixture')",[defaultBusiness]);await db.query('COMMIT');
  writeFileSync(resolve(localRoot,'config.json'),JSON.stringify({...config,pgModule,bin},null,2),{flag:'wx'});
  const receipt={scope:'NEW_SYNTHETIC_LOCAL_DATABASE',target,sourceProducts:baselineProducts.length,sourceContent:baselineContent.length,sourceMedia:approvedPublicMedia.length,remoteRecordsCopied:0,remoteWrites:0,schemas,configuredAt:new Date().toISOString()};
  writeFileSync(resolve(localRoot,'receipt.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
 }catch(error){await db.query('ROLLBACK').catch(()=>{});throw error;}finally{await db.end();}
}finally{if(started)await control(['stop','-D',data,'-m','fast','-w','-t','30']);}
