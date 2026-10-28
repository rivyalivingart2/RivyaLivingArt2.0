import test from 'node:test';
import assert from 'node:assert/strict';
import {measureBoundedSource} from '../tools/google-workspace/bounded-source-measurement.mjs';

const table={sourceTable:'rivya_fixture',workbook:'content',primaryKey:['id'],fields:[
  {name:'id',representation:'decimal-string',nullable:false},
  {name:'content',representation:'preserved-json',nullable:false},
],constraints:[{name:'fixture_pk',definition:'PRIMARY KEY (id)'}]};
const schema={tables:[table]};

test('actual-row planner preserves original hashes and accounts for all four mutation components with bounded transport',async()=>{
  const source={rivya_fixture:Array.from({length:24},(_,i)=>({id:String(i+1),content:{text:'ગુજરાતી 🪷 '.repeat(1000),label:'private-fixture-'+i}}))};
  const report=await measureBoundedSource({schema,source,now:'2026-10-28T00:00:00.000Z'});
  const content=report.workbooks.find(w=>w.workbook==='content');
  assert.equal(content.inlineRecords,24);assert.ok(content.pageCount>4);
  assert.equal(content.historyCoverage.history,24);assert.equal(content.historyCoverage.ledger,24);assert.equal(content.historyCoverage.audit,24);
  assert.equal(content.originalInlinePayloadHashesMatched,true);
  assert.ok(content.maximumSignedResponseBytes<6_000_000);assert.ok(content.maximumPreparedRequestBytes<1_800_000);
  assert.equal(content.representativePreparedUpdates,8);assert.equal(report.providerVerified,false);
  assert.equal(report.migrationComplete,false);assert.equal(report.rawRowsPersisted,0);
  assert.doesNotMatch(JSON.stringify(report),/private-fixture-|ગુજરાતી|local_fixture_content|migration_r_/);
});

test('large documents are counted as unresolved, never assigned invented Drive IDs or counted as migrated',async()=>{
  const report=await measureBoundedSource({schema,source:{rivya_fixture:[{id:'9007199254740993',content:{text:'x'.repeat(50000)}}]}});
  assert.equal(report.sourceRows,1);assert.equal(report.inlineRecords,0);assert.equal(report.unresolvedDriveDocuments,1);
  assert.equal(report.completeTargetCapacityVerified,false);assert.equal(report.targetWrites,0);
  assert.ok(report.workbooks[0].unmaterializedPayloadBytes>50000);
  assert.doesNotMatch(JSON.stringify(report),/9007199254740993|driveFileId|fileId/);
});

test('invalid source relationships stop measurement before a capacity result can be accepted',async()=>{
  await assert.rejects(measureBoundedSource({schema,source:{rivya_fixture:[{id:'1',content:{}},{id:'1',content:{}}]}}),{code:'DUPLICATE_KEY'});
});
