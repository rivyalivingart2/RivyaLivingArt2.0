/** Test-only transport, deliberately separate from the protected 55439 QA guard. */
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve,sep} from 'node:path';
export const target=Object.freeze({host:'127.0.0.1',port:55441,user:'rivya_lifecycle_qa',database:'rivya_lifecycle_disposable'});
export const url='postgresql://rivya_lifecycle_qa@127.0.0.1:55441/rivya_lifecycle_disposable';
assert.equal(process.env.RIVYA_LIFECYCLE_LOCAL,'true');assert.equal(process.env.DATABASE_URL,url);
assert.equal(process.env.RIVYA_QA_TARGET,'lifecycle-disposable');assert.equal(process.env.RIVYA_DATA_MODE,'isolated');
assert.ok(!process.env.VERCEL&&!process.env.BLOB_READ_WRITE_TOKEN&&!process.env.DATABASE_URL_UNPOOLED);
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_LIFECYCLE_PG_MODULE).href);
export const pool=new pg.Pool({...target,max:4,idleTimeoutMillis:1000,allowExitOnIdle:true});
const identity=(await pool.query('SELECT current_database() AS database,current_user AS user,host(inet_server_addr()) AS host,inet_server_port() AS port')).rows[0];
assert.deepEqual(identity,target);
const expectedRoot=resolve(process.env.RIVYA_LIFECYCLE_OUTPUT);
assert.ok(expectedRoot.startsWith(resolve('test-results/audit-pending/lifecycle')+sep));
assert.equal(resolve((await pool.query('SHOW data_directory')).rows[0].data_directory).toLowerCase(),resolve(expectedRoot,'pgdata').toLowerCase());
export const network={sqlRequests:0,externalRequestsRejected:0,remoteSqlRejected:0};
globalThis.fetch=async(input,options={})=>{
 const headers=new Headers(options.headers||(input instanceof Request?input.headers:undefined));
 const connection=headers.get('Neon-Connection-String');
 if(!connection){network.externalRequestsRejected++;throw Error('Lifecycle runner refuses external network requests.');}
 if(connection!==url){network.remoteSqlRejected++;throw Error('Lifecycle runner refuses every other database.');}
 network.sqlRequests++;
 const body=JSON.parse(options.body||(input instanceof Request?await input.clone().text():'')),client=await pool.connect();
 const execute=async({query,params})=>{const result=await client.query({text:query,values:params,rowMode:'array',types:{getTypeParser:()=>value=>value}});return {command:result.command,rowCount:result.rowCount,rows:result.rows,fields:result.fields,rowAsArray:true};};
 try{
  if(body.queries){
   const isolation=headers.get('Neon-Batch-Isolation-Level'),readOnly=headers.get('Neon-Batch-Read-Only');
   const levels={ReadUncommitted:'READ UNCOMMITTED',ReadCommitted:'READ COMMITTED',RepeatableRead:'REPEATABLE READ',Serializable:'SERIALIZABLE'};
   assert.ok(isolation===null||Object.hasOwn(levels,isolation));assert.ok(readOnly===null||['true','false'].includes(readOnly));
   await client.query(['BEGIN',isolation?'ISOLATION LEVEL '+levels[isolation]:'',readOnly==='true'?'READ ONLY':'READ WRITE'].filter(Boolean).join(' '));
   const results=[];for(const item of body.queries)results.push(await execute(item));await client.query('COMMIT');return Response.json({results});
  }
  return Response.json(await execute(body));
 }catch(error){await client.query('ROLLBACK').catch(()=>{});return Response.json({message:error.message,code:error.code},{status:400});}
 finally{client.release();}
};
