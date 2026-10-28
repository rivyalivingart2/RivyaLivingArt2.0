import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {rehearseLiveSource} from '../tools/google-workspace/rehearse-live-source.mjs';

// Driver fixtures test rehearsal behavior only; these are not live evidence.
const table = {sourceTable:'rivya_fixture', workbook:'system', sheet:'records', primaryKey:['id'],
  fields:[{name:'id',sqlType:'bigint',nullable:false,representation:'decimal-string'}, {name:'content',sqlType:'jsonb',nullable:false,representation:'preserved-json'}],
  constraints:[{name:'fixture_pk',definition:'PRIMARY KEY (id)'}]};
const schema = {schemaVersion:1,workbooks:{},tables:[table,{...table,sourceTable:'rivya_absent'}]};
const columns = table.fields.map(field=>({table_name:table.sourceTable,column_name:field.name,data_type:field.sqlType,is_nullable:'NO'}));
const constraints = table.constraints.map(c=>({source_table:table.sourceTable,...c}));
function driver(rows,{drift=false}={}) {
  const queries=[];
  return {queries,query(text){queries.push(text);return Promise.resolve(text.includes('information_schema.columns')?columns:text.includes('pg_constraint')?constraints:rows.map(row=>({row})));},
    async transaction(statements,options){assert.deepEqual(options,{readOnly:true,isolationLevel:'RepeatableRead'});const result=await Promise.all(statements);if(drift)result[0]=[];return result;}};
}

test('Read-only rehearsal preserves bigint and oversized records without pretending they were migrated',async()=>{
  const db=driver([JSON.stringify({id:'9007199254740993',content:{description:'x'.repeat(50_000)}})]);
  const report=await rehearseLiveSource(db,schema);
  assert.equal(report.relationships.rows,1);
  assert.equal(report.tables[0].driveArtifactsRequired,1);
  assert.equal(report.tables[0].inline,0);
  assert.deepEqual(report.absentMappedTables,['rivya_absent']);
  assert.equal(report.targetWrites,0);assert.equal(report.targetReconciled,false);assert.equal(report.backupCreated,false);
  assert.equal(report.rawRowsPersisted,0);
  assert.ok(db.queries.some(query=>query.includes('"id"::text as "id"')));
  assert.ok(db.queries.every(query=>query.startsWith('select ')));
  assert.doesNotMatch(JSON.stringify(report),/9007199254740993|description/);
});

test('Source schema drift, duplicate identity and precision loss stop the entire rehearsal',async()=>{
  const row='{"id":"1","content":{}}';
  await assert.rejects(rehearseLiveSource(driver([row],{drift:true}),schema),/SOURCE_SCHEMA_CHANGED/);
  await assert.rejects(rehearseLiveSource(driver([row,row]),schema),{code:'DUPLICATE_KEY'});
  await assert.rejects(rehearseLiveSource(driver(['{"id":"1","content":{"amount":9007199254740993}}']),schema),{code:'LOSSY_JSON_NUMBER'});
});

function pagedDriver(rows,{alterPage=false,alterFinal=false,shortPage=false,alterChunk=false,shortChunk=false}={}){
  let fingerprintReads=0;
  const digest=items=>createHash('md5').update(items.map(row=>createHash('md5').update(row).digest('hex')).sort().join('')).digest('hex');
  return {query(text){
    assert.ok(text.startsWith('select '));
    if(text.includes('information_schema.columns'))return Promise.resolve(columns);
    if(text.includes('pg_constraint'))return Promise.resolve(constraints);
    if(text.includes('string_agg(row_hash'))return Promise.resolve([{count:rows.length,digest:++fingerprintReads>1&&alterFinal?'0'.repeat(32):digest(rows)}]);
    const [,limit,offset]=text.match(/limit (\d+) offset (\d+)/);
    let page=rows.slice(Number(offset),Number(offset)+Number(limit));
    if(alterPage&&Number(offset)===0)page=page.map(x=>x.replace('original','changed'));
    if(shortPage)page=[];
    if(text.includes('substring(row')){
      const [,start,size]=text.match(/substring\(row from (\d+) for (\d+)\)/);
      return Promise.resolve(page.map(row=>{
        const chars=Array.from(row);let value=chars.slice(Number(start)-1,Number(start)-1+Number(size)).join('');
        const continuation=text.includes('as fragment');
        if(continuation&&alterChunk)value=value.replace('original','modified');
        if(continuation&&shortChunk)value='';
        return {[continuation?'fragment':'row']:value,characters:chars.length};
      }));
    }
    return Promise.resolve(page.map(row=>({row})));
  },async transaction(statements,options){assert.deepEqual(options,{readOnly:true,isolationLevel:'RepeatableRead'});return Promise.all(statements);}};
}

const pagedRows=['{"id":"1","content":{"text":"original"}}','{"id":"2","content":{}}'];
test('bounded pages reproduce the initial projection and final source fingerprint without exporting rows',async()=>{
  const result=await rehearseLiveSource(pagedDriver(pagedRows),schema,{pageSize:1});
  assert.equal(result.pagesRead,2);assert.equal(result.relationships.rows,2);
  assert.match(result.sourceTransaction,/fingerprints matched/);
  assert.equal(result.capacity.workbooks.find(x=>x.workbook==='system').measuredInlineRows,2);
  assert.ok(!JSON.stringify(result).includes('original'));
});
test('changed or incomplete paged data and a changed final source cannot become accepted measurements',async()=>{
  for(const options of [{alterPage:true},{alterFinal:true},{shortPage:true}]){
    await assert.rejects(rehearseLiveSource(pagedDriver(pagedRows,options),schema,{pageSize:1}),/SOURCE_CHANGED_DURING_PAGING/);
  }
});
test('invalid page budgets reject before any source call',async()=>{
  const sql={query(){assert.fail('must not read source');}};
  for(const pageSize of [0,101,-1,1.5])await assert.rejects(rehearseLiveSource(sql,schema,{pageSize}),/INVALID_PAGE_BUDGET/);
});

test('bounded row fragments preserve Unicode and verify the reconstructed source before measurement',async()=>{
  const rows=[JSON.stringify({id:'1',content:{text:'🪷 ગુજરાતી original '.repeat(10)}})];
  const progress=[];
  const report=await rehearseLiveSource(pagedDriver(rows),schema,{pageSize:1,chunkCharacters:32,onProgress:e=>progress.push(e)});
  assert.ok(report.chunkReads>1);assert.equal(report.sourceBytes,Buffer.byteLength(rows[0]));
  assert.equal(report.relationships.rows,1);assert.equal(report.rawRowsPersisted,0);
  assert.doesNotMatch(JSON.stringify(progress),/ગુજરાતી|original/);
  assert.equal(progress.at(-1).stage,'reconcile');
});

test('missing, changed and unbounded row fragments cannot produce a completed report',async()=>{
  const rows=[JSON.stringify({id:'1',content:{text:'original '.repeat(20)}})];
  for(const options of [{alterChunk:true},{shortChunk:true}]){
    await assert.rejects(rehearseLiveSource(pagedDriver(rows,options),schema,{pageSize:1,chunkCharacters:32}),/SOURCE_CHANGED_DURING_PAGING/);
  }
  const sql={query(){assert.fail('must reject before source read');}};
  for(const chunkCharacters of [0,-1,65537,1.5])await assert.rejects(rehearseLiveSource(sql,schema,{pageSize:1,chunkCharacters}),/INVALID_CHUNK_BUDGET/);
  await assert.rejects(rehearseLiveSource(sql,schema,{chunkCharacters:32}),/INVALID_CHUNK_BUDGET/);
});

test('fragment reads remain bounded to four fragments per read-only transaction',async()=>{
  const base=pagedDriver([JSON.stringify({id:'1',content:{text:'x'.repeat(512)}})]);
  let batches=0,largest=0;
  const sql={query(text){const promise=base.query(text);promise.statementText=text;return promise;},async transaction(statements,options){
    const fragment=statements.some(x=>x.statementText.includes('as fragment'));
    if(fragment){batches++;largest=Math.max(largest,statements.length);assert.ok(statements.length<=4);}
    return base.transaction(statements,options);
  }};
  const result=await rehearseLiveSource(sql,schema,{pageSize:1,chunkCharacters:32});
  assert.equal(largest,4);assert.equal(result.chunkBatches,batches);assert.ok(result.chunkReads>batches);
});

test('trusted local inspection sees only fully verified source and cannot leak its return into the report',async()=>{
  let calls=0;
  const inspectVerifiedSource=async({schema:verifiedSchema,source})=>{
    calls++;assert.equal(verifiedSchema.tables.length,1);assert.equal(source.rivya_fixture.length,2);
    assert.equal(source.rivya_fixture[0].content.text,'original');
    return {privatePayload:'must-not-be-published'};
  };
  const report=await rehearseLiveSource(pagedDriver(pagedRows),schema,{pageSize:1,inspectVerifiedSource});
  assert.equal(calls,1);assert.doesNotMatch(JSON.stringify(report),/must-not-be-published|original/);
  for(const options of [{alterPage:true},{alterFinal:true},{shortPage:true}]){
    await assert.rejects(rehearseLiveSource(pagedDriver(pagedRows,options),schema,{pageSize:1,inspectVerifiedSource}),/SOURCE_CHANGED_DURING_PAGING/);
  }
  assert.equal(calls,1);
  await assert.rejects(rehearseLiveSource(pagedDriver(pagedRows),schema,{pageSize:1,inspectVerifiedSource:async()=>{throw Error('INSPECTION_FAILED');}}),/INSPECTION_FAILED/);
  await assert.rejects(rehearseLiveSource({query(){assert.fail('must reject before reading');}},schema,{inspectVerifiedSource:{}}),/INVALID_INSPECTION_CALLBACK/);
});
