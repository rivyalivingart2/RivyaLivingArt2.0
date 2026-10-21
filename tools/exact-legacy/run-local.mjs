/** Run only against this task's prepared synthetic database. Stop with Ctrl+C. */
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync,unlinkSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {target,localRoot,localEnvironment,assertNoEnvironmentFiles,verifyDatabase} from './local-guard.mjs';
assert.ok(process.versions.node.startsWith('22.'));assertNoEnvironmentFiles();
const command=process.argv[2]||'start';assert.ok(['build','start','verify','stop'].includes(command));
const stopFile=resolve(localRoot,'preview.stop');
if(command==='stop'){writeFileSync(stopFile,new Date().toISOString());console.log('Requested task-owned preview shutdown');process.exit(0);}
const config=JSON.parse(readFileSync(resolve(localRoot,'config.json'),'utf8'));
const env=localEnvironment(config),data=resolve(localRoot,'pgdata');
for(const port of [target.port,...(command==='start'?[4210]:[])])await new Promise((yes,no)=>{const socket=createServer();socket.once('error',no);socket.listen(port,target.host,()=>socket.close(yes));});
const control=args=>new Promise((yes,no)=>{const child=spawn(resolve(config.bin,'pg_ctl.exe'),args,{env,stdio:'ignore',windowsHide:true});child.once('error',no);child.once('exit',code=>code===0?yes():no(Error('Local PostgreSQL control failed: '+code)));});
let child,started=false,stopping=false,closeLocalTransport;
const stop=()=>{stopping=true;if(child&&child.exitCode===null)child.kill('SIGTERM');};
process.on('SIGINT',stop);process.on('SIGTERM',stop);
if(command==='start'&&existsSync(stopFile))unlinkSync(stopFile);
const stopTimer=command==='start'?setInterval(()=>{if(existsSync(stopFile))stop();},500):undefined;
try{
 await control(['start','-D',data,'-l',resolve(localRoot,'postgres.log'),'-w','-t','30']);started=true;
 const {default:pg}=await import(pathToFileURL(config.pgModule).href);
 const client=new pg.Client(target);await client.connect();try{await verifyDatabase(client);}finally{await client.end();}
 if(stopping)throw Error('Stopped before app startup');
 if(command==='verify'){
  Object.assign(process.env,env);({closeLocalTransport}=await import('./local-transport.mjs'));
  const {neon}=await import('@neondatabase/serverless');const sql=neon(env.DATABASE_URL);
  const rows=await sql`SELECT (SELECT count(*)::int FROM rivya_catalogue) AS products,(SELECT count(*)::int FROM rivya_content) AS content,(SELECT count(*)::int FROM rivya_public_media) AS media`;
  assert.deepEqual(rows[0],{products:120,content:56,media:131});
  await assert.rejects(fetch('https://example.invalid/'),/refuses external fetch/);
  const receipt={at:new Date().toISOString(),scope:'synthetic-local',counts:rows[0],remoteFetchRefused:true,productionAccess:false};
  writeFileSync(resolve(localRoot,'transport-verification.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt,null,2));
 }else{
  const args=['node_modules/next/dist/bin/next',command,...(command==='start'?['--hostname','127.0.0.1','--port','4210']:[])];
  const code=await new Promise((yes,no)=>{child=spawn(process.execPath,args,{env:{...env,NODE_OPTIONS:'--import='+pathToFileURL(resolve('tools/exact-legacy/local-transport.mjs')).href},stdio:'inherit',windowsHide:true});child.once('error',no);child.once('exit',yes);});
  if(!stopping)process.exitCode=code??1;
  if(command==='build'&&code===0)writeFileSync(resolve(localRoot,'build.json'),JSON.stringify({at:new Date().toISOString(),buildId:readFileSync('.next/BUILD_ID','utf8').trim(),syntheticLocal:true},null,2));
 }
}finally{if(stopTimer)clearInterval(stopTimer);if(closeLocalTransport)await closeLocalTransport();if(started)await control(['stop','-D',data,'-m','fast','-w','-t','30']);}
