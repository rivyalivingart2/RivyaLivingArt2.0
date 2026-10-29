/** Operator-only local SOURCE_RECORDS_ONLY checkpoint and SQL restore.
 * No CLI accepts secrets. Import with Node22 --import tsx. Call
 * createEncryptedCheckpoint({schema,source,metadata,outputDirectory}); source
 * is the already-verified read-only source in memory. The default wrapping key
 * is Windows DPAPI CurrentUser, not a portable/off-device recovery key.
 * This module never starts a server, connects to a provider, or uploads files.
 */
import {createHash, randomBytes, randomUUID, createCipheriv, createDecipheriv} from 'node:crypto';
import {join, resolve} from 'node:path';
import {canonicalArtifactJson} from '../../src/lib/google-workspace/record-codec.ts';
import {parseLosslessRow, reconcileSource, stableRecordId, validateSourceRow, verifySourceShape} from './migration.mjs';
import {createPrivateRecoveryDirectory, verifyPrivateRecoveryDirectory, writePrivateRecoveryFile, readPrivateRecoveryFile, windowsDpapiKeyProtection} from './local-recovery-files.mjs';
export {createPrivateRecoveryDirectory, verifyPrivateRecoveryDirectory, windowsDpapiKeyProtection};

const MAGIC=Buffer.from('RIVYA-LOCAL-RECORDS-1\n');
const MAX_SOURCE_BYTES=128*1024*1024,MAX_ARCHIVE_BYTES=192*1024*1024,MAX_ROWS=100000;
const hex=/^[a-f0-9]{64}$/,identifier=/^[a-z_][a-z0-9_]{0,62}$/;
const types=new Map([['uuid','text'],['text','text'],['integer','integer'],['timestamp with time zone','text'],['bigint','decimal-string'],['jsonb','preserved-json'],['boolean','boolean'],['date','text']]);
const fail=code=>{throw Error('RECOVERY_'+code);};
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).sort().join(',')===[...keys].sort().join(',');
function plain(value){
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)fail('INVALID_INPUT');
  for(const key of Reflect.ownKeys(value)){const d=Object.getOwnPropertyDescriptor(value,key);if(typeof key!=='string'||!d.enumerable||!('value'in d)||['__proto__','constructor','prototype'].includes(key))fail('INVALID_INPUT');}
}
const quote=name=>{if(typeof name!=='string'||!identifier.test(name))fail('INVALID_SCHEMA');return '"'+name+'"';};
function keyList(text,table){
  const keys=text.split(',').map(s=>s.trim());
  if(!keys.length||new Set(keys).size!==keys.length||keys.some(k=>!table.fields.some(f=>f.name===k)))fail('INVALID_SCHEMA');
  return keys;
}
function constraintSql(constraint,table,tables){
  quote(constraint.name);
  let match=/^(PRIMARY KEY|UNIQUE) \(([a-z0-9_, ]+)\)$/.exec(constraint.definition);
  if(match)return match[1]+' ('+keyList(match[2],table).map(quote).join(',')+')';
  match=/^FOREIGN KEY \(([a-z0-9_, ]+)\) REFERENCES (rivya_[a-z0-9_]+)\(([a-z0-9_, ]+)\)( ON DELETE RESTRICT)?$/.exec(constraint.definition);
  const target=match&&tables.find(t=>t.sourceTable===match[2]);if(!target)fail('INVALID_SCHEMA');
  const from=keyList(match[1],table),to=keyList(match[3],target);if(from.length!==to.length)fail('INVALID_SCHEMA');
  return 'FOREIGN KEY ('+from.map(quote).join(',')+') REFERENCES public.'+quote(target.sourceTable)+' ('+to.map(quote).join(',')+')'+(match[4]??'');
}
function schemaCopy(schema){
  const text=canonicalArtifactJson(schema);if(Buffer.byteLength(text)>2*1024*1024)fail('SCHEMA_BUDGET');
  const result=JSON.parse(text);
  if(result.schemaVersion!==1||!Array.isArray(result.tables)||!result.tables.length||result.tables.length>64)fail('INVALID_SCHEMA');
  const names=new Set();
  for(const t of result.tables){
    if(!/^rivya_[a-z0-9_]{1,56}$/.test(t.sourceTable)||names.has(t.sourceTable)||!Array.isArray(t.fields)||!t.fields.length||t.fields.length>128)fail('INVALID_SCHEMA');names.add(t.sourceTable);
    const columns=new Set();for(const f of t.fields){quote(f.name);if(columns.has(f.name)||types.get(f.sqlType)!==f.representation||typeof f.nullable!=='boolean')fail('INVALID_SCHEMA');columns.add(f.name);}
    if(!Array.isArray(t.primaryKey)||!t.primaryKey.length||new Set(t.primaryKey).size!==t.primaryKey.length||t.primaryKey.some(k=>!columns.has(k)))fail('INVALID_SCHEMA');
    if(!Array.isArray(t.constraints)||t.constraints.length>128||new Set(t.constraints.map(c=>c.name)).size!==t.constraints.length)fail('INVALID_SCHEMA');
    const primary=t.constraints.filter(c=>c.definition.startsWith('PRIMARY KEY'));
    if(primary.length!==1||primary[0].definition!=='PRIMARY KEY ('+t.primaryKey.join(', ')+')')fail('INVALID_SCHEMA');
  }
  for(const t of result.tables)for(const c of t.constraints)constraintSql(c,t,result.tables);
  return result;
}

function prepareDataset(schema,source){
  plain(source);schema=schemaCopy(schema);const names=Object.keys(source).sort();
  if(!names.length||names.some(name=>!schema.tables.some(t=>t.sourceTable===name)))fail('UNKNOWN_SOURCE_TABLE');
  const measuredSchema={...schema,tables:schema.tables.filter(t=>names.includes(t.sourceTable))};
  let bytes=0,rowCount=0;
  const entries=measuredSchema.tables.map(table=>{
    const rows=source[table.sourceTable];if(!Array.isArray(rows)||rows.length>20000||(rowCount+=rows.length)>MAX_ROWS)fail('ROW_BUDGET');
    const identities=[],encoded=[];
    for(let i=0;i<rows.length;i++){
      validateSourceRow(table,rows[i]);const text=canonicalArtifactJson(rows[i]);bytes+=Buffer.byteLength(text);if(bytes>MAX_SOURCE_BYTES)fail('SOURCE_BYTE_BUDGET');
      identities.push([stableRecordId(table,rows[i]),hash(text)]);encoded.push(text);
    }
    identities.sort((a,b)=>a[0].localeCompare(b[0]));
    return {table:table.sourceTable,encoded,rows:rows.length,sha256:hash(canonicalArtifactJson(identities))};
  });
  const relationships=reconcileSource(measuredSchema,source);
  const manifest={schemaVersion:1,scope:'SOURCE_RECORDS_ONLY',schemaSha256:hash(canonicalArtifactJson(schema)),sourceBytes:bytes,
    tables:entries.map(({table,rows,sha256})=>({table,rows,sha256})),absentMappedTables:schema.tables.filter(t=>!names.includes(t.sourceTable)).map(t=>t.sourceTable),relationships,
    schemaCoverage:'columns-nullability-primary-unique-foreign-keys',schemaDefaultsChecksIndexesRolesCovered:false,blobObjectsIncluded:0,repositoryFilesIncluded:0,fullBackup:false,offDeviceVerified:false};
  return {schema,measuredSchema,entries,manifest,manifestSha256:hash(canonicalArtifactJson(manifest))};
}
function protection(provider){if(!provider||!/^[-a-z0-9]{1,80}$/.test(provider.id)||typeof provider.protect!=='function'||typeof provider.unprotect!=='function')fail('INVALID_KEY_PROTECTION');return provider;}
function receiptFor(manifest,extra){return {scope:'SOURCE_RECORDS_ONLY',tables:manifest.relationships.tables,rows:manifest.relationships.rows,constraintsChecked:manifest.relationships.constraintsChecked,
  schemaCoverage:'columns-nullability-primary-unique-foreign-keys',schemaDefaultsChecksIndexesRolesCovered:false,
  blobObjectsIncluded:0,repositoryFilesIncluded:0,fullBackup:false,offDeviceVerified:false,operationalRecoveryVerified:false,...extra};}
function metadataCopy(value){
  plain(value);const result=JSON.parse(canonicalArtifactJson(value));
  if(!['live-source','synthetic-fixture'].includes(result.evidenceKind)||typeof result.sourceCheckedAt!=='string'||!Number.isFinite(Date.parse(result.sourceCheckedAt))||Buffer.byteLength(JSON.stringify(result))>65536)fail('INVALID_METADATA');
  return result;
}

export async function createEncryptedCheckpoint({schema,source,metadata,outputDirectory,keyProtection=windowsDpapiKeyProtection}){
  const dataset=prepareDataset(schema,source),meta=metadataCopy(metadata);
  const wrapper=protection(keyProtection),checkpointId=randomUUID(),createdAt=new Date().toISOString();
  const body=Buffer.from(JSON.stringify({version:1,scope:'SOURCE_RECORDS_ONLY',checkpointId,createdAt,metadata:meta,schema:dataset.schema,entries:dataset.entries.map(({table,encoded})=>({table,encoded})),manifest:dataset.manifest}));
  if(body.length>MAX_ARCHIVE_BYTES-MAGIC.length-28){body.fill(0);fail('ARCHIVE_BYTE_BUDGET');}
  const key=randomBytes(32),nonce=randomBytes(12);let protectedKey;
  try{
    const cipher=createCipheriv('aes-256-gcm',key,nonce);cipher.setAAD(MAGIC);
    const encrypted=Buffer.concat([cipher.update(body),cipher.final()]);body.fill(0);
    const archive=Buffer.concat([MAGIC,nonce,cipher.getAuthTag(),encrypted]),archiveSha256=hash(archive);
    protectedKey=Buffer.from(await wrapper.protect(key));if(protectedKey.length<1||protectedKey.length>65536||protectedKey.equals(key))fail('INVALID_KEY_PROTECTION');
    const directory=await createPrivateRecoveryDirectory(outputDirectory);
    const archivePath=join(directory,'source-records.aes256gcm'),keyPath=join(directory,'source-records.key.dpapi.json');
    await writePrivateRecoveryFile(archivePath,archive);
    await writePrivateRecoveryFile(keyPath,Buffer.from(JSON.stringify({version:1,checkpointId,protection:wrapper.id,archiveSha256,manifestSha256:dataset.manifestSha256,protectedKey:protectedKey.toString('base64')})));
    const verified=await verifyEncryptedCheckpoint({archivePath,keyPath,expectedArchiveSha256:archiveSha256,expectedManifestSha256:dataset.manifestSha256,keyProtection:wrapper});
    const receipt=receiptFor(dataset.manifest,{checkpointId,createdAt,evidenceKind:meta.evidenceKind,archivePath,keyPath,archiveBytes:archive.length,archiveSha256,manifestSha256:dataset.manifestSha256,keyProtection:wrapper.id,localIntegrityVerified:verified.localIntegrityVerified,restoreVerified:false,sourceMutations:0,providerWrites:0});
    await writePrivateRecoveryFile(join(directory,'checkpoint-receipt.json'),Buffer.from(JSON.stringify(receipt,null,2)+'\n'));
    return receipt;
  }finally{body.fill(0);key.fill(0);protectedKey?.fill(0);}
}

/** Returns sensitive records in memory for the explicit restore operation only.
 * Callers must not log this result or write it as a plaintext export. */
async function readCheckpoint({archivePath,keyPath,expectedArchiveSha256,expectedManifestSha256,keyProtection=windowsDpapiKeyProtection}){
  if(!hex.test(expectedArchiveSha256??'')||!hex.test(expectedManifestSha256??''))fail('EXPECTED_DIGEST_REQUIRED');
  const provider=protection(keyProtection),archive=await readPrivateRecoveryFile(archivePath,MAX_ARCHIVE_BYTES);
  if(hash(archive)!==expectedArchiveSha256)fail('ARCHIVE_HASH_MISMATCH');
  if(archive.length<MAGIC.length+29||!archive.subarray(0,MAGIC.length).equals(MAGIC))fail('ARCHIVE_FORMAT');
  let key,plaintext;
  try{
    const keyFile=JSON.parse((await readPrivateRecoveryFile(keyPath,100000)).toString('utf8'));
    if(!exact(keyFile,['version','checkpointId','protection','archiveSha256','manifestSha256','protectedKey'])||keyFile.version!==1||keyFile.protection!==provider.id||keyFile.archiveSha256!==expectedArchiveSha256||keyFile.manifestSha256!==expectedManifestSha256||typeof keyFile.protectedKey!=='string'||!/^[A-Za-z0-9+/]+={0,2}$/.test(keyFile.protectedKey))fail('KEY_BINDING');
    key=Buffer.from(await provider.unprotect(Buffer.from(keyFile.protectedKey,'base64')));if(key.length!==32)fail('KEY_INVALID');
    const decipher=createDecipheriv('aes-256-gcm',key,archive.subarray(MAGIC.length,MAGIC.length+12));decipher.setAAD(MAGIC);decipher.setAuthTag(archive.subarray(MAGIC.length+12,MAGIC.length+28));
    plaintext=Buffer.concat([decipher.update(archive.subarray(MAGIC.length+28)),decipher.final()]);
    const text=new TextDecoder('utf-8',{fatal:true}).decode(plaintext),data=JSON.parse(text);
    // The encoder uses this exact representation. Duplicate JSON properties,
    // alternate encodings and unrecognized top-level fields are rejected.
    if(JSON.stringify(data)!==text||!exact(data,['version','scope','checkpointId','createdAt','metadata','schema','entries','manifest'])||data.version!==1||data.scope!=='SOURCE_RECORDS_ONLY'||data.checkpointId!==keyFile.checkpointId||!Array.isArray(data.entries)||data.entries.length>64)fail('ARCHIVE_FORMAT');
    metadataCopy(data.metadata);
    const source={};
    for(const entry of data.entries){
      if(!exact(entry,['table','encoded'])||!/^rivya_[a-z0-9_]{1,56}$/.test(entry.table)||Object.hasOwn(source,entry.table)||!Array.isArray(entry.encoded)||entry.encoded.length>20000)fail('ARCHIVE_FORMAT');
      source[entry.table]=entry.encoded.map(row=>{const parsed=parseLosslessRow(row);if(canonicalArtifactJson(parsed)!==row)fail('ROW_ENCODING');return parsed;});
    }
    const checked=prepareDataset(data.schema,source);
    if(checked.manifestSha256!==expectedManifestSha256||canonicalArtifactJson(checked.manifest)!==canonicalArtifactJson(data.manifest))fail('DATASET_MISMATCH');
    return {source,...checked,checkpointId:data.checkpointId,evidenceKind:data.metadata.evidenceKind};
  }catch(error){if(/^RECOVERY_[A-Z_]+$/.test(error?.message??''))throw error;fail('DECRYPT_OR_DATASET_FAILED');}
  finally{key?.fill(0);plaintext?.fill(0);}
}
export async function verifyEncryptedCheckpoint(input){
  const data=await readCheckpoint(input);
  return receiptFor(data.manifest,{checkpointId:data.checkpointId,evidenceKind:data.evidenceKind,manifestSha256:data.manifestSha256,localIntegrityVerified:true,restoreVerified:false});
}

/** Trusted local hook for aggregate measurement without another source read.
 * Full authentication and reconciliation precede invocation. Nothing in this
 * hook is logged or persisted by the recovery module. Do not return raw data
 * to a public report; the caller owns its explicit aggregate output policy. */
export async function inspectEncryptedCheckpoint(input,inspect){
  if(typeof inspect!=='function')fail('INVALID_INSPECTION_CALLBACK');
  const data=await readCheckpoint(input);
  try{return await inspect({schema:data.measuredSchema,source:data.source});}
  catch{fail('INSPECTION_FAILED');}
}

/** No connection is created here. Caller supplies a new loopback pg.Client.
 * Its startup options must set rivya.recovery_sentinel to target.sentinel.
 * The empty target remains available after success; no DROP or cleanup occurs. */
export async function restoreCheckpointToLoopback({client,target,...checkpoint}){
  if(!client||typeof client.query!=='function'||!exact(target,['host','port','user','database','dataDirectory','sentinel'])||target.host!=='127.0.0.1'||!Number.isInteger(target.port)||target.port<55000||target.port>55999||[55439,55441,55442,55443].includes(target.port)||!/^rivya_recovery_[a-z0-9_]{1,30}$/.test(target.user)||!/^rivya_recovery_[a-z0-9_]{1,30}$/.test(target.database)||!/^[a-f0-9-]{36}$/.test(target.sentinel))fail('LOOPBACK_TARGET_REQUIRED');
  const connection=client.connectionParameters;
  if(!connection||connection.host!==target.host||Number(connection.port)!==target.port||connection.user!==target.user||connection.database!==target.database)fail('LOOPBACK_CONNECTION_MISMATCH');
  await verifyPrivateRecoveryDirectory(target.dataDirectory);
  const data=await readCheckpoint(checkpoint);
  let begun=false;
  try{
    const identity=(await client.query("SELECT current_database() AS database,current_user AS username,host(inet_server_addr()) AS host,inet_server_port() AS port,current_setting('rivya.recovery_sentinel',true) AS sentinel,pg_get_userbyid(datdba) AS owner FROM pg_database WHERE datname=current_database()" )).rows;
    const actualDirectory=(await client.query('SHOW data_directory')).rows[0]?.data_directory;
    if(identity.length!==1||identity[0].host!==target.host||identity[0].port!==target.port||identity[0].username!==target.user||identity[0].database!==target.database||identity[0].owner!==target.user||identity[0].sentinel!==target.sentinel||typeof actualDirectory!=='string'||resolve(actualDirectory).toLowerCase()!==resolve(target.dataDirectory).toLowerCase())fail('LOOPBACK_IDENTITY_MISMATCH');
    await client.query('BEGIN');begun=true;
    await client.query("SET LOCAL statement_timeout='30s'");await client.query("SET LOCAL lock_timeout='5s'");await client.query("SET LOCAL TIME ZONE 'UTC'");
    const count=(await client.query("SELECT count(*)::int AS count FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND c.relkind IN ('r','p','v','m','S','f')")).rows[0]?.count;
    if(count!==0)fail('TARGET_NOT_EMPTY');
    for(const table of data.measuredSchema.tables){
      await client.query('CREATE TABLE public.'+quote(table.sourceTable)+' ('+table.fields.map(f=>quote(f.name)+' '+f.sqlType+(f.nullable?'':' NOT NULL')).join(',')+')');
      const names=table.fields.map(f=>quote(f.name)),parameters=table.fields.map((f,i)=>'$'+(i+1)+'::'+f.sqlType);
      for(const row of data.source[table.sourceTable])await client.query('INSERT INTO public.'+quote(table.sourceTable)+' ('+names.join(',')+') VALUES ('+parameters.join(',')+')',table.fields.map(f=>row[f.name]===null?null:f.representation==='preserved-json'?canonicalArtifactJson(row[f.name]):row[f.name]));
    }
    for(const kind of ['primary','foreign'])for(const table of data.measuredSchema.tables)for(const c of table.constraints){
      if(c.definition.startsWith('FOREIGN KEY')!==(kind==='foreign'))continue;
      await client.query('ALTER TABLE public.'+quote(table.sourceTable)+' ADD CONSTRAINT '+quote(c.name)+' '+constraintSql(c,table,data.measuredSchema.tables));
    }
    const columns=(await client.query("select table_name,column_name,data_type,is_nullable from information_schema.columns where table_schema='public' and table_name like 'rivya_%' order by table_name,ordinal_position")).rows;
    const constraints=(await client.query("select t.relname as source_table,c.conname as name,pg_get_constraintdef(c.oid) as definition from pg_constraint c join pg_class t on t.oid=c.conrelid join pg_namespace n on n.oid=t.relnamespace where n.nspname='public' and t.relname like 'rivya_%' and c.contype in ('p','u','f') order by t.relname,c.conname")).rows;
    verifySourceShape(data.measuredSchema,columns,constraints);
    const restored={};
    for(const table of data.measuredSchema.tables){
      const fields=table.fields.map(f=>quote(f.name)+(f.representation==='decimal-string'?'::text AS '+quote(f.name):''));
      const rows=(await client.query('SELECT row_to_json(source)::text AS row FROM (SELECT '+fields.join(',')+' FROM public.'+quote(table.sourceTable)+') source')).rows;
      restored[table.sourceTable]=rows.map(r=>parseLosslessRow(r.row));
    }
    if(prepareDataset(data.schema,restored).manifestSha256!==data.manifestSha256)fail('RESTORED_DATASET_MISMATCH');
    await client.query('COMMIT');begun=false;
    return receiptFor(data.manifest,{checkpointId:data.checkpointId,evidenceKind:data.evidenceKind,manifestSha256:data.manifestSha256,localIntegrityVerified:true,restoreVerified:true,verificationKind:'loopback-sql-record-restore',sourceMutations:0,providerWrites:0});
  }catch(error){if(begun)await client.query('ROLLBACK').catch(()=>{});if(/^RECOVERY_[A-Z_]+$/.test(error?.message??''))throw error;fail('SQL_RESTORE_FAILED');}
}
