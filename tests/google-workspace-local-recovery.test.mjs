/** Synthetic records and SQL-driver fixtures only. These tests do not claim a
 * real production backup, local PostgreSQL restore, Google check or migration. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID, createHash, createCipheriv, createDecipheriv} from 'node:crypto';
import {readFile, writeFile, stat} from 'node:fs/promises';
import {resolve,relative,join,dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createEncryptedCheckpoint, verifyEncryptedCheckpoint, inspectEncryptedCheckpoint, restoreCheckpointToLoopback, createPrivateRecoveryDirectory, windowsDpapiKeyProtection} from '../tools/google-workspace/local-recovery.mjs';
import {assertRecoveryPath} from '../tools/google-workspace/local-recovery-files.mjs';
import {canonicalArtifactJson} from '../src/lib/google-workspace/record-codec.ts';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const child={sourceTable:'rivya_recovery_child',workbook:'system',primaryKey:['id'],fields:[
  {name:'id',sqlType:'bigint',representation:'decimal-string',nullable:false},
  {name:'parent_id',sqlType:'text',representation:'text',nullable:false},
  {name:'payload',sqlType:'jsonb',representation:'preserved-json',nullable:false},
  {name:'note',sqlType:'text',representation:'text',nullable:true}],constraints:[
  {name:'child_parent_fk',definition:'FOREIGN KEY (parent_id) REFERENCES rivya_recovery_parent(id)'},
  {name:'child_pk',definition:'PRIMARY KEY (id)'}]};
const parent={sourceTable:'rivya_recovery_parent',workbook:'system',primaryKey:['id'],fields:[
  {name:'id',sqlType:'text',representation:'text',nullable:false},
  {name:'description',sqlType:'text',representation:'text',nullable:false}],constraints:[{name:'parent_pk',definition:'PRIMARY KEY (id)'}]};
const schema={schemaVersion:1,tables:[child,parent,{...parent,sourceTable:'rivya_unavailable_source'}]};
const source={rivya_recovery_child:[{id:'9007199254740993',parent_id:'0007',payload:{literal:'=SUM(A1)',text:'ગુજરાતી हिन्दी',long:'x'.repeat(50000),nested:{paise:150050}},note:null}],rivya_recovery_parent:[{id:'0007',description:'Preserved existing fixture identity'}]};
const metadata={evidenceKind:'synthetic-fixture',sourceCheckedAt:'2026-10-28T18:00:00.000Z'};
// Test-only encryption wrapping avoids writing a plaintext fixture key. The
// key-protection ID remains explicit, never reported as actual Windows DPAPI.
const testProtection={id:'synthetic-test-aes-wrapping-v1',
  async protect(key){const nonce=Buffer.alloc(12,7),cipher=createCipheriv('aes-256-gcm',Buffer.alloc(32,11),nonce);return Buffer.concat([nonce,cipher.update(key),cipher.final(),cipher.getAuthTag()]);},
  async unprotect(value){const decipher=createDecipheriv('aes-256-gcm',Buffer.alloc(32,11),value.subarray(0,12));decipher.setAuthTag(value.subarray(-16));return Buffer.concat([decipher.update(value.subarray(12,-16)),decipher.final()]);}};
const options=receipt=>({archivePath:receipt.archivePath,keyPath:receipt.keyPath,expectedArchiveSha256:receipt.archiveSha256,expectedManifestSha256:receipt.manifestSha256,keyProtection:testProtection});
async function make(extra={}){return createEncryptedCheckpoint({schema,source,metadata,outputDirectory:resolve('test-results','local-recovery-unit-'+randomUUID()),keyProtection:testProtection,...extra});}

test('ignored but tracked missing recovery destinations are rejected without changing the repository index',async()=>{
  const directory=await createPrivateRecoveryDirectory(resolve('test-results','local-recovery-index-fixture-'+randomUUID()));
  const alternateIndex=join(directory,'synthetic.index'),destination=join(directory,'missing-run','source-records.aes256gcm');
  const env={...process.env,GIT_INDEX_FILE:alternateIndex};
  const git=args=>execFileSync('git',args,{env,encoding:'utf8',stdio:['ignore','pipe','ignore'],windowsHide:true});
  // Reference an already existing nonsensitive object. No data object is
  // written, and all index mutations are confined to this ignored test index.
  const blob=git(['rev-parse','HEAD:README.md']).trim();
  git(['read-tree','--empty']);
  git(['update-index','--add','--cacheinfo','100644',blob,relative(process.cwd(),destination).replaceAll('\\','/')]);
  const previous=process.env.GIT_INDEX_FILE;
  try{
    process.env.GIT_INDEX_FILE=alternateIndex;
    await assert.rejects(assertRecoveryPath(destination),/RECOVERY_PRIVATE_PATH_OR_PERMISSIONS/);
    await assert.rejects(assertRecoveryPath(dirname(destination)),/RECOVERY_PRIVATE_PATH_OR_PERMISSIONS/);
    assert.equal(await assertRecoveryPath(join(directory,'untracked-new-run')),join(directory,'untracked-new-run'));
  }finally{if(previous===undefined)delete process.env.GIT_INDEX_FILE;else process.env.GIT_INDEX_FILE=previous;}
});

test('encrypted local checkpoint preserves source identity/types and advertises its incomplete backup scope',async()=>{
  const receipt=await make(),verified=await verifyEncryptedCheckpoint(options(receipt));
  assert.equal(receipt.evidenceKind,'synthetic-fixture');assert.equal(receipt.tables,2);assert.equal(receipt.rows,2);assert.equal(receipt.constraintsChecked,3);
  assert.equal(receipt.scope,'SOURCE_RECORDS_ONLY');assert.equal(receipt.restoreVerified,false);assert.equal(receipt.fullBackup,false);assert.equal(receipt.offDeviceVerified,false);assert.equal(receipt.blobObjectsIncluded,0);assert.equal(receipt.repositoryFilesIncluded,0);
  assert.equal(verified.manifestSha256,receipt.manifestSha256);assert.equal(verified.localIntegrityVerified,true);
  const archive=await readFile(receipt.archivePath),keyFile=await readFile(receipt.keyPath,'utf8');
  assert.ok(!archive.includes(Buffer.from('9007199254740993')));assert.ok(!archive.includes(Buffer.from('ગુજરાતી')));assert.ok(!keyFile.includes('9007199254740993'));
  assert.equal((await stat(receipt.archivePath)).size,receipt.archiveBytes);
  const measured=await inspectEncryptedCheckpoint(options(receipt),({schema:available,source:rows})=>{assert.equal(rows.rivya_recovery_child[0].id,'9007199254740993');assert.equal(canonicalArtifactJson(rows.rivya_recovery_child[0].payload),canonicalArtifactJson(source.rivya_recovery_child[0].payload));return {tables:available.tables.length,rows:Object.values(rows).reduce((sum,r)=>sum+r.length,0)};});
  assert.deepEqual(measured,{tables:2,rows:2});
  await assert.rejects(make({outputDirectory:resolve(receipt.archivePath,'..')}),/RECOVERY_PRIVATE_PATH_OR_PERMISSIONS/);
});

test('schema, duplicate identity, broken relationship, missing fields and path escapes reject before writing',async()=>{
  await assert.rejects(make({source:{...source,rivya_recovery_child:[...source.rivya_recovery_child,...source.rivya_recovery_child]}}),{code:'DUPLICATE_KEY'});
  await assert.rejects(make({source:{...source,rivya_recovery_child:[{...source.rivya_recovery_child[0],parent_id:'missing'}]}}),{code:'BROKEN_RELATIONSHIP'});
  await assert.rejects(make({source:{...source,rivya_recovery_child:[{id:'1'}]}}),{code:'MISSING_FIELD'});
  await assert.rejects(make({schema:{...schema,tables:[{...child,fields:[{...child.fields[0],sqlType:'text); DROP TABLE x;--'}]},parent]}}),/RECOVERY_INVALID_SCHEMA/);
  await assert.rejects(make({source:{...source,rivya_unknown:[]}}),/RECOVERY_UNKNOWN_SOURCE_TABLE/);
  await assert.rejects(make({outputDirectory:resolve('tools','recovery-output-forbidden')}),/RECOVERY_PRIVATE_PATH_OR_PERMISSIONS/);
  await assert.rejects(make({outputDirectory:resolve('test-results','..','recovery-output-forbidden')}),/RECOVERY_PRIVATE_PATH_OR_PERMISSIONS/);
  await assert.rejects(make({keyProtection:{...testProtection,protect:async key=>key}}),/RECOVERY_INVALID_KEY_PROTECTION/);
});

test('wrong expected dataset, wrong decryption key and ciphertext tampering cannot verify',async()=>{
  const receipt=await make(),input=options(receipt);
  let callbacks=0;
  await assert.rejects(verifyEncryptedCheckpoint({...input,expectedManifestSha256:'0'.repeat(64)}),/RECOVERY_KEY_BINDING/);
  await assert.rejects(verifyEncryptedCheckpoint({...input,keyProtection:{...testProtection,unprotect:async()=>Buffer.alloc(32,99)}}),/RECOVERY_DECRYPT_OR_DATASET_FAILED/);
  await assert.rejects(inspectEncryptedCheckpoint({...input,keyProtection:{...testProtection,unprotect:async()=>Buffer.alloc(32,99)}},()=>{callbacks++;}),/RECOVERY_DECRYPT_OR_DATASET_FAILED/);
  const archive=await readFile(receipt.archivePath);archive[archive.length-1]^=1;await writeFile(receipt.archivePath,archive);
  await assert.rejects(verifyEncryptedCheckpoint(input),/RECOVERY_ARCHIVE_HASH_MISMATCH/);
  await assert.rejects(inspectEncryptedCheckpoint(input,()=>{callbacks++;}),/RECOVERY_ARCHIVE_HASH_MISMATCH/);
  // Even an altered outer digest cannot make damaged authenticated ciphertext pass.
  const wrapped=JSON.parse(await readFile(receipt.keyPath,'utf8'));wrapped.archiveSha256=sha(archive);await writeFile(receipt.keyPath,JSON.stringify(wrapped));
  await assert.rejects(verifyEncryptedCheckpoint({...input,expectedArchiveSha256:sha(archive)}),/RECOVERY_DECRYPT_OR_DATASET_FAILED/);
  assert.equal(callbacks,0);
});

test('truncated archive and missing expected digests reject',async()=>{
  const receipt=await make(),input=options(receipt),short=(await readFile(receipt.archivePath)).subarray(0,12);await writeFile(receipt.archivePath,short);
  await assert.rejects(verifyEncryptedCheckpoint({...input,expectedArchiveSha256:sha(short)}),/RECOVERY_ARCHIVE_FORMAT/);
  await assert.rejects(verifyEncryptedCheckpoint({...input,expectedArchiveSha256:undefined}),/RECOVERY_EXPECTED_DIGEST_REQUIRED/);
});

async function target(){return {host:'127.0.0.1',port:55449,user:'rivya_recovery_fixture',database:'rivya_recovery_fixture',dataDirectory:await createPrivateRecoveryDirectory(resolve('test-results','local-recovery-pg-fixture-'+randomUUID())),sentinel:randomUUID()};}
function driver(target,{host=target.host,count=0,alter=false,failInsert=false}={}){
  const calls=[];return {calls,connectionParameters:{host:target.host,port:target.port,user:target.user,database:target.database},async query(sql,parameters){
    calls.push({sql,parameters});
    if(sql.startsWith('SELECT current_database'))return {rows:[{database:target.database,username:target.user,host,port:target.port,sentinel:target.sentinel,owner:target.user}]};
    if(sql==='SHOW data_directory')return {rows:[{data_directory:target.dataDirectory}]};
    if(sql.startsWith('SELECT count(*)'))return {rows:[{count}]};
    if(sql.includes('information_schema.columns'))return {rows:[child,parent].flatMap(t=>t.fields.map(f=>({table_name:t.sourceTable,column_name:f.name,data_type:f.sqlType,is_nullable:f.nullable?'YES':'NO'})))};
    if(sql.includes('pg_constraint'))return {rows:[child,parent].flatMap(t=>t.constraints.map(c=>({source_table:t.sourceTable,...c})))};
    if(sql.startsWith('SELECT row_to_json')){const table=sql.match(/FROM public\."([a-z_]+)"/)[1];return {rows:source[table].map(row=>({row:canonicalArtifactJson(alter&&table===child.sourceTable?{...row,note:'altered'}:row)}))};}
    if(failInsert&&sql.startsWith('INSERT'))throw Error('Private database error must not escape');
    return {rows:[]};
  }};
}
test('SQL-driver fixture verifies restored dataset with bigint and JSON parameters without claiming provider acceptance',async()=>{
  const receipt=await make(),destination=await target(),client=driver(destination);
  const result=await restoreCheckpointToLoopback({...options(receipt),target:destination,client});
  assert.equal(result.restoreVerified,true);assert.equal(result.evidenceKind,'synthetic-fixture');assert.equal(result.fullBackup,false);assert.equal(result.operationalRecoveryVerified,false);
  assert.equal(client.calls.at(-1).sql,'COMMIT');assert.equal(client.calls.filter(c=>c.sql.startsWith('INSERT')).length,2);
  const insert=client.calls.find(c=>c.sql.startsWith('INSERT')&&c.sql.includes(child.sourceTable));assert.equal(insert.parameters[0],'9007199254740993');assert.equal(insert.parameters[1],'0007');assert.equal(insert.parameters[2],canonicalArtifactJson(source.rivya_recovery_child[0].payload));
  assert.ok(client.calls.every(c=>!/^DROP|^TRUNCATE|^DELETE/.test(c.sql)));
});
test('restore denies remote/wrong/nonempty targets and rolls back a changed dataset or SQL failure',async()=>{
  const receipt=await make(),destination=await target();
  const wrong=driver(destination,{host:'192.0.2.1'});await assert.rejects(restoreCheckpointToLoopback({...options(receipt),target:destination,client:wrong}),/RECOVERY_LOOPBACK_IDENTITY_MISMATCH/);assert.ok(wrong.calls.every(c=>!c.sql.startsWith('CREATE')));
  const remote=driver(destination);remote.connectionParameters.host='database.example';await assert.rejects(restoreCheckpointToLoopback({...options(receipt),target:destination,client:remote}),/RECOVERY_LOOPBACK_CONNECTION_MISMATCH/);assert.equal(remote.calls.length,0);
  await assert.rejects(restoreCheckpointToLoopback({...options(receipt),target:{...destination,host:'database.example'},client:driver(destination)}),/RECOVERY_LOOPBACK_TARGET_REQUIRED/);
  for(const [changes,error] of [[{count:1},/RECOVERY_TARGET_NOT_EMPTY/],[{alter:true},/RECOVERY_RESTORED_DATASET_MISMATCH/],[{failInsert:true},/^Error: RECOVERY_SQL_RESTORE_FAILED$/]]){
    const client=driver(destination,changes);await assert.rejects(restoreCheckpointToLoopback({...options(receipt),target:destination,client}),error);assert.equal(client.calls.at(-1).sql,'ROLLBACK');assert.ok(!client.calls.some(c=>c.sql==='COMMIT'));
  }
});
test('Windows DPAPI wraps and unwraps a real local fixture key without a provider', {skip:process.platform!=='win32'},async()=>{
  const value=Buffer.alloc(32,17),protectedValue=await windowsDpapiKeyProtection.protect(value),readback=await windowsDpapiKeyProtection.unprotect(protectedValue);
  assert.ok(!protectedValue.equals(value));assert.deepEqual(readback,value);value.fill(0);readback.fill(0);
});
