/** Local-only operator runner. Starts/stops only its newly created PostgreSQL
 * cluster. No source connection URL, provider credential or product seed input.
 * Node22 --import tsx tools/google-workspace/run-local-record-restore.mjs
 * --checkpoint <private checkpoint-receipt.json> --directory <new ignored dir>
 */
import {randomBytes,randomInt,randomUUID} from 'node:crypto';
import {resolve,join,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {appendFile,open,unlink,stat} from 'node:fs/promises';
import {spawn,execFileSync} from 'node:child_process';
import {createServer} from 'node:net';
import {createPrivateRecoveryDirectory,verifyEncryptedCheckpoint,restoreCheckpointToLoopback,windowsDpapiKeyProtection} from './local-recovery.mjs';
import {readPrivateRecoveryFile,writePrivateRecoveryFile,assertRecoveryPath} from './local-recovery-files.mjs';
import {restrictPrivateFilePermissions} from './private-file.ts';

const PG_BIN='C:/Users/gonda/Documents/Codex/2026-09-23/continue-the-approved-rivyalivingart-redesign-read/work/tooling/postgresql-18.6/pgsql/bin';
const PG_MODULE='C:/Users/gonda/Documents/Codex/2026-09-30/keep-rivyalivingart2-0-as-the-base/work/tooling/local-postgres/node_modules/pg/lib/index.js';
const fail=code=>{throw Error('RECOVERY_'+code);};
const safeCode=error=>/^RECOVERY_[A-Z_]+$/.test(error?.message??'')?error.message:'RECOVERY_LOCAL_RESTORE_FAILED';
const validPort=port=>Number.isInteger(port)&&port>=55000&&port<=55999&&![55439,55441,55442,55443].includes(port);
const ident=value=>{if(!/^rivya_recovery_[a-z0-9_]{1,30}$/.test(value))fail('INVALID_LOCAL_IDENTIFIER');return '"'+value+'"';};
const stages=new Set(['PROTECT_LOCAL_PASSWORD','WRITE_CLUSTER_REGISTRATION','PREPARE_PRIVATE_LOGS','WRITE_INITDB_PASSWORD','INITDB','REMOVE_INITDB_PASSWORD','CONFIGURE_POSTGRES','START_POSTGRES','LOAD_PG_CLIENT','ADMIN_CONNECT','ADMIN_IDENTITY','CHECK_DATABASE_ABSENT','CREATE_DATABASE','RESTORE_CONNECT','CORE_RESTORE','RESTORE_COMPLETE','STOP_POSTGRES','CLOSE_PRIVATE_LOG']);
const nodeCodes=new Set(['ECONNREFUSED','ECONNRESET','ETIMEDOUT','ENOTFOUND','EHOSTUNREACH','EPIPE','EACCES','EPERM','ENOENT','EEXIST','ERR_MODULE_NOT_FOUND','ERR_DLOPEN_FAILED','ERR_INVALID_ARG_TYPE','ERR_INVALID_ARG_VALUE','ERR_OUT_OF_RANGE']);
export function sanitizedRestoreFailure(error,stage){
  const code=typeof error?.code==='string'?error.code:'';
  return {errorStage:stages.has(stage)?stage:'UNKNOWN',sqlState:!nodeCodes.has(code)&&/^[0-9A-Z]{5}$/.test(code)?code:null,nodeErrorCode:nodeCodes.has(code)?code:null};
}

export function restoreCliArguments(args){
  if(args.length!==4||args[0]!=='--checkpoint'||args[2]!=='--directory')fail('INVALID_ARGUMENTS');
  if(!args[1]||!args[3]||/^[a-z][a-z0-9+.-]*:\/\//i.test(args[1])||/^[a-z][a-z0-9+.-]*:\/\//i.test(args[3]))fail('LOCAL_PATHS_REQUIRED');
  return {checkpointReceiptPath:resolve(args[1]),outputDirectory:resolve(args[3])};
}
export function localRecoveryChildEnvironment(inherited=process.env){
  return Object.fromEntries(Object.entries(inherited).filter(([key])=>/^(?:PATH|Path|SystemRoot|SYSTEMROOT|WINDIR|TEMP|TMP|USERPROFILE|APPDATA|LOCALAPPDATA)$/i.test(key)));
}
export function publicRestoreSummary(result){
  const {checkpointId:privateCheckpointId,...summary}=result;
  void privateCheckpointId;
  return summary;
}
export function postgresRestoreConfig(port){
  if(!validPort(port))fail('INVALID_LOCAL_PORT');
  return `\n# Temporary source-record restore: private loopback only.\nlisten_addresses = '127.0.0.1'\nport = ${port}\nmax_connections = 10\nshared_buffers = '32MB'\npassword_encryption = 'scram-sha-256'\nlogging_collector = off\nlog_statement = 'none'\nlog_duration = off\nlog_min_duration_statement = -1\nlog_min_duration_sample = -1\nlog_statement_sample_rate = 0\nlog_transaction_sample_rate = 0\nlog_parameter_max_length = 0\nlog_parameter_max_length_on_error = 0\nlog_min_messages = 'panic'\nlog_min_error_statement = 'panic'\nlog_error_verbosity = 'terse'\nclient_min_messages = 'error'\n`;
}
async function unusedPort(){
  for(let attempt=0;attempt<32;attempt++){
    const port=randomInt(55000,56000);if(!validPort(port))continue;
    const available=await new Promise(accept=>{const server=createServer();server.once('error',()=>accept(false));server.listen(port,'127.0.0.1',()=>server.close(()=>accept(true)));});
    if(available)return port;
  }
  fail('NO_UNUSED_LOCAL_PORT');
}
function runCommand(executable,args,{env,logFd,timeoutMs=45000,allowedCodes=[0]}={}){
  return new Promise((accept,reject)=>{
    let finished=false;
    const child=spawn(executable,args,{env,windowsHide:true,stdio:['ignore',logFd??'ignore',logFd??'ignore']});
    const done=(error,code)=>{if(finished)return;finished=true;clearTimeout(timer);if(error)reject(Error('RECOVERY_POSTGRES_PROCESS_FAILED'));else accept(code);};
    const timer=setTimeout(()=>{child.kill();done(true);},timeoutMs);
    child.once('error',()=>done(true));
    // pg_ctl's server child may retain handles on Windows; use launcher exit.
    child.once('exit',code=>done(!allowedCodes.includes(code),code));
  });
}
async function verifiedAdmin(client,target){
  const rows=(await client.query("SELECT current_database() AS database,current_user AS username,host(inet_server_addr()) AS host,inet_server_port() AS port,current_setting('rivya.recovery_sentinel',true) AS sentinel")).rows;
  const actual=(await client.query('SHOW data_directory')).rows[0]?.data_directory;
  if(rows.length!==1||rows[0].database!=='postgres'||rows[0].username!==target.user||rows[0].host!==target.host||rows[0].port!==target.port||rows[0].sentinel!==target.sentinel||typeof actual!=='string'||resolve(actual).toLowerCase()!==resolve(target.dataDirectory).toLowerCase())fail('LOOPBACK_IDENTITY_MISMATCH');
}

export async function runLocalRecordRestore({checkpointReceiptPath,outputDirectory}){
  const [major,minor]=process.versions.node.split('.').map(Number);
  if(process.platform!=='win32'||major!==22||minor<16)fail('WINDOWS_NODE22_REQUIRED');
  const env=localRecoveryChildEnvironment();
  for(const executable of ['postgres.exe','initdb.exe','pg_ctl.exe'])if(!(await stat(join(PG_BIN,executable))).isFile())fail('POSTGRES_RUNTIME_UNAVAILABLE');
  if(!(await stat(PG_MODULE)).isFile())fail('POSTGRES_CLIENT_UNAVAILABLE');
  const binaryVersions={};
  try{for(const binary of ['postgres','initdb','pg_ctl'])binaryVersions[binary]=execFileSync(join(PG_BIN,binary+'.exe'),['--version'],{env,windowsHide:true,encoding:'utf8',timeout:10000,stdio:['ignore','pipe','ignore']}).trim();}catch{fail('POSTGRES_RUNTIME_UNAVAILABLE');}
  const postgresVersion=binaryVersions.postgres,release=/^postgres \(PostgreSQL\) (18\.[0-9]+)$/.exec(postgresVersion)?.[1];
  if(!release||['initdb','pg_ctl'].some(binary=>binaryVersions[binary]!==binary+' (PostgreSQL) '+release))fail('POSTGRES_RUNTIME_UNSUPPORTED');
  let receipt;
  try{receipt=JSON.parse((await readPrivateRecoveryFile(checkpointReceiptPath,100000)).toString('utf8'));}catch{fail('CHECKPOINT_RECEIPT_UNAVAILABLE');}
  if(receipt.scope!=='SOURCE_RECORDS_ONLY'||!['live-source','synthetic-fixture'].includes(receipt.evidenceKind)||!/^[-a-f0-9]{36}$/.test(receipt.checkpointId??''))fail('CHECKPOINT_RECEIPT_INVALID');
  const parent=dirname(resolve(checkpointReceiptPath));
  if(resolve(receipt.archivePath??'')!==join(parent,'source-records.aes256gcm')||resolve(receipt.keyPath??'')!==join(parent,'source-records.key.dpapi.json'))fail('CHECKPOINT_RECEIPT_INVALID');
  const input={archivePath:receipt.archivePath,keyPath:receipt.keyPath,expectedArchiveSha256:receipt.archiveSha256,expectedManifestSha256:receipt.manifestSha256};
  const verified=await verifyEncryptedCheckpoint(input);
  if(verified.checkpointId!==receipt.checkpointId||verified.evidenceKind!==receipt.evidenceKind)fail('CHECKPOINT_RECEIPT_INVALID');
  const directory=await createPrivateRecoveryDirectory(outputDirectory);
  const dataDirectory=await createPrivateRecoveryDirectory(join(directory,'pgdata'));
  const target={host:'127.0.0.1',port:await unusedPort(),user:'rivya_recovery_'+randomBytes(8).toString('hex'),database:'rivya_recovery_'+randomBytes(8).toString('hex'),dataDirectory,sentinel:randomUUID()};
  const password=Buffer.from(randomBytes(32).toString('hex'),'ascii');
  const passwordFile=join(directory,'initdb-password.temporary');
  const initLogPath=join(directory,'postgres-lifecycle.log'),serverLogPath=join(directory,'postgres.log');
  let logHandle,started=false,startAttempted=false,stopped=false,passwordFileCreated=false,passwordRemoved=false,restore=null,errorCode=null;
  let stage='PROTECT_LOCAL_PASSWORD',failure=null,cleanupFailure=null;
  try{
    const protectedPassword=await windowsDpapiKeyProtection.protect(password);
    try{await writePrivateRecoveryFile(join(directory,'local-role-password.dpapi.json'),Buffer.from(JSON.stringify({version:1,protection:windowsDpapiKeyProtection.id,protectedPassword:protectedPassword.toString('base64')})));}finally{protectedPassword.fill(0);}
    stage='WRITE_CLUSTER_REGISTRATION';
    await writePrivateRecoveryFile(join(directory,'cluster-registration.json'),Buffer.from(JSON.stringify({version:1,scope:'SOURCE_RECORDS_ONLY',checkpointId:receipt.checkpointId,target,postgresVersion,nodeVersion:process.version,pgBin:PG_BIN,pgModule:PG_MODULE,passwordProtection:windowsDpapiKeyProtection.id,sourceCredentialsUsed:false},null,2)+'\n'));
    stage='PREPARE_PRIVATE_LOGS';
    await writePrivateRecoveryFile(initLogPath,Buffer.from('Local source-record restore lifecycle. No source credentials or record values are logged by this runner.\n'));
    await writePrivateRecoveryFile(serverLogPath,Buffer.from(''));
    logHandle=await open(initLogPath,'a');
    stage='WRITE_INITDB_PASSWORD';await writePrivateRecoveryFile(passwordFile,password);passwordFileCreated=true;
    try{
      stage='INITDB';
      await runCommand(join(PG_BIN,'initdb.exe'),['-D',dataDirectory,'-U',target.user,'--auth-local=scram-sha-256','--auth-host=scram-sha-256','--encoding=UTF8','--locale=C','--pwfile='+passwordFile],{env,logFd:logHandle.fd,timeoutMs:120000});
    }finally{
      // This exact file was just created with wx inside the verified private
      // directory. No recursive delete and no pre-existing path is removed.
      if(passwordFileCreated){const priorStage=stage;stage='REMOVE_INITDB_PASSWORD';await assertRecoveryPath(passwordFile,{exists:true});await unlink(passwordFile);passwordRemoved=true;stage=priorStage;}
    }
    stage='CONFIGURE_POSTGRES';
    const configPath=join(dataDirectory,'postgresql.conf');await restrictPrivateFilePermissions(configPath);await appendFile(configPath,postgresRestoreConfig(target.port));
    stage='START_POSTGRES';startAttempted=true;
    await runCommand(join(PG_BIN,'pg_ctl.exe'),['start','-D',dataDirectory,'-l',serverLogPath,'-w','-t','30'],{env,logFd:logHandle.fd});started=true;
    stage='LOAD_PG_CLIENT';const {default:pg}=await import(pathToFileURL(PG_MODULE).href);
    const options={host:target.host,port:target.port,user:target.user,password:password.toString('ascii'),ssl:false,connectionTimeoutMillis:10000,query_timeout:60000,application_name:'rivya-local-record-recovery',options:'-c rivya.recovery_sentinel='+target.sentinel};
    const admin=new pg.Client({...options,database:'postgres'});
    try{
      stage='ADMIN_CONNECT';await admin.connect();stage='ADMIN_IDENTITY';await verifiedAdmin(admin,target);
      stage='CHECK_DATABASE_ABSENT';
      if((await admin.query('SELECT 1 FROM pg_database WHERE datname=$1',[target.database])).rowCount!==0)fail('DATABASE_ALREADY_EXISTS');
      // PostgreSQL identifiers cannot be parameters. Both are fresh generated
      // identifiers validated by ident(); record INSERT values are parameterized.
      stage='CREATE_DATABASE';await admin.query('CREATE DATABASE '+ident(target.database)+' OWNER '+ident(target.user)+' TEMPLATE template0');
    }finally{await admin.end().catch(()=>{});}
    const client=new pg.Client({...options,database:target.database});
    try{stage='RESTORE_CONNECT';await client.connect();stage='CORE_RESTORE';restore=await restoreCheckpointToLoopback({...input,client,target});stage='RESTORE_COMPLETE';}
    finally{await client.end().catch(()=>{});}
  }catch(error){errorCode=safeCode(error);failure=sanitizedRestoreFailure(error,stage);}
  finally{
    password.fill(0);
    if(passwordFileCreated&&!passwordRemoved){try{await assertRecoveryPath(passwordFile,{exists:true});await unlink(passwordFile);passwordRemoved=true;}catch(error){errorCode??='RECOVERY_TEMPORARY_PASSWORD_CLEANUP_FAILED';cleanupFailure=sanitizedRestoreFailure(error,'REMOVE_INITDB_PASSWORD');}}
    if(startAttempted){
      try{
        const status=await runCommand(join(PG_BIN,'pg_ctl.exe'),['status','-D',dataDirectory],{env,logFd:logHandle?.fd,allowedCodes:[0,3]});
        if(status===0)await runCommand(join(PG_BIN,'pg_ctl.exe'),['stop','-D',dataDirectory,'-m','fast','-w','-t','30'],{env,logFd:logHandle?.fd});
        stopped=await runCommand(join(PG_BIN,'pg_ctl.exe'),['status','-D',dataDirectory],{env,logFd:logHandle?.fd,allowedCodes:[3]})===3;
      }catch(error){errorCode??='RECOVERY_OWNED_SERVER_STOP_UNVERIFIED';cleanupFailure=sanitizedRestoreFailure(error,'STOP_POSTGRES');}
    }else stopped=true;
    try{await logHandle?.close();}catch(error){errorCode??='RECOVERY_PRIVATE_LOG_CLOSE_FAILED';cleanupFailure=sanitizedRestoreFailure(error,'CLOSE_PRIVATE_LOG');}
  }
  const result={kind:'actual-loopback-source-record-restore',checkedAt:new Date().toISOString(),scope:'SOURCE_RECORDS_ONLY',checkpointId:receipt.checkpointId,evidenceKind:receipt.evidenceKind,ok:!errorCode&&restore?.restoreVerified===true&&stopped&&passwordRemoved,
    tables:verified.tables,rows:verified.rows,constraintsChecked:verified.constraintsChecked,restoreVerified:restore?.restoreVerified===true,postgresVersion,nodeVersion:process.version,
    postgresStarted:started,postgresStopped:stopped,temporaryPasswordRemoved:passwordRemoved,localPasswordProtected:windowsDpapiKeyProtection.id,sourceCredentialsUsed:false,sourceMutations:0,providerWrites:0,
    fullBackup:false,offDeviceVerified:false,operationalRecoveryVerified:false,blobObjectsIncluded:0,repositoryFilesIncluded:0,
    sqlNullVersusJsonNullCovered:false,collationsCovered:false,exactSqlSchemaVerified:false,errorCode,
    errorStage:failure?.errorStage??cleanupFailure?.errorStage??null,sqlState:failure?.sqlState??null,nodeErrorCode:failure?.nodeErrorCode??null,cleanupFailure};
  await writePrivateRecoveryFile(join(directory,'loopback-restore-receipt.json'),Buffer.from(JSON.stringify(result,null,2)+'\n'));
  return result;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  if(process.argv.length===3&&process.argv[2]==='--help'){
    console.log('Node22 --import tsx tools/google-workspace/run-local-record-restore.mjs --checkpoint <private checkpoint-receipt.json> --directory <new ignored owner-only run directory>');
  }else{
    try{const result=await runLocalRecordRestore(restoreCliArguments(process.argv.slice(2)));console.log(JSON.stringify(publicRestoreSummary(result)));if(!result.ok)process.exitCode=1;}
    catch(error){console.error(JSON.stringify({ok:false,code:safeCode(error),sourceMutations:0,providerWrites:0}));process.exitCode=1;}
  }
}
