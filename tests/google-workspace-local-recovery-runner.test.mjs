/** Pure runner configuration/argument tests. No service or socket is started. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {restoreCliArguments,localRecoveryChildEnvironment,postgresRestoreConfig,publicRestoreSummary,sanitizedRestoreFailure} from '../tools/google-workspace/run-local-record-restore.mjs';

test('runner accepts only explicit local checkpoint/directory arguments, never source URL or extra switches',()=>{
  const parsed=restoreCliArguments(['--checkpoint','test-results/private/checkpoint-receipt.json','--directory','test-results/new-private-run']);
  assert.ok(parsed.checkpointReceiptPath.endsWith('checkpoint-receipt.json'));
  for(const args of [[],['--source','postgresql://user:secret@example.invalid/db'],['--checkpoint','https://example.invalid/x','--directory','test-results/x'],['--checkpoint','test-results/x','--directory','file:///x'],['--checkpoint','x','--directory','y','--pg-bin','remote']])assert.throws(()=>restoreCliArguments(args),/RECOVERY_(?:INVALID_ARGUMENTS|LOCAL_PATHS_REQUIRED)/);
});
test('native PostgreSQL children inherit only basic Windows environment, not provider or process-injection settings',()=>{
  assert.deepEqual(localRecoveryChildEnvironment({PATH:'runtime',SystemRoot:'C:/Windows',TEMP:'temp',DATABASE_URL:'private',PGHOST:'remote',PGPASSWORD:'private',GOOGLE_TOKEN:'private',NODE_OPTIONS:'--import=untrusted',BLOB_READ_WRITE_TOKEN:'private',STUDIO_SESSION_SECRET:'private'}),{PATH:'runtime',SystemRoot:'C:/Windows',TEMP:'temp'});
});
test('public restore output omits the private checkpoint identifier and preserves truthful scope flags',()=>{
  assert.deepEqual(publicRestoreSummary({checkpointId:'private-checkpoint',scope:'SOURCE_RECORDS_ONLY',sqlNullVersusJsonNullCovered:false,collationsCovered:false,exactSqlSchemaVerified:false}),{scope:'SOURCE_RECORDS_ONLY',sqlNullVersusJsonNullCovered:false,collationsCovered:false,exactSqlSchemaVerified:false});
});
test('failure diagnostics retain only enumerated stages and SQLSTATE or recognized Node codes, never error payloads',()=>{
  assert.deepEqual(sanitizedRestoreFailure({code:'28P01',message:'secret-password',detail:'private-record',query:'private-sql',parameters:['private-value']},'ADMIN_CONNECT'),{errorStage:'ADMIN_CONNECT',sqlState:'28P01',nodeErrorCode:null});
  assert.deepEqual(sanitizedRestoreFailure({code:'ECONNREFUSED',message:'private-url'},'RESTORE_CONNECT'),{errorStage:'RESTORE_CONNECT',sqlState:null,nodeErrorCode:'ECONNREFUSED'});
  assert.deepEqual(sanitizedRestoreFailure({code:'EPERM',message:'private-path'},'WRITE_INITDB_PASSWORD'),{errorStage:'WRITE_INITDB_PASSWORD',sqlState:null,nodeErrorCode:'EPERM'});
  assert.deepEqual(sanitizedRestoreFailure({code:'private-unknown-code',message:'private-url'},'private-stage'),{errorStage:'UNKNOWN',sqlState:null,nodeErrorCode:null});
});
test('local server configuration enforces loopback SCRAM and disables SQL/parameter logging on isolated allowed ports',()=>{
  const config=postgresRestoreConfig(55449);
  for(const expected of ["listen_addresses = '127.0.0.1'","password_encryption = 'scram-sha-256'","log_statement = 'none'","log_parameter_max_length_on_error = 0","log_min_error_statement = 'panic'","log_min_messages = 'panic'"])assert.ok(config.includes(expected));
  for(const port of [5432,55439,55441,55442,55443,56000,0,55449.5,'55449'])assert.throws(()=>postgresRestoreConfig(port),/RECOVERY_INVALID_LOCAL_PORT/);
});
