import test from 'node:test';
import assert from 'node:assert/strict';
import {createSourceCapacityMeasurement} from '../tools/google-workspace/source-capacity.mjs';
import {RECORD_COLUMNS} from '../src/lib/google-workspace/record-codec.ts';

test('counts UTF-8 wire bytes and retains unknown Drive references without inventing IDs',()=>{
  const measure=createSourceCapacityMeasurement();
  const cells=['record', '1', JSON.stringify({text:'ગુજરાતી \\"'}),'digest','','','mutation'];
  measure.observe({workbook:'content'},[{disposition:'inline',cells},{disposition:'drive-artifact-required',bytes:90000,characters:50000,driveFileId:null}]);
  const report=measure.finish(),content=report.workbooks[0];
  assert.equal(content.sourceRows,2);assert.equal(content.measuredInlineRows,1);assert.equal(content.unmaterializedDocuments,1);
  assert.equal(content.documentPayloadBytes,90000);assert.equal(report.providerVerified,false);
  assert.ok(content.signedResponseBytesLowerBound>content.recordAndInitialHistoryCharactersLowerBound);
  assert.ok(!JSON.stringify(report).includes('ગુજરાતી'));
});

test('lower bound fits inside a complete signed-response representation',()=>{
  const measure=createSourceCapacityMeasurement();
  const cells=['one','1','{"value":"=SUM(A1)"}','hash','','','migration_one'];
  measure.observe({workbook:'content'},[{disposition:'inline',cells}]);
  const rows=[Array.from(RECORD_COLUMNS),cells].map(row=>row.map(stringValue=>({userEnteredValue:{stringValue},effectiveValue:{stringValue}})));
  const actual=JSON.stringify({message:JSON.stringify({result:{workbookId:'isolated-fixture',sheets:[{sheetId:1,rows},{sheetId:4,rows}]}}),signature:'a'.repeat(64)});
  assert.ok(measure.finish().workbooks[0].signedResponseBytesLowerBound<Buffer.byteLength(actual));
});

test('wire lower bound also fits when Sheets omits both values from blank metadata cells',()=>{
  const measure=createSourceCapacityMeasurement();
  const cells=['one','1','{"value":"sample"}','hash','','','migration_one'];
  measure.observe({workbook:'content'},[{disposition:'inline',cells}]);
  const rows=[Array.from(RECORD_COLUMNS),cells].map(row=>row.map(value=>value===''?{}:{userEnteredValue:{stringValue:value},effectiveValue:{stringValue:value}}));
  const actual=2*(Buffer.byteLength(JSON.stringify(JSON.stringify(rows)))-2);
  const result=measure.finish().workbooks[0];
  assert.equal(result.signedResponseBytesLowerBound,actual);
  assert.ok(result.signedResponseBytesWithExplicitEmptyCells>actual);
  assert.throws(()=>createSourceCapacityMeasurement().observe({workbook:'content'},[{disposition:'inline',cells:['','1','{}','hash','','','migration_one']}]),/INVALID_CAPACITY_INPUT/);
});

test('rejects fabricated materialized document IDs and unsupported plan dispositions',()=>{
  for(const bad of [{disposition:'drive-artifact-required',bytes:90,characters:50,driveFileId:'invented'}, {disposition:'ready'}]){
    assert.throws(()=>createSourceCapacityMeasurement().observe({workbook:'content'},[bad]),/INVALID_CAPACITY_INPUT/);
  }
});
