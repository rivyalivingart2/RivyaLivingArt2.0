import test from 'node:test';
import assert from 'node:assert/strict';
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
