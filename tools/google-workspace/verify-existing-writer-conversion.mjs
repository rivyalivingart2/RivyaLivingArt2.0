/** Existing signed v1 READ only -> local preservation plan. No commit action.
 * Usage: Node22 --import tsx ... --configuration <private observed file>
 * --directory <new ignored private directory>.
 */
import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {verifyPrivateFilePermissions} from './private-file.ts';
import {createPrivateRecoveryDirectory,writePrivateRecoveryFile} from './local-recovery-files.mjs';
import {createWriterGateway} from '../../src/lib/google-workspace/writer-gateway.ts';
import {canonicalArtifactJson} from '../../src/lib/google-workspace/record-codec.ts';
import {BOUNDED_PROTOCOL} from '../../src/lib/google-workspace/bounded-store.ts';
import {convertLegacyWriter} from './convert-legacy-writer.mjs';

let successfulReadRequests=0;
try{
  const args=process.argv.slice(2);
  if(args.length!==4||args[0]!=='--configuration'||args[2]!=='--directory')throw Error('INVALID_ARGUMENTS');
  const configPath=resolve(args[1]);await verifyPrivateFilePermissions(configPath);
  const config=JSON.parse(readFileSync(configPath,'utf8')),keys=Object.entries(config.keys??{}),registrations=Object.entries(config.resources??{});
  if(keys.length!==1||registrations.length!==4)throw Error('UNEXPECTED_REGISTRATIONS');
  const sourceFiles=['tools/google-workspace/convert-legacy-writer.mjs','src/lib/google-workspace/bounded-store.ts',
    'src/lib/google-workspace/controlled-writer.ts','src/lib/google-workspace/writer-gateway.ts'];
  const hashes=()=>Object.fromEntries(sourceFiles.map(file=>[file,createHash('sha256').update(readFileSync(file,'utf8').replaceAll('\r\n','\n')).digest('hex')]));
  const codeHashes=hashes(),results=[],seen=new Set(),signal=AbortSignal.timeout(180000);
  const gateway=createWriterGateway({endpoint:config.endpoint,keyId:keys[0][0],secret:keys[0][1],timeoutMs:30000},{fetch});
  for(const [key,registration] of registrations){
    const boundary=/^sandbox_(content|operations|security|system)_probe$/.exec(key)?.[1];
    if(!boundary||seen.has(boundary)||registration.key!==key)throw Error('UNEXPECTED_REGISTRATIONS');seen.add(boundary);
    const resource=Object.fromEntries(['key','workbookId','recordSheetId','ledgerSheetId','auditSheetId','historySheetId'].map(name=>[name,registration[name]]));
    const first=await gateway.request('read',{resourceKey:key},{signal});successfulReadRequests++;
    // Local layout fixture only. No real target tab IDs are inferred/reserved.
    const layout={protocol:BOUNDED_PROTOCOL,key,workbookId:'local_conversion_fixture_'+boundary,
      rootSheetId:1,metadataSheetId:2,dataSheetId:3,maxPages:8192,maxMetadataChunks:64};
    const converted=convertLegacyWriter({resource,snapshot:first,layout,epoch:'local-legacy-conversion',
      limits:{maxRowsPerSheet:registration.maxRows}});
    const second=await gateway.request('read',{resourceKey:key},{signal});successfulReadRequests++;
    if(canonicalArtifactJson(first)!==canonicalArtifactJson(second))throw Error('SOURCE_CHANGED_DURING_CONVERSION');
    results.push({...converted.report,boundary,successfulSignedReads:2,sourceReadbackStable:true,
      sourceCoordinatorStateVerified:false,targetLayout:'local-fixture-not-installed'});
  }
  if(JSON.stringify(codeHashes)!==JSON.stringify(hashes()))throw Error('SOURCE_CODE_CHANGED');
  const report={kind:'actual-signed-source-reads-with-local-v1-to-v2-conversion',checkedAt:new Date().toISOString(),
    sourceScope:'existing-isolated-v1-probe-registrations',
    codeHashes,successfulReadRequests,commitRequests:0,canonicalRecords:results.reduce((n,r)=>n+r.records,0),
    preservedMutations:results.reduce((n,r)=>n+r.mutations,0),results,
    sourceReadVerification:true,sourceCoordinatorStateVerified:false,providerConversionVerified:false,
    targetWrites:0,targetInstalled:false,migrationComplete:false,
    limitations:['Only the four existing isolated v1 probe registrations are read; these counts do not describe the full business dataset.',
      'Successful read counts exclude failed or unresolved requests.',
      'The existing read response validates coordinator shape but does not expose or prove an idle coordinator.',
      'Two matching reads are not a write freeze or proof against a later pending outcome.',
      'Only the source reads contacted Google. Target conversion/layout and preservation checks were local.']};
  const directory=await createPrivateRecoveryDirectory(resolve(args[3]));
  await writePrivateRecoveryFile(join(directory,'legacy-conversion-readback.json'),Buffer.from(JSON.stringify(report,null,2)+'\n'));
  console.log(JSON.stringify(report));
}catch(error){
  const code=/^[A-Z_]+$/.test(error?.message??'')?error.message:'LEGACY_CONVERSION_READBACK_FAILED';
  console.error(JSON.stringify({ok:false,code,successfulReadRequests,commitRequests:0,targetWrites:0}));process.exitCode=1;
}
