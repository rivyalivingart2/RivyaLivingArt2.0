/** Test-only Neon HTTP -> task-owned PostgreSQL adapter. Never imported by src/. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {target,localUrl,localRoot,localEnvironment,verifyDatabase} from './local-guard.mjs';

assert.equal(process.env.RIVYA_RESTORATION_LOCAL,'true');
localEnvironment(process.env);
const config=JSON.parse(readFileSync(resolve(localRoot,'config.json'),'utf8'));
const {default:pg}=await import(pathToFileURL(config.pgModule).href);
const pool=new pg.Pool({...target,max:5,idleTimeoutMillis:1000,allowExitOnIdle:true});
pool.on('error',error=>console.error('RESTORATION_LOCAL_POOL_ERROR',error.code||'unknown'));
export const closeLocalTransport=()=>pool.end();
await verifyDatabase(pool);
const nativeFetch=globalThis.fetch.bind(globalThis);
globalThis.fetch=async(input,options={})=>{
 const headers=new Headers(options.headers||(input instanceof Request?input.headers:undefined));
 const connection=headers.get('Neon-Connection-String');
 const method=(options.method||(input instanceof Request?input.method:'GET')).toUpperCase();
 // Actual Next Server Actions can follow their own redirect. No remote egress.
 if(!connection){const url=new URL(input instanceof Request?input.url:String(input));if(url.origin==='http://127.0.0.1:4210'&&method==='GET')return nativeFetch(input,{...options,redirect:'manual'});}
 assert.equal(connection,localUrl,'Restoration preview refuses external fetch and alternate SQL targets');
 const body=JSON.parse(options.body||(input instanceof Request?await input.clone().text():''));
 const client=await pool.connect();
 const execute=async({query,params})=>{
  const result=await client.query({text:query,values:params,rowMode:'array',types:{getTypeParser:()=>value=>value}});
  return {command:result.command,rowCount:result.rowCount,rows:result.rows,fields:result.fields,rowAsArray:true};
 };
 try{
  if(body.queries){
   const isolation=headers.get('Neon-Batch-Isolation-Level'),readOnly=headers.get('Neon-Batch-Read-Only');
   const levels={ReadUncommitted:'READ UNCOMMITTED',ReadCommitted:'READ COMMITTED',RepeatableRead:'REPEATABLE READ',Serializable:'SERIALIZABLE'};
   assert.ok(isolation===null||Object.hasOwn(levels,isolation));assert.ok(readOnly===null||['true','false'].includes(readOnly));
   await client.query(['BEGIN',isolation?'ISOLATION LEVEL '+levels[isolation]:'',readOnly==='true'?'READ ONLY':'READ WRITE'].filter(Boolean).join(' '));
   const results=[];for(const query of body.queries)results.push(await execute(query));
   await client.query('COMMIT');return Response.json({results});
  }
  return Response.json(await execute(body));
 }catch(error){await client.query('ROLLBACK').catch(()=>{});return Response.json({message:error.message,code:error.code},{status:400});}finally{client.release();}
};
