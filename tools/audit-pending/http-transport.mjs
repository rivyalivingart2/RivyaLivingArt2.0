/** Actual Next server's SQL-only adapter. No cookie, cache or provider stubs. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve,sep} from 'node:path';
import {Agent} from 'undici';
const target={host:'127.0.0.1',port:55441,user:'rivya_http_qa',database:'rivya_http_disposable'};
const url='postgresql://rivya_http_qa@localhost:55441/rivya_http_disposable';
assert.equal(process.env.RIVYA_HTTP_AUDIT,'true');assert.equal(process.env.DATABASE_URL,url);
assert.equal(process.env.RIVYA_QA_TARGET,'http-disposable');assert.equal(process.env.RIVYA_DATA_MODE,'isolated');
assert.ok(!process.env.VERCEL&&!process.env.BLOB_READ_WRITE_TOKEN&&!process.env.DATABASE_URL_UNPOOLED);
const root=resolve(process.env.RIVYA_HTTP_OUTPUT);assert.ok(root.startsWith(resolve('test-results/audit-pending-http')+sep));
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_HTTP_PG_MODULE).href);
const pool=new pg.Pool({...target,max:5,idleTimeoutMillis:1000,allowExitOnIdle:true});
assert.deepEqual((await pool.query('SELECT current_database() AS database,current_user AS user,host(inet_server_addr()) AS host,inet_server_port() AS port')).rows[0],target);
assert.equal(resolve((await pool.query('SHOW data_directory')).rows[0].data_directory).toLowerCase(),resolve(root,'pgdata').toLowerCase());
const nativeFetch=globalThis.fetch.bind(globalThis),localTls=new Agent({connect:{rejectUnauthorized:false}});
globalThis.fetch=async(input,options={})=>{
 const headers=new Headers(options.headers||(input instanceof Request?input.headers:undefined));
 const requestUrl=new URL(input instanceof Request?input.url:String(input));
 // Next follows its own Server Action redirect with a read-only RSC request.
 // TLS relaxation applies only to this exact loopback endpoint, never remote URLs.
 if(!headers.has('Neon-Connection-String')&&requestUrl.origin==='https://127.0.0.1:4207'&&(options.method||(input instanceof Request?input.method:'GET')).toUpperCase()==='GET')return nativeFetch(input,{...options,dispatcher:localTls,redirect:'manual'});
 if(headers.get('Neon-Connection-String')!==url){console.error('HTTP_AUDIT_TRANSPORT_REFUSED',{connectionHeaderPresent:headers.has('Neon-Connection-String')});throw Error('HTTP audit server refuses external fetch and alternate SQL targets.');}
 const body=JSON.parse(options.body||(input instanceof Request?await input.clone().text():''));
 const client=await pool.connect();
 const execute=async({query,params})=>{const result=await client.query({text:query,values:params,rowMode:'array',types:{getTypeParser:()=>value=>value}});return {command:result.command,rowCount:result.rowCount,rows:result.rows,fields:result.fields,rowAsArray:true};};
 try{
  if(body.queries){const isolation=headers.get('Neon-Batch-Isolation-Level'),readOnly=headers.get('Neon-Batch-Read-Only');const levels={ReadUncommitted:'READ UNCOMMITTED',ReadCommitted:'READ COMMITTED',RepeatableRead:'REPEATABLE READ',Serializable:'SERIALIZABLE'};assert.ok(isolation===null||Object.hasOwn(levels,isolation));assert.ok(readOnly===null||['true','false'].includes(readOnly));await client.query(['BEGIN',isolation?'ISOLATION LEVEL '+levels[isolation]:'',readOnly==='true'?'READ ONLY':'READ WRITE'].filter(Boolean).join(' '));const results=[];for(const item of body.queries)results.push(await execute(item));await client.query('COMMIT');return Response.json({results});}
  return Response.json(await execute(body));
 }catch(error){console.error('HTTP_AUDIT_SQL_ERROR',{code:error.code||'unknown'});await client.query('ROLLBACK').catch(()=>{});return Response.json({message:error.message,code:error.code},{status:400});}finally{client.release();}
};
