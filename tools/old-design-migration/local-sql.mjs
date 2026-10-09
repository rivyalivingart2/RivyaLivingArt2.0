// Test-only transport. Never imported by application code or a deployed build.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {localTarget, localUrl} from './guard.mjs';
assert.equal(process.env.RIVYA_MIGRATION_LOCAL_SQL, 'true');
assert.ok(!process.env.VERCEL);
const {default:pg}=await import(pathToFileURL(process.env.RIVYA_MIGRATION_PG_MODULE).href);
const pool=new pg.Pool({...localTarget,max:4,idleTimeoutMillis:1000,allowExitOnIdle:true});
const originalFetch=globalThis.fetch;
globalThis.fetch=async(input, options={})=>{
  const headers=new Headers(options.headers||(input instanceof Request?input.headers:undefined));
  const connection=headers.get('Neon-Connection-String');
  if (!connection) return originalFetch(input,options);
  assert.equal(connection,localUrl,'Remote SQL refused by migration QA');
  const body=JSON.parse(options.body||(input instanceof Request?await input.clone().text():''));
  const client=await pool.connect();
  const execute=async({query,params})=>{
    const result=await client.query({text:query,values:params,rowMode:'array',types:{getTypeParser:()=>value=>value}});
    return {command:result.command,rowCount:result.rowCount,rows:result.rows,fields:result.fields,rowAsArray:true};
  };
  try {
    if (body.queries) {
      const isolation=headers.get('Neon-Batch-Isolation-Level'), readOnly=headers.get('Neon-Batch-Read-Only');
      const levels={ReadUncommitted:'READ UNCOMMITTED',ReadCommitted:'READ COMMITTED',RepeatableRead:'REPEATABLE READ',Serializable:'SERIALIZABLE'};
      assert.ok(isolation===null||Object.hasOwn(levels,isolation));
      assert.ok(readOnly===null||['true','false'].includes(readOnly));
      await client.query(['BEGIN',isolation?'ISOLATION LEVEL '+levels[isolation]:'',readOnly==='true'?'READ ONLY':'READ WRITE'].filter(Boolean).join(' '));
      const results=[];
      for (const query of body.queries) results.push(await execute(query));
      await client.query('COMMIT');
      return Response.json({results});
    }
    return Response.json(await execute(body));
  } catch(error) {
    await client.query('ROLLBACK').catch(()=>{});
    return Response.json({message:error.message,code:error.code},{status:400});
  } finally {client.release();}
};
globalThis.__rivyaMigrationLocalSql=true;
