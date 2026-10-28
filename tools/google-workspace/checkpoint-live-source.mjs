/** Read-only source -> LOCAL encrypted records checkpoint. No cloud writes.
 * Usage: Node22 --import tsx tools/google-workspace/checkpoint-live-source.mjs
 * --env-file <existing private source env> --directory <new ignored directory>.
 * The archive is SOURCE_RECORDS_ONLY; Blob bytes, repository assets, defaults,
 * extra indexes/roles and off-device recovery are not certified by this tool. */
import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {parseEnv} from 'node:util';
import {createHash} from 'node:crypto';
import {neon,neonConfig} from '@neondatabase/serverless';
import {rehearseLiveSource} from './rehearse-live-source.mjs';
import {createEncryptedCheckpoint} from './local-recovery.mjs';
import {writePrivateMetadata} from './isolated-setup.ts';

let lastStage='arguments',checkpoint=null;
try{
  const args=process.argv.slice(2);
  if(args.length!==4||args[0]!=='--env-file'||args[2]!=='--directory')throw Error('INVALID_ARGUMENTS');
  const outputDirectory=resolve(args[3]),config=parseEnv(readFileSync(args[1],'utf8'));
  if(!config.DATABASE_URL||!/^postgres(?:ql)?:\/\//.test(config.DATABASE_URL))throw Error('SOURCE_NOT_CONFIGURED');
  const schema=JSON.parse(readFileSync('src/lib/google-workspace/schema.json','utf8'));
  const files=['tools/google-workspace/rehearse-live-source.mjs','tools/google-workspace/local-recovery.mjs','tools/google-workspace/local-recovery-files.mjs'];
  const codeHashes=Object.fromEntries(files.map(file=>[file,createHash('sha256').update(readFileSync(file,'utf8').replaceAll('\r\n','\n')).digest('hex')]));
  const totalDeadline=AbortSignal.timeout(30*60*1000);
  neonConfig.fetchFunction=(url,options)=>fetch(url,{...options,signal:AbortSignal.any([totalDeadline,AbortSignal.timeout(45000)])});
  const source=await rehearseLiveSource(neon(config.DATABASE_URL),schema,{pageSize:10,chunkCharacters:32768,
    onProgress(event){lastStage=event.stage;console.error(JSON.stringify({kind:'incomplete-read-progress',...event}));},
    async inspectVerifiedSource({schema:measuredSchema,source:verifiedRows}){
      lastStage='local-encrypted-checkpoint';
      checkpoint=await createEncryptedCheckpoint({schema:measuredSchema,source:verifiedRows,
        metadata:{evidenceKind:'live-source',sourceCheckedAt:new Date().toISOString(),codeHashes},outputDirectory});
    },
  });
  const receipt={kind:'live-source-with-local-encrypted-records-checkpoint',checkedAt:new Date().toISOString(),codeHashes,
    source,checkpoint,productionWrites:0,googleWrites:0,blobWrites:0,fullBackup:false,restoreVerified:false,offDeviceVerified:false};
  await writePrivateMetadata(join(outputDirectory,'source-readback.json'),receipt);
  console.log(JSON.stringify({kind:receipt.kind,checkedAt:receipt.checkedAt,tables:source.relationships.tables,rows:source.relationships.rows,
    constraintsChecked:source.relationships.constraintsChecked,archiveBytes:checkpoint.archiveBytes,localIntegrityVerified:checkpoint.localIntegrityVerified,
    scope:checkpoint.scope,productionWrites:0,providerWrites:0,fullBackup:false,restoreVerified:false,offDeviceVerified:false}));
}catch(error){
  const code=/^[A-Z_]+$/.test(error?.code??'')?error.code:/^[A-Z_]+$/.test(error?.message??'')?error.message:'SOURCE_CHECKPOINT_FAILED';
  console.error(JSON.stringify({ok:false,code,lastStage,localCheckpointCreated:checkpoint!==null,productionWrites:0,providerWrites:0}));
  process.exitCode=1;
}
