/** Disposable OLDWEBSITE reference. No live credentials, bootstrap or import. */
import assert from 'node:assert/strict';
import {existsSync,mkdirSync,readFileSync,writeFileSync,appendFileSync,readdirSync,unlinkSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawn,execFileSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
const command=process.argv[2],root=resolve('test-results/exact-legacy-2026-10-21/old-runtime'),app=resolve('../OLDWEBSITE-isolated');
const resumeEmpty=process.argv.includes('--resume-empty');
// Windows may reserve the historical port after a restart. This opt-in only
// changes the reference listener; the same preserved data directory is used.
const referencePort=process.argv.includes('--alternate-reference-port')?55442:55444;
assert.ok(referencePort===55444||command==='start');
assert.ok(['prepare','build','start','stop'].includes(command));assert.ok(process.versions.node.startsWith('22.'));
assert.equal(readdirSync(app).filter(n=>/^\.env(?:\.|$)/.test(n)&&n!=='.env.example').length,0);
const configPath=resolve(root,'config.json'),data=resolve(root,'pgdata'),stopFile=resolve(root,'stop');
if(command==='stop'){writeFileSync(stopFile,'stop');process.exit(0);}
const current=JSON.parse(readFileSync('test-results/exact-legacy-2026-10-21/runtime/config.json','utf8'));
const target={host:'127.0.0.1',port:referencePort,user:'rivya_old_reference',database:'rivya_old_reference'};
const url='postgresql://rivya_old_reference@127.0.0.1:55444/rivya_old_reference';
const config=existsSync(configPath)?JSON.parse(readFileSync(configPath,'utf8')):{url,AUTH_SECRET:randomBytes(32).toString('hex'),email:'reference-owner@example.invalid',password:randomBytes(24).toString('hex')};
assert.equal(config.url,url);
const env={};for(const key of ['PATH','Path','SystemRoot','SYSTEMROOT','WINDIR','COMSPEC','TEMP','TMP','USERPROFILE','APPDATA','LOCALAPPDATA'])if(process.env[key])env[key]=process.env[key];
Object.assign(env,{DATABASE_URL:url.replace(':55444/',':'+referencePort+'/'),RIVYA_OLD_REFERENCE_PORT:String(referencePort),AUTH_SECRET:config.AUTH_SECRET,AUTH_TRUST_HOST:'true',AUTH_URL:'http://127.0.0.1:4212',NEXT_PUBLIC_SITE_URL:'http://127.0.0.1:4212',NEXT_TELEMETRY_DISABLED:'1',NODE_ENV:'development'});
const run=(file,args,cwd=app,extra={})=>new Promise((yes,no)=>{const child=spawn(file,args,{cwd,env:{...env,...extra},stdio:'inherit',windowsHide:true});child.once('error',no);child.once('exit',code=>code===0?yes():no(Error('Isolated reference command failed: '+code)));});
const control=args=>run(resolve(current.bin,'pg_ctl.exe'),args,process.cwd());
const {default:pg}=await import(pathToFileURL(current.pgModule).href);
let started=false;
try{
 if(command==='prepare'){
  assert.ok(!existsSync(configPath)&&(!existsSync(data)||resumeEmpty),'Never reseed an existing reference');mkdirSync(root,{recursive:true});
  if(!resumeEmpty){
  await run(resolve(current.bin,'initdb.exe'),['-D',data,'-U',target.user,'--auth-local=trust','--auth-host=trust','--encoding=UTF8','--locale=C']);
  appendFileSync(resolve(data,'postgresql.conf'),"\nlisten_addresses = '127.0.0.1'\nport = 55444\nmax_connections = 30\nshared_buffers = '16MB'\n");
  }
 }
 await control(['start','-D',data,'-l',resolve(root,'postgres.log'),'-o','-p '+referencePort,'-w','-t','30']);started=true;
 const db=new pg.Client({...target,database:command==='prepare'?'postgres':target.database});await db.connect();
 try{
  assert.equal(resolve((await db.query('SHOW data_directory')).rows[0].data_directory).toLowerCase(),data.toLowerCase());
  assert.equal((await db.query('SELECT inet_server_port() AS port')).rows[0].port,referencePort);
  assert.equal((await db.query('SELECT current_user AS name')).rows[0].name,target.user);
  if(command==='prepare'){
   const databases=(await db.query("SELECT datname FROM pg_database WHERE NOT datistemplate AND datname<>'postgres'")).rows;
   if(resumeEmpty)assert.deepEqual(databases,[{datname:target.database}]);
   else{assert.equal(databases.length,0);await db.query('CREATE DATABASE rivya_old_reference');}
  }
 }finally{await db.end();}
 if(command==='prepare'){
  const prisma=resolve(app,'node_modules/prisma/build/index.js');
  await run(process.execPath,[prisma,'generate']);
  const schema=execFileSync(process.execPath,[prisma,'migrate','diff','--from-empty','--to-schema','prisma/schema.prisma','--script'],{cwd:app,env,encoding:'utf8',windowsHide:true,maxBuffer:10e6});
  const fixture=new pg.Client(target);await fixture.connect();
  try{
   assert.equal((await fixture.query("SELECT tablename FROM pg_tables WHERE schemaname='public'")).rows.length,0,'Only an empty failed preparation can resume');
   // Local PostgreSQL has no pgvector. This derived scraper field is never
   // queried in visual-state tests; similarity/embedding parity is NOT claimed.
   await fixture.query(schema.replaceAll('vector(512)','real[]'));
   const {hash}=await import(pathToFileURL(resolve(app,'node_modules/bcryptjs/index.js')).href);
   await fixture.query('INSERT INTO "User" (id,name,email,"hashedPassword",role) VALUES ($1,$2,$3,$4,\'ADMIN\')',['local-reference-owner','Synthetic reference owner',config.email,await hash(config.password,12)]);
   await fixture.query('INSERT INTO "Category" (id,name,slug,visible) VALUES ($1,$2,$3,true)',['local-reference-category','Reference fixtures','reference-fixtures']);
   await fixture.query('INSERT INTO "Portfolio" (id,title,slug,story,brief,process,location,year,"afterImageUrl","resultsMeta","categoryId",status) VALUES ($1,$2,$3,$4,$5,$6,$7,2026,$8,$9,$10,\'PUBLISHED\')',['local-reference-project','Synthetic reference project','synthetic-reference-project','Isolated design verification fixture. Not a customer commission.','Fixture brief for conditional template verification.','Fixture process text for layout verification.','Local preview','/media/v3/bench-coffee-top.avif',JSON.stringify({type:'Design fixture',material:'Reference resin surface',size:'Fixture dimensions',timeline:'Fixture timeline'}),'local-reference-category']);
   writeFileSync(configPath,JSON.stringify(config,null,2),{flag:'wx'});
   writeFileSync(resolve(root,'receipt.json'),JSON.stringify({at:new Date().toISOString(),sourceCommit:'2dd6d5de34acf3f98e611eda2e1b858ebd0da8e6',target,synthetic:true,productionData:false,bootstrapExecuted:false,limitations:['English local font loading adapter','English /en prefix used in isolated dev routing; deployed URL parity not claimed','Derived pgvector field represented as real[]; vector workflows not tested'],fixtures:{users:1,categories:1,projects:1}},null,2));
  }finally{await fixture.end();}
 }else if(command==='build'){
  // Invoke Next directly: the legacy npm build also migrates and bootstraps.
  await run(process.execPath,['node_modules/next/dist/bin/next','build','--webpack'],app,{NODE_ENV:'production',NODE_OPTIONS:'--import='+pathToFileURL(resolve('tools/exact-legacy/old-network-guard.mjs')).href});
 }else{
  if(existsSync(stopFile))unlinkSync(stopFile);
  const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','4212'],{cwd:app,env:{...env,NODE_ENV:'production',NODE_OPTIONS:'--import='+pathToFileURL(resolve('tools/exact-legacy/old-network-guard.mjs')).href},stdio:'inherit',windowsHide:true});
  const timer=setInterval(()=>{if(existsSync(stopFile))child.kill('SIGTERM');},500);
  try{await new Promise((yes,no)=>{child.once('error',no);child.once('exit',yes);});}finally{clearInterval(timer);}
 }
}finally{if(started)await control(['stop','-D',data,'-m','fast','-w','-t','30']);}
