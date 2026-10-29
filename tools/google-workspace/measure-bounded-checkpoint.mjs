/** Local encrypted checkpoint -> sanitized capacity simulation.
 * No provider request and no raw source persistence. */
import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {inspectEncryptedCheckpoint} from './local-recovery.mjs';
import {readPrivateRecoveryFile,writePrivateRecoveryFile} from './local-recovery-files.mjs';
import {measureBoundedSource} from './bounded-source-measurement.mjs';

const files=['src/lib/google-workspace/bounded-store.ts','tools/google-workspace/bounded-source-measurement.mjs',
  'tools/google-workspace/local-recovery.mjs','tools/google-workspace/local-recovery-files.mjs'];
const hashes=()=>Object.fromEntries(files.map(file=>[file,createHash('sha256').update(readFileSync(file,'utf8').replaceAll('\r\n','\n')).digest('hex')]));
try{
  if(process.argv.length!==4||process.argv[2]!=='--directory')throw Error('INVALID_ARGUMENTS');
  const directory=resolve(process.argv[3]),codeHashes=hashes();
  const receipt=JSON.parse((await readPrivateRecoveryFile(join(directory,'checkpoint-receipt.json'),100000)).toString('utf8'));
  if(receipt.evidenceKind!=='live-source'||receipt.scope!=='SOURCE_RECORDS_ONLY'||receipt.localIntegrityVerified!==true)throw Error('ACTUAL_CHECKPOINT_REQUIRED');
  const report=await inspectEncryptedCheckpoint({
    archivePath:receipt.archivePath,keyPath:receipt.keyPath,
    expectedArchiveSha256:receipt.archiveSha256,expectedManifestSha256:receipt.manifestSha256,
  },measureBoundedSource);
  if(JSON.stringify(hashes())!==JSON.stringify(codeHashes))throw Error('SOURCE_CHANGED_DURING_MEASUREMENT');
  const evidence={...report,codeHashes,sourceCheckpointIntegrityVerified:true,sourceCheckpointCreatedAt:receipt.createdAt,
    checkpointScope:receipt.scope,fullBackup:false,offDeviceVerified:false};
  await writePrivateRecoveryFile(join(directory,'bounded-capacity.json'),Buffer.from(JSON.stringify(evidence,null,2)+'\n'));
  console.log(JSON.stringify(evidence));
}catch(error){
  const code=/^[A-Z_]+$/.test(error?.code??'')?error.code:/^[A-Z_]+$/.test(error?.message??'')?error.message:'BOUNDED_CHECKPOINT_MEASUREMENT_FAILED';
  console.error(JSON.stringify({ok:false,code,providerRequests:0,targetWrites:0}));process.exitCode=1;
}
