/** Actual source rows, local target representation only. No provider dispatch,
 * persistence of raw rows, returned Google IDs, or migration acceptance. */
import {createHash} from 'node:crypto';
import {canonicalArtifactJson,planRecordMutation} from '../../src/lib/google-workspace/record-codec.ts';
import {BOUNDED_PROTOCOL,BOUNDED_LIMITS,buildBoundedState,auditBoundedState,measureBoundedState,
  readBoundedRecords,requiredBoundedPageIds,prepareBoundedCommit,boundedRequestBytes} from '../../src/lib/google-workspace/bounded-store.ts';
import {planSourceRecord,reconcileSource} from './migration.mjs';

const digest=value=>createHash('sha256').update(canonicalArtifactJson(value)).digest('hex');
const actor={id:'local-source-measurement'};
const permissiveLocalPolicy={authorize:()=>true,validate:()=>true};
const keys=['content','operations','security','system'];

export async function measureBoundedSource({schema,source,now=new Date().toISOString()}) {
  const relationships=reconcileSource(schema,source);
  const groups=new Map(keys.map(key=>[key,{plans:[],unmaterialized:[],sourceRows:0}]));
  for(const table of schema.tables){
    const group=groups.get(table.workbook);if(!group)throw Error('UNMAPPED_WORKBOOK');
    for(const row of source[table.sourceTable]){
      const planned=planSourceRecord(table,row);group.sourceRows++;
      if(planned.disposition==='drive-artifact-required'){
        if(planned.driveFileId!==null)throw Error('FABRICATED_ARTIFACT_REFERENCE');
        group.unmaterialized.push({bytes:planned.bytes,characters:planned.characters});continue;
      }
      const record=planned.record;
      const mutation=planRecordMutation({current:null,previousMutation:null,actor,now,authorize:()=>true,command:{
        recordId:record.recordId,expectedRevision:0,mutationId:record.lastMutationId,payload:record.payload,
        sourceUpdatedAt:record.sourceUpdatedAt,archivedAt:record.archivedAt,
      }});
      if(mutation.kind!=='apply'||canonicalArtifactJson(mutation.record)!==canonicalArtifactJson(record))throw Error('SOURCE_ENCODING_MISMATCH');
      group.plans.push(mutation);
    }
  }
  const workbooks=[];
  for(const [workbook,group] of groups){
    // These identifiers designate ONLY in-memory layout fixtures. They are never
    // passed to a provider or presented as Google-created resource/output IDs.
    const layout={protocol:BOUNDED_PROTOCOL,key:workbook,workbookId:'local_fixture_'+workbook,
      rootSheetId:1,metadataSheetId:2,dataSheetId:3,maxPages:8192,maxMetadataChunks:64};
    const state=buildBoundedState({layout,epoch:'local-source-layout-v2',plans:group.plans});
    const audit=auditBoundedState(layout,state),measurement=measureBoundedState(layout,state);
    const ids=group.plans.map(p=>p.record.recordId),restored=readBoundedRecords(layout,state,ids);
    const expected=group.plans.map(p=>[p.record.recordId,p.record.payloadSha256]).sort();
    const actual=[...restored.values()].map(p=>[p.recordId,p.payloadSha256]).sort();
    if(digest(expected)!==digest(actual)||restored.size!==group.plans.length)throw Error('SOURCE_ROUNDTRIP_MISMATCH');
    // Select the largest individual encoded payloads, then measure the complete
    // unchanged-payload update envelopes against the actual packed page layout.
    // These plans are never submitted, even to an emulator or live provider.
    const candidates=[...group.plans].sort((a,b)=>canonicalArtifactJson(b.record.payload).length-canonicalArtifactJson(a.record.payload).length).slice(0,8);
    const preparedSizes=[],workingPageCounts=[];
    for(const [index,p] of candidates.entries()){
      const command={recordId:p.record.recordId,expectedRevision:1,mutationId:'local-capacity-update-'+index,
        payload:p.record.payload,sourceUpdatedAt:p.record.sourceUpdatedAt,archivedAt:p.record.archivedAt};
      const required=requiredBoundedPageIds(state.manifest,[command]);
      const workingState={root:state.root,manifest:state.manifest,pages:state.pages.filter(page=>required.includes(page.id))};
      const result=await prepareBoundedCommit({layout,state:workingState,commands:[command],actor,
        operationId:'local-capacity-operation-'+index,now,policy:permissiveLocalPolicy});
      if(result.kind!=='commit')throw Error('INVALID_CAPACITY_PREPARATION');
      preparedSizes.push(boundedRequestBytes('commit',result.prepared));workingPageCounts.push(required.length);
    }
    workbooks.push({workbook,sourceRows:group.sourceRows,inlineRecords:group.plans.length,
      unmaterializedDocuments:group.unmaterialized.length,unmaterializedPayloadBytes:group.unmaterialized.reduce((n,p)=>n+p.bytes,0),
      originalInlinePayloadHashesMatched:true,historyCoverage:audit,...measurement,
      maximumPreparedRequestBytes:preparedSizes.length?Math.max(...preparedSizes):null,
      representativePreparedUpdates:preparedSizes.length,maximumWorkingPages:workingPageCounts.length?Math.max(...workingPageCounts):0,
      maximumReadRequestsPerPreparedUpdate:workingPageCounts.length?1+Math.ceil(Math.max(...workingPageCounts)/BOUNDED_LIMITS.readPagesPerRequest):0,
      maximumRequestsIncludingCommit:workingPageCounts.length?2+Math.ceil(Math.max(...workingPageCounts)/BOUNDED_LIMITS.readPagesPerRequest):0,
      providerLatencyMeasured:false,
      preparedUpdateFits:preparedSizes.every(n=>n<=BOUNDED_LIMITS.requestBytes)});
  }
  return {schemaVersion:1,kind:'actual-source-with-local-bounded-target-simulation',checkedAt:new Date().toISOString(),relationships,
    sourceRows:relationships.rows,inlineRecords:workbooks.reduce((n,w)=>n+w.inlineRecords,0),
    unresolvedDriveDocuments:workbooks.reduce((n,w)=>n+w.unmaterializedDocuments,0),
    workbooks,simulatedTarget:true,providerVerified:false,targetWrites:0,rawRowsPersisted:0,
    migrationComplete:false,completeTargetCapacityVerified:false,
    limitations:['Target registrations and bootstrap mutation wrappers are local fixtures, not provider-created outputs.',
      'Large documents remain unmaterialized; no Google IDs or canonical references were invented.',
      'Measured update envelopes are prepared locally and never dispatched.',
      'Metadata/index capacity is finite and exhaustion rejects without deleting history.',
      'Full provider latency, quota, race safety and ongoing-free account storage remain unverified.']};
}
