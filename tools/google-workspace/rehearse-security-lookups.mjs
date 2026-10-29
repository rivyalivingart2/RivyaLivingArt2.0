/** Local inspection of a verified encrypted checkpoint. No provider writes or
 * target coverage registration; source rows and fingerprints stay in memory. */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {planSecurityLookupProjection} from '../../src/lib/google-workspace/security-lookup-projection.ts';
import {canonicalArtifactJson} from '../../src/lib/google-workspace/record-codec.ts';
import {inspectEncryptedCheckpoint} from './local-recovery.mjs';
import {readPrivateRecoveryFile,writePrivateRecoveryFile,createPrivateRecoveryDirectory} from './local-recovery-files.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const paths=['tools/google-workspace/rehearse-security-lookups.mjs','src/lib/google-workspace/security-lookup-projection.ts','src/lib/google-workspace/schema.json','src/lib/google-workspace/record-codec.ts','tools/google-workspace/local-recovery.mjs'];
const hashes=()=>Object.fromEntries(paths.map(path=>[path,createHash('sha256').update(readFileSync(join(root,path),'utf8').replaceAll('\r\n','\n')).digest('hex')]));
export async function main(args){
  if(args.length!==4||args[0]!=='--checkpoint'||args[2]!=='--directory')throw Error('INVALID_ARGUMENTS');
  const before=hashes(),receipt=JSON.parse((await readPrivateRecoveryFile(resolve(args[1]),100000)).toString('utf8'));
  if(receipt.evidenceKind!=='live-source'||receipt.scope!=='SOURCE_RECORDS_ONLY'||receipt.localIntegrityVerified!==true)throw Error('ACTUAL_CHECKPOINT_REQUIRED');
  const directory=await createPrivateRecoveryDirectory(resolve(args[3]));
  const aggregate=await inspectEncryptedCheckpoint({archivePath:receipt.archivePath,keyPath:receipt.keyPath,expectedArchiveSha256:receipt.archiveSha256,expectedManifestSha256:receipt.manifestSha256},({schema,source})=>{
    const plan=planSecurityLookupProjection({schema,source,coverageId:'local-only-checkpoint-rehearsal',layout:{protocol:'rivya-bounded-v2',key:'security',workbookId:'local_uninstalled_lookup_fixture',rootSheetId:1,metadataSheetId:2,dataSheetId:3,maxPages:8192,maxMetadataChunks:64}});
    return {sourceTables:schema.tables.length,sourceRows:Object.values(source).reduce((sum,rows)=>sum+rows.length,0),...plan.report};
  });
  if(canonicalArtifactJson(before)!==canonicalArtifactJson(hashes()))throw Error('SOURCE_CHANGED_DURING_REHEARSAL');
  const report={...aggregate,kind:'actual-encrypted-checkpoint-local-security-lookup-plan',checkedAt:new Date().toISOString(),sourceCheckpointCreatedAt:receipt.createdAt,sourceCheckpointIntegrityVerified:true,codeHashes:before,providerRequests:0,sourceWrites:0,targetWrites:0,sourceRowsPersisted:0,lookupCoverageRegistered:false,currentProductionInventory:false};
  await writePrivateRecoveryFile(join(directory,'security-lookup-rehearsal.json'),Buffer.from(JSON.stringify(report,null,2)+'\n'));
  return report;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{console.log(JSON.stringify(await main(process.argv.slice(2))));}
  catch(error){const code=/^[A-Z_]+$/.test(error?.message??'')?error.message:'LOOKUP_REHEARSAL_FAILED';console.error(JSON.stringify({ok:false,code,providerRequests:0,targetWrites:0,sourceRowsPersisted:0}));process.exitCode=1;}
}
