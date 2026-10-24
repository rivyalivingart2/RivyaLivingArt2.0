import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stableRecordId,prepareRecord,planSourceRecord,reconcileSource,parseLosslessRow,validateSourceRow,toGoogleCells,verifySourceShape} from '../tools/google-workspace/migration.mjs';
const table={sourceTable:'rivya_notes',primaryKey:['id'],fields:[{name:'id',representation:'text',nullable:false},{name:'text',representation:'text',nullable:false},{name:'amount',representation:'decimal-string',nullable:false},{name:'details',representation:'preserved-json',nullable:true}],constraints:[{definition:'PRIMARY KEY (id)'}]};
const note=(id='0006')=>({id,text:'=HYPERLINK("https://example.invalid")',amount:'9007199254740993',details:{labels:['தமிழ்','ગુજરાતી'],enabled:false,missing:null}});

test('source schema maps every observed field and key without secret or record content',()=>{
 const schema=JSON.parse(readFileSync('src/lib/google-workspace/schema.json'));
 assert.equal(schema.tables.length,28);assert.equal(schema.tables.flatMap(t=>t.fields).length,230);assert.equal(schema.tables.flatMap(t=>t.constraints).length,45);
 for(const table of schema.tables){assert.ok(schema.workbooks[table.workbook]);assert.ok(table.primaryKey.length);for(const key of table.primaryKey)assert.ok(table.fields.some(f=>f.name===key));}
 assert.equal(schema.tables.find(t=>t.sourceTable==='rivya_staff').workbook,'security');
 assert.equal(schema.tables.find(t=>t.sourceTable==='rivya_references').workbook,'operations');
});
test('current IDs, leading zeros, multilingual JSON and bigint values round trip exactly',()=>{
 const {record}=prepareRecord(table,note());assert.deepEqual(record.payload,note());assert.equal(record.revision,1);
 assert.notEqual(stableRecordId(table,note()),stableRecordId(table,note('6')));
});
test('record identity survives reordered source rows and object fields',()=>{
 const a=note(),b=note('0007');assert.equal(stableRecordId(table,a),stableRecordId(table,{details:a.details,amount:a.amount,text:a.text,id:a.id}));
 assert.deepEqual([b,a].map(r=>stableRecordId(table,r)).sort(),[a,b].map(r=>stableRecordId(table,r)).sort());
});
test('formula-like values use explicit string cells without escaping or loss',()=>{
 const values=['=1+1','+123','@SUM(A1)','-001','0006',''];assert.deepEqual(toGoogleCells(values).map(c=>c.userEnteredValue.stringValue),values);
 assert.throws(()=>toGoogleCells([123]),TypeError);
 assert.throws(()=>toGoogleCells(new Array(2)),{code:'INVALID_JSON'});
 let invoked=false;const accessor=['safe'];Object.defineProperty(accessor,'0',{enumerable:true,get(){invoked=true;return 'unsafe';}});
 assert.throws(()=>toGoogleCells(accessor),{code:'INVALID_JSON'});assert.equal(invoked,false);
});
test('reconciliation rejects duplicates, missing fields, unmapped fields and unsafe values',()=>{
 assert.throws(()=>reconcileSource({tables:[table]},{rivya_notes:[note(),note()]}),{code:'DUPLICATE_KEY'});
 assert.throws(()=>validateSourceRow(table,{...note(),unmapped:'x'}),{code:'UNMAPPED_FIELD'});
 const missing=note();delete missing.details;assert.throws(()=>validateSourceRow(table,missing),{code:'MISSING_FIELD'});
 assert.throws(()=>validateSourceRow(table,{...note(),amount:9007199254740992}),{code:'LOSSY_BIGINT'});
 assert.throws(()=>validateSourceRow(table,{...note(),id:null}),{code:'NULL_REQUIRED_FIELD'});
 assert.throws(()=>reconcileSource({tables:[table]},{}),{code:'MISSING_TABLE'});
 assert.throws(()=>reconcileSource({tables:[table]},{rivya_notes:[],unmapped:[]}),{code:'UNMAPPED_TABLE'});
});
test('composite foreign keys and nullable relationships are checked against stable values',()=>{
 const child={sourceTable:'rivya_links',primaryKey:['id'],fields:[{name:'id',representation:'text',nullable:false},{name:'note_id',representation:'text',nullable:true}],constraints:[{definition:'PRIMARY KEY (id)'},{definition:'FOREIGN KEY (note_id) REFERENCES rivya_notes(id) ON DELETE RESTRICT'}]};
 const schema={tables:[table,child]},source={rivya_notes:[note()],rivya_links:[{id:'a',note_id:'0006'},{id:'b',note_id:null}]};
 assert.equal(reconcileSource(schema,source).constraintsChecked,3);
 source.rivya_links[0].note_id='missing';assert.throws(()=>reconcileSource(schema,source),{code:'BROKEN_RELATIONSHIP'});
});
test('numeric JSON loss is detected instead of silently changing values',()=>{
 assert.deepEqual(parseLosslessRow('{"id":"9007199254740993","price":100.00,"a":1e3,"b":-0.5,"c":0.000001}'),{id:'9007199254740993',price:100,a:1000,b:-0.5,c:0.000001});
 for(const text of ['{"id":9007199254740993}','{"price":0.10000000000000001}','{"n":1e999}','{"n":1e-999}'])assert.throws(()=>parseLosslessRow(text),{code:'LOSSY_JSON_NUMBER'});
 assert.throws(()=>parseLosslessRow('not json'),SyntaxError);
 assert.throws(()=>parseLosslessRow('{"id":"first","id":"second"}'),{code:'DUPLICATE_JSON_KEY'});
 assert.throws(()=>parseLosslessRow('{"nested":{"id":1,"\\u0069d":2}}'),{code:'DUPLICATE_JSON_KEY'});
 assert.deepEqual(parseLosslessRow('{"one":{"id":1},"two":{"id":2}}'),{one:{id:1},two:{id:2}});
});
test('oversized document is explicitly deferred to a Drive artifact, never truncated',()=>{
 const source={...note(),text:'a'.repeat(46000)};
 assert.throws(()=>prepareRecord(table,source),{code:'DRIVE_ARTIFACT_REQUIRED'});
 const plan=planSourceRecord(table,source);assert.equal(plan.disposition,'drive-artifact-required');assert.equal(plan.driveFileId,null);assert.ok(plan.characters>46000);assert.equal(plan.payloadSha256.length,64);
 assert.equal(planSourceRecord(table,note()).disposition,'inline');
 assert.equal(reconcileSource({tables:[table]},{rivya_notes:[source]}).rows,1);
});

test('column or constraint drift aborts even when all current rows happen to satisfy the old schema',()=>{
 const schema=JSON.parse(readFileSync('src/lib/google-workspace/schema.json'));
 const columns=schema.tables.flatMap(t=>t.fields.map(f=>({table_name:t.sourceTable,column_name:f.name,data_type:f.sqlType,is_nullable:f.nullable?'YES':'NO'})));
 const constraints=schema.tables.flatMap(t=>t.constraints.map(c=>({source_table:t.sourceTable,name:c.name,definition:c.definition})));
 assert.equal(verifySourceShape(schema,columns,constraints),true);
 assert.throws(()=>verifySourceShape(schema,columns,constraints.slice(1)),{code:'CONSTRAINT_DRIFT'});
 assert.throws(()=>verifySourceShape(schema,columns,[{...constraints[0],definition:'UNIQUE (id)'},...constraints.slice(1)]),{code:'CONSTRAINT_DRIFT'});
 assert.throws(()=>verifySourceShape(schema,columns.slice(1),constraints),{code:'COLUMN_DRIFT'});
});
