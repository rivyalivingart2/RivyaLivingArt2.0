/** Lossless migration preparation. No network, persistent store, or mutation. */
import {createHash} from 'node:crypto';
import {canonicalJson,canonicalArtifactJson,digestPayload,encodeRecord,decodeRecord} from '../../src/lib/google-workspace/record-codec.ts';

export class MigrationValidationError extends Error {
 constructor(code,table,field){super(`${code}: ${table}${field?'.'+field:''}`);this.name='MigrationValidationError';this.code=code;this.table=table;this.field=field;}
}
const fail=(code,table,field)=>{throw new MigrationValidationError(code,table,field);};
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&Object.getPrototypeOf(value)===Object.prototype;

function exactDecimal(token){
 const [mantissa,exponent='0']=token.toLowerCase().split('e');
 const sign=mantissa.startsWith('-')?'-':'',unsigned=mantissa.replace(/^-/,''),parts=unsigned.split('.');
 let digits=(parts[0]+(parts[1]||'')).replace(/^0+/,'')||'0',scale=Number(exponent)-(parts[1]?.length||0);
 if(digits==='0')return '0';
 while(digits.endsWith('0')){digits=digits.slice(0,-1);scale++;}
 return sign+digits+'e'+scale;
}

/** Refuse numeric precision loss before JSON.parse. Bigint columns are projected as text. */
export function parseLosslessRow(text){
 if(typeof text!=='string'||text.length>8_388_608)throw new MigrationValidationError('INVALID_SOURCE_SIZE','source');
 const tokens=text.match(/"(?:[^"\\]|\\.)*"|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/g)||[];
 for(const token of tokens){if(token.startsWith('"'))continue;const value=Number(token);if(!Number.isFinite(value)||exactDecimal(token)!==exactDecimal(String(value)))throw new MigrationValidationError('LOSSY_JSON_NUMBER','source');}
 const parsed=JSON.parse(text);
 const structure=text.match(/"(?:[^"\\]|\\.)*"|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?|true|false|null|[{}[\],:]/g)||[];
 let cursor=0;
 function checkKeys(depth){
  if(depth>64)throw new MigrationValidationError('INVALID_JSON_DEPTH','source');
  const token=structure[cursor++];
  if(token==='{'){
   const keys=new Set();
   while(structure[cursor]!=='}'){
    const key=JSON.parse(structure[cursor++]);
    if(keys.has(key))throw new MigrationValidationError('DUPLICATE_JSON_KEY','source');keys.add(key);
    cursor++;checkKeys(depth+1);if(structure[cursor]===',')cursor++;
   }
   cursor++;
  }else if(token==='['){while(structure[cursor]!==']'){checkKeys(depth+1);if(structure[cursor]===',')cursor++;}cursor++;}
 }
 checkKeys(0);
 return parsed;
}

export function validateSourceRow(table,row){
 if(!object(row))fail('INVALID_ROW',table.sourceTable);
 const names=new Set(table.fields.map(f=>f.name));
 for(const name of Object.keys(row))if(!names.has(name))fail('UNMAPPED_FIELD',table.sourceTable,name);
 for(const f of table.fields){
  if(!Object.hasOwn(row,f.name))fail('MISSING_FIELD',table.sourceTable,f.name);
  const value=row[f.name];
  if(value===null){if(!f.nullable)fail('NULL_REQUIRED_FIELD',table.sourceTable,f.name);continue;}
  if(f.representation==='integer'&&(!Number.isInteger(value)||value<-2147483648||value>2147483647))fail('INVALID_INTEGER',table.sourceTable,f.name);
  if(f.representation==='decimal-string'&&(typeof value!=='string'||!/^[-]?(?:0|[1-9][0-9]*)$/.test(value)))fail('LOSSY_BIGINT',table.sourceTable,f.name);
  if(f.representation==='boolean'&&typeof value!=='boolean')fail('INVALID_BOOLEAN',table.sourceTable,f.name);
  if(f.representation==='text'&&typeof value!=='string')fail('INVALID_TEXT',table.sourceTable,f.name);
  // The codec rejects non-JSON values and unsafe objects without coercion.
  if(f.representation==='preserved-json')canonicalArtifactJson(value);
 }
 canonicalArtifactJson(row);
 return row;
}

/** Envelope identity is independent of row order. Public/source IDs stay in payload. */
export function stableRecordId(table,row){
 for(const key of table.primaryKey)if(row[key]===null||row[key]===undefined)fail('MISSING_PRIMARY_KEY',table.sourceTable,key);
 return 'r_'+createHash('sha256').update(canonicalJson([table.sourceTable,table.primaryKey.map(key=>row[key])])).digest('hex');
}

export function prepareRecord(table,row){
 validateSourceRow(table,row);
 const record={recordId:stableRecordId(table,row),revision:1,payload:row,payloadSha256:digestPayload(row),sourceUpdatedAt:typeof row.updated_at==='string'?row.updated_at:typeof row.created_at==='string'?row.created_at:null,archivedAt:null,lastMutationId:'migration_'+stableRecordId(table,row)};
 const cells=encodeRecord(record);
 const restored=decodeRecord(cells);
 if(canonicalJson(restored.payload)!==canonicalJson(row))fail('ROUND_TRIP_MISMATCH',table.sourceTable);
 return {record,cells};
}

/** A large document stays complete; this plans a Drive artifact but never invents its ID. */
export function planSourceRecord(table,row){
 validateSourceRow(table,row);
 try{return {disposition:'inline',...prepareRecord(table,row)};}
 catch(error){
  if(error?.code!=='DRIVE_ARTIFACT_REQUIRED')throw error;
  const text=canonicalArtifactJson(row);
  return {disposition:'drive-artifact-required',recordId:stableRecordId(table,row),payloadSha256:createHash('sha256').update(text,'utf8').digest('hex'),characters:text.length,bytes:Buffer.byteLength(text,'utf8'),mimeType:'application/json',driveFileId:null};
 }
}

function constraintColumns(definition){return definition.match(/\(([^)]+)\)/)?.[1].split(',').map(c=>c.trim());}
const keyFor=(row,keys)=>canonicalJson(keys.map(key=>row[key]));

export function verifySourceShape(schema,columns,constraints){
 const expectedColumns=schema.tables.flatMap(t=>t.fields.map(f=>({table_name:t.sourceTable,column_name:f.name,data_type:f.sqlType,is_nullable:f.nullable?'YES':'NO'})));
 const expectedConstraints=schema.tables.flatMap(t=>t.constraints.map(c=>({source_table:t.sourceTable,name:c.name,definition:c.definition})));
 if(canonicalArtifactJson(columns)!==canonicalArtifactJson(expectedColumns))fail('COLUMN_DRIFT','schema');
 if(canonicalArtifactJson(constraints)!==canonicalArtifactJson(expectedConstraints))fail('CONSTRAINT_DRIFT','schema');
 return true;
}

/** Validate all observed primary/unique/foreign-key contracts, never drop a row. */
export function reconcileSource(schema,source){
 if(!object(source))throw new MigrationValidationError('INVALID_SOURCE','source');
 for(const name of Object.keys(source))if(!schema.tables.some(t=>t.sourceTable===name))fail('UNMAPPED_TABLE',name);
 let checked=0;
 for(const table of schema.tables){
  const rows=source[table.sourceTable];if(!Array.isArray(rows))fail('MISSING_TABLE',table.sourceTable);
  for(const row of rows)validateSourceRow(table,row);
  for(const constraint of table.constraints){
   const d=constraint.definition,columns=constraintColumns(d);if(!columns?.length)fail('INVALID_CONSTRAINT',table.sourceTable);
   if(d.startsWith('PRIMARY KEY')||d.startsWith('UNIQUE')){
    const seen=new Set();
    for(const row of rows){if(d.startsWith('UNIQUE')&&columns.some(k=>row[k]===null))continue;const key=keyFor(row,columns);if(seen.has(key))fail('DUPLICATE_KEY',table.sourceTable);seen.add(key);}
   }else if(d.startsWith('FOREIGN KEY')){
    const match=d.match(/REFERENCES ([a-z_]+)\(([^)]+)\)/);if(!match)fail('INVALID_CONSTRAINT',table.sourceTable);
    const destination=source[match[1]];if(!Array.isArray(destination))fail('MISSING_REFERENCED_TABLE',table.sourceTable);
    const keys=match[2].split(',').map(k=>k.trim()),index=new Set(destination.map(row=>keyFor(row,keys)));
    for(const row of rows){if(columns.some(k=>row[k]===null))continue;if(!index.has(keyFor(row,columns)))fail('BROKEN_RELATIONSHIP',table.sourceTable);}
   }else fail('UNSUPPORTED_CONSTRAINT',table.sourceTable);
   checked++;
  }
 }
 return {tables:schema.tables.length,rows:schema.tables.reduce((n,t)=>n+source[t.sourceTable].length,0),constraintsChecked:checked};
}

/** Explicit stringValue avoids formula execution, locale conversion and leading-zero loss. */
export function toGoogleCells(values){
 if(!Array.isArray(values))throw new TypeError('Only explicit dense strings may enter a record row');
 const safe=JSON.parse(canonicalArtifactJson(values));
 if(safe.some(v=>typeof v!=='string'||v.length>45000))throw new TypeError('Only bounded string cells are allowed');
 return safe.map(stringValue=>({userEnteredValue:{stringValue}}));
}
