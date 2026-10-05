// Test-only Neon HTTP transport replacement. NOT imported by application code.
// It refuses remote SQL destinations and forwards bound parameters to the local
// PostgreSQL server. Ordinary non-SQL fetches retain their normal behaviour.
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
assert.equal(process.env.RIVYA_LOCAL_SQL,'true');
assert.ok(!process.env.VERCEL,'Local SQL transport must never run on Vercel');
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_LOCAL_PG_MODULE).href);
const pool=new pg.Pool({host:'127.0.0.1',port:55432,user:'rivya_local_qa',database:'rivya_acceptance_local',max:6,idleTimeoutMillis:1000,allowExitOnIdle:true});
const originalFetch=globalThis.fetch;
globalThis.fetch=async(input,options={})=>{
 const headers=new Headers(options.headers||(input instanceof Request?input.headers:undefined)),connection=headers.get('Neon-Connection-String');
 if(!connection)return originalFetch(input,options);
 const target=new URL(connection);
 assert.equal(target.hostname,'localhost');assert.equal(target.port,'55432');assert.equal(target.pathname,'/rivya_acceptance_local');assert.equal(target.username,'rivya_local_qa');
 const body=JSON.parse(options.body||(input instanceof Request?await input.clone().text():'')),client=await pool.connect();
 const execute=async({query,params})=>{
  const result=await client.query({text:query,values:params,rowMode:'array',types:{getTypeParser:()=>value=>value}});
  return {command:result.command,rowCount:result.rowCount,rows:result.rows,fields:result.fields,rowAsArray:true};
 };
 try{
  if(body.queries){
   const isolation=headers.get('Neon-Batch-Isolation-Level'),readOnly=headers.get('Neon-Batch-Read-Only'),deferrable=headers.get('Neon-Batch-Deferrable');
   assert.ok(isolation===null||['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable'].includes(isolation),'Unsupported local transaction isolation');
   assert.ok(readOnly===null||['true','false'].includes(readOnly));
   assert.ok(deferrable===null||['true','false'].includes(deferrable));
   const levels={ReadUncommitted:'READ UNCOMMITTED',ReadCommitted:'READ COMMITTED',RepeatableRead:'REPEATABLE READ',Serializable:'SERIALIZABLE'};
   await client.query(['BEGIN',isolation?`ISOLATION LEVEL ${levels[isolation]}`:'',readOnly===null?'':readOnly==='true'?'READ ONLY':'READ WRITE',deferrable===null?'':deferrable==='true'?'DEFERRABLE':'NOT DEFERRABLE'].filter(Boolean).join(' '));
   const results=[];for(const query of body.queries)results.push(await execute(query));await client.query('COMMIT');return Response.json({results});
  }
  return Response.json(await execute(body));
 }catch(error){await client.query('ROLLBACK').catch(()=>{});console.error('Local SQL check failed:',error.code||'unknown');return Response.json({message:error.message,code:error.code},{status:400});}
 finally{client.release();}
};
globalThis.__rivyaLocalSql=true;
