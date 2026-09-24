/** Operator-only, read-only source backup. Never imported by the website/build.
 * Config and credentials must live outside Git. Upload only the resulting encrypted
 * archive through the approved private Drive connection, then verify its readback.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {parseEnv} from 'node:util';
import {createHash,randomBytes,createCipheriv,createDecipheriv} from 'node:crypto';
import {neon} from '@neondatabase/serverless';
import {list,get} from '@vercel/blob';
import {zipSync,unzipSync} from 'fflate';
process.on('uncaughtException',()=>{console.error('Backup configuration or execution failed; private details withheld.');process.exit(1);});
const hash=b=>createHash('sha256').update(b).digest('hex');
const configPath=process.argv[2];
if(!configPath||!path.isAbsolute(configPath))throw Error('Supply an absolute private operator configuration path');
const config=JSON.parse(fs.readFileSync(configPath,'utf8'));
for(const key of ['environmentFile','keyFile','destination','pgDump','trustedRoots'])if(!path.isAbsolute(config[key]||''))throw Error('Operator paths must be absolute');
const env=parseEnv(fs.readFileSync(config.environmentFile,'utf8'));
const source=new URL(env.DATABASE_URL_UNPOOLED||env.DATABASE_URL);
if(!['postgres:','postgresql:'].includes(source.protocol)||hash(source.hostname+source.pathname)!==config.sourceFingerprint||env.RIVYA_DATA_MODE!==config.dataMode||!['shared','isolated'].includes(config.dataMode))throw Error('Backup source fingerprint or environment differs from the approved configuration');
if(!env.BLOB_READ_WRITE_TOKEN||env.BLOB_READ_WRITE_TOKEN==='[SENSITIVE]')throw Error('Private storage credential unavailable');
const sql=neon(source.toString()),files={},maxBytes=512*1024*1024;
let fileBytes=0,cursor;
async function inventory(){
 const names=await sql`SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'rivya_%' ORDER BY tablename`;
 if(!names.length)throw Error('No application tables found');
 const out={};
 for(const {tablename:name} of names){if(!/^rivya_[a-z_]+$/.test(name))throw Error('Unexpected table name');out[name]=(await sql.query(`SELECT count(*)::integer AS count,md5(COALESCE(jsonb_agg(to_jsonb(t) ORDER BY to_jsonb(t)::text)::text,'[]')) AS digest FROM public."${name}" t`))[0];}
 return out;
}
try{
 const before=await inventory(),references=await sql`SELECT pathname,bytes,state FROM rivya_references ORDER BY pathname`;
 const manifest={version:1,createdAt:new Date().toISOString(),sourceFingerprint:config.sourceFingerprint,dataMode:config.dataMode,tables:before,privateReferences:[],businessTimezone:'Asia/Kolkata',deletionsMustBeReapplied:true};
 do{
  const page=await list({token:env.BLOB_READ_WRITE_TOKEN,limit:1000,cursor});
  for(const object of page.blobs){
   if(!/^references\/[0-9a-f-]{36}\.jpg$/.test(object.pathname)||object.size>10*1024*1024||fileBytes+object.size>maxBytes||files[object.pathname])throw Error('Storage scope or bounded backup size exceeded');
   const response=await get(object.pathname,{token:env.BLOB_READ_WRITE_TOKEN,access:'private',useCache:false});
   if(response?.statusCode!==200)throw Error('A private object could not be read');
   const bytes=Buffer.from(await new Response(response.stream).arrayBuffer());
   if(bytes.length!==object.size)throw Error('A private object changed during backup');
   fileBytes+=bytes.length;files[object.pathname]=bytes;manifest.privateReferences.push({path:object.pathname,bytes:bytes.length,sha256:hash(bytes)});
  }
  cursor=page.hasMore?page.cursor:undefined;
  if(page.hasMore&&!cursor)throw Error('Incomplete storage listing');
 }while(cursor);
 for(const r of references.filter(r=>r.state==='ready'))if(!files[r.pathname]||files[r.pathname].length!==Number(r.bytes))throw Error('A saved reference is missing or has changed size');
 const dump=spawnSync(config.pgDump,['--format=custom','--no-owner','--no-acl','--no-password','--schema=public'],{windowsHide:true,maxBuffer:maxBytes,env:{...process.env,PGHOST:source.hostname,PGPORT:source.port||'5432',PGUSER:decodeURIComponent(source.username),PGPASSWORD:decodeURIComponent(source.password),PGDATABASE:source.pathname.slice(1),PGSSLMODE:'verify-full',PGSSLROOTCERT:config.trustedRoots,PGCONNECT_TIMEOUT:'20'}});
 if(dump.status!==0||dump.stdout.subarray(0,5).toString()!=='PGDMP')throw Error('Database export failed; no complete backup recorded');
 if(dump.stdout.length+fileBytes>maxBytes)throw Error('Bounded archive limit exceeded');
 // A concurrent edit invalidates this attempt. Retry later; never certify a mixed backup.
 if(JSON.stringify(before)!==JSON.stringify(await inventory()))throw Error('Source changed during backup; retry during a quiet window');
 const afterPaths=[];cursor=undefined;
 do{const page=await list({token:env.BLOB_READ_WRITE_TOKEN,limit:1000,cursor});afterPaths.push(...page.blobs.map(o=>o.pathname+':'+o.size));cursor=page.hasMore?page.cursor:undefined;if(page.hasMore&&!cursor)throw Error('Incomplete verification listing');}while(cursor);
 if(JSON.stringify(afterPaths.sort())!==JSON.stringify(manifest.privateReferences.map(o=>o.path+':'+o.bytes).sort()))throw Error('Private storage changed during backup');
 manifest.databaseSha256=hash(dump.stdout);files['database.dump']=dump.stdout;files['recovery-manifest.json']=Buffer.from(JSON.stringify(manifest));
 const key=Buffer.from(fs.readFileSync(config.keyFile,'utf8').trim(),'base64');if(key.length!==32)throw Error('Invalid recovery key');
 try{
  const nonce=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,nonce),ciphertext=Buffer.concat([cipher.update(Buffer.from(zipSync(files))),cipher.final()]);
  const archive=Buffer.concat([Buffer.from('RIVYA01\n'),nonce,cipher.getAuthTag(),ciphertext]);
  const decoder=createDecipheriv('aes-256-gcm',key,nonce);decoder.setAuthTag(archive.subarray(20,36));const restored=unzipSync(Buffer.concat([decoder.update(archive.subarray(36)),decoder.final()]));
  if(hash(restored['database.dump'])!==manifest.databaseSha256||manifest.privateReferences.some(r=>hash(restored[r.path])!==r.sha256))throw Error('Encrypted archive readback failed');
  fs.mkdirSync(config.destination,{recursive:true});
  const name='rivya-daily-'+manifest.createdAt.replace(/[:.]/g,'-')+'.aes256gcm',archivePath=path.join(config.destination,name);
  fs.writeFileSync(archivePath,archive,{flag:'wx'});
  console.log(JSON.stringify({archivePath,name,archiveSha256:hash(archive),bytes:archive.length,createdAt:manifest.createdAt,tableCount:Object.keys(before).length,privateObjects:manifest.privateReferences.length,dataMode:config.dataMode,encrypted:true,localIntegrityVerified:true,offDeviceVerified:false,sourceMutations:0}));
 }finally{key.fill(0);}
}catch{
 console.error('Encrypted backup failed. No off-device completion is recorded. Inspect source availability, consistency, capacity and private configuration without publishing credentials or customer data.');process.exitCode=1;
}
