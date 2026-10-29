/** Pure preservation planner for an existing v1 canonical writer snapshot.
 * No provider dispatch, registration, bootstrap, runtime selection or import.
 * Returned state/guards contain private source data: never print or commit them.
 */
import {canonicalArtifactJson,decodeRecord,planRecordMutation} from '../../src/lib/google-workspace/record-codec.ts';
import {decodeCanonicalWriterSnapshot,normalizeWriterSnapshot,resolveWriterLimits} from '../../src/lib/google-workspace/controlled-writer.ts';
import {validateBoundedLayout,buildBoundedState,auditBoundedState,measureBoundedState,readBoundedRecords} from '../../src/lib/google-workspace/bounded-store.ts';

export class LegacyWriterConversionError extends Error {
  constructor(code){super('Legacy writer conversion: '+code+'.');this.name='LegacyWriterConversionError';this.code=code;}
}
const fail=code=>{throw new LegacyWriterConversionError(code);};
const same=(a,b)=>canonicalArtifactJson(a)===canonicalArtifactJson(b);

export function convertLegacyWriter({resource,snapshot,layout:targetLayout,epoch,limits:inputLimits}){
  try{
    if(resource.relationshipSheetIds?.length)fail('relationship-layout-unsupported');
    const limits=resolveWriterLimits(inputLimits),layout=validateBoundedLayout(targetLayout);
    if(layout.key!==resource.key)fail('boundary-mismatch');
    const current=decodeCanonicalWriterSnapshot(resource,snapshot,limits);
    const normalized=normalizeWriterSnapshot(resource,snapshot,limits);
    const ledgers=normalized.sheets.get(resource.ledgerSheetId).slice(1).map(row=>JSON.parse(row[4]));
    const audits=new Map(normalized.sheets.get(resource.auditSheetId).slice(1).map(row=>[row[0],JSON.parse(row[3])]));
    const history=new Map(normalized.sheets.get(resource.historySheetId).slice(1).map(row=>{
      const record=decodeRecord(row);return [record.lastMutationId,record];
    }));
    const previous=new Map(),plans=[];
    // Preserve observed ledger order. Reordered rows that violate a record's
    // predecessor order require reconciliation; never silently sort.
    for(const ledger of ledgers){
      const record=history.get(ledger.mutationId),prior=previous.get(ledger.recordId)??null;
      if(!record||record.revision!==(prior?.revision??0)+1)fail('predecessor-order');
      const plan=planRecordMutation({
        current:prior,previousMutation:null,actor:{id:ledger.actorId},now:ledger.committedAt,authorize:()=>true,
        command:{recordId:record.recordId,expectedRevision:record.revision-1,mutationId:ledger.mutationId,
          payload:record.payload,sourceUpdatedAt:record.sourceUpdatedAt,archivedAt:record.archivedAt},
      });
      if(plan.kind!=='apply'||!same(plan.record,record)||!same(plan.ledger,ledger)||!same(plan.audit,audits.get(ledger.mutationId)))fail('history-mismatch');
      plans.push(plan);previous.set(record.recordId,record);
    }
    const state=buildBoundedState({layout,epoch,plans});
    const audit=auditBoundedState(layout,state),measurement=measureBoundedState(layout,state);
    const restored=readBoundedRecords(layout,state,[...current.keys()]);
    if(restored.size!==current.size||[...current].some(([id,record])=>!same(record,restored.get(id))))fail('current-record-mismatch');
    if(audit.history!==ledgers.length||audit.audit!==audits.size||audit.records!==current.size)fail('coverage-mismatch');
    return {
      state,sourceGuards:normalized.guards,
      report:{kind:'local-legacy-writer-preservation-plan',boundary:resource.key,records:current.size,
        mutations:ledgers.length,ledgerOrderPreserved:true,originalGenericReceiptsPreserved:true,
        genericReplayOperationId:'legacy-mutation-id',domainOperationBindingsPreserved:false,domainAdapterReplayVerified:false,
        originalActorAndTimestampsPreserved:true,currentPayloadsMatched:true,historyCoverage:audit,
        ...measurement,providerVerified:false,sourceMutations:0,targetWrites:0,
        targetInstalled:false,migrationComplete:false,
        limitations:['Caller-supplied v1 snapshot was validated locally; this does not prove its provider or coordinator state.',
          'Original generic receipts are preserved for singleton replay using operationId equal to the legacy mutationId.',
          'Legacy snapshots do not retain the complete domain operation/action binding. Domain adapters with derived operation IDs may fail closed instead of returning an original receipt; compatibility must be resolved before cutover.',
          'Target layout is a plan. No tabs, registrations, source freeze or authority switch are performed.',
          'Existing source must be reread and its coordinator/final delta verified before any future installation.']},
    };
  }catch(error){
    if(error instanceof LegacyWriterConversionError)throw error;
    fail('invalid-or-over-budget-source');
  }
}
