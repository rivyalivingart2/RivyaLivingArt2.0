/** Inactive LOCAL OPERATOR bridge. Stages immutable document references only;
 * never writes canonical Sheets records, changes authority or invents Drive IDs. */
import {createHash} from 'node:crypto';
import {planSourceRecord} from './migration.mjs';
import {createDriveDocumentStore,validateArtifactRegistration,validateDriveJsonRef} from '../../src/lib/google-workspace/drive-documents.ts';
import {MAX_MULTIPART_ARTIFACT_BYTES} from '../../src/lib/google-workspace/drive-json-rest.ts';
import {canonicalArtifactJson,makeRecord,encodeRecord,decodeRecord} from '../../src/lib/google-workspace/record-codec.ts';
import {sourceDocumentDeadline,SourceDocumentDeadlineError} from './source-document-deadline.mjs';

export class SourceDocumentMigrationError extends Error {
  constructor(code){super('Source document migration failed: '+code+'.');this.name='SourceDocumentMigrationError';this.code=code;}
}
const fail=code=>{throw new SourceDocumentMigrationError(code);};
const hash=value=>createHash('sha256').update(canonicalArtifactJson(value),'utf8').digest('hex');
const same=(a,b)=>canonicalArtifactJson(a)===canonicalArtifactJson(b);
const copy=value=>JSON.parse(canonicalArtifactJson(value));
const email=value=>typeof value==='string'&&value.length<=254&&/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value);

export function prepareSourceDocumentIntent({table,row,plan,registration}){
  const actual=planSourceRecord(table,row);
  if(actual.disposition!=='drive-artifact-required'||!same(actual,plan))fail('SOURCE_PLAN_MISMATCH');
  if(actual.bytes>MAX_MULTIPART_ARTIFACT_BYTES)fail('RESUMABLE_UPLOAD_REQUIRED');
  const registered=validateArtifactRegistration(registration);
  if(registered.purpose!=='record-payload'||registered.ownerId!==actual.recordId)fail('REGISTRATION_MISMATCH');
  const metadata={recordId:actual.recordId,revision:1,sourceUpdatedAt:typeof row.updated_at==='string'?row.updated_at:typeof row.created_at==='string'?row.created_at:null,archivedAt:null,lastMutationId:'migration_'+actual.recordId};
  makeRecord({...metadata,payload:null});
  return {format:'rivya-source-document-intent-v1',operationId:'sd_'+hash([table.sourceTable,actual.recordId,actual.payloadSha256]),sourceTable:table.sourceTable,recordId:actual.recordId,sourcePayloadSha256:actual.payloadSha256,sourceBytes:actual.bytes,registration:registered,recordMetadata:metadata};
}

/** Complete, bounded My Drive ownership/permission evidence, not private:true.
 * Shared-drive owners and group/domain/public permissions are not accepted. */
export function validateSourceDocumentPrivacy(snapshot,{id,mimeType,parentId},policy){
  if(!policy||!email(policy.ownerEmail)||!Array.isArray(policy.allowedUsers)||policy.allowedUsers.length>20||policy.allowedUsers.some(x=>!email(x))||new Set(policy.allowedUsers).size!==policy.allowedUsers.length)fail('INVALID_PRIVACY_POLICY');
  const allowed=new Set([policy.ownerEmail,...policy.allowedUsers]);
  const metadata=snapshot?.metadata,permissions=snapshot?.permissions;
  if(!metadata||metadata.id!==id||metadata.mimeType!==mimeType||metadata.trashed!==false||!Array.isArray(metadata.parents)||metadata.parents.some(x=>typeof x!=='string')||parentId!==undefined&&(metadata.parents.length!==1||metadata.parents[0]!==parentId)||!Array.isArray(metadata.owners)||metadata.owners.length!==1||metadata.owners[0]?.emailAddress!==policy.ownerEmail)fail('PRIVACY_MISMATCH');
  if(!permissions||permissions.nextPageToken!==undefined&&permissions.nextPageToken!==''||!Array.isArray(permissions.permissions)||permissions.permissions.length<1||permissions.permissions.length>100)fail('INCOMPLETE_PERMISSIONS');
  const seen=new Set();let owners=0;
  for(const permission of permissions.permissions){
    if(!permission||permission.type!=='user'||!email(permission.emailAddress)||!allowed.has(permission.emailAddress)||seen.has(permission.emailAddress)||permission.deleted!==undefined&&permission.deleted!==false||permission.pendingOwner!==undefined&&permission.pendingOwner!==false||!['owner','writer','reader','commenter'].includes(permission.role))fail('PRIVACY_MISMATCH');
    seen.add(permission.emailAddress);
    if(permission.role==='owner'){if(permission.emailAddress!==policy.ownerEmail)fail('PRIVACY_MISMATCH');owners++;}
  }
  if(owners!==1)fail('PRIVACY_MISMATCH');
  return true;
}

export function createSourceDocumentMigrationBridge(config,{journal,io,readPrivacy}){
  if(config?.mode!=='local-operator'||journal?.scope!=='LOCAL_OPERATOR_JOURNAL'||['read','putIfAbsent'].some(key=>typeof journal[key]!=='function')||!io||['metadata','read','create'].some(key=>typeof io[key]!=='function')||typeof readPrivacy!=='function')fail('INVALID_CONFIGURATION');
  const timeoutMs=config.timeoutMs??30000;
  if(!Number.isSafeInteger(timeoutMs)||timeoutMs<1||timeoutMs>60000)fail('INVALID_CONFIGURATION');
  const policy=copy(config.privacyPolicy);
  // Validate policy before any journal/provider operation.
  if(!email(policy?.ownerEmail)||!Array.isArray(policy.allowedUsers)||policy.allowedUsers.length>20||policy.allowedUsers.some(x=>!email(x))||new Set(policy.allowedUsers).size!==policy.allowedUsers.length)fail('INVALID_PRIVACY_POLICY');
  const persist=async(key,phase,value,deadline)=>{
    const {signal}=deadline;
    const prior=await deadline.run(()=>journal.read(key,phase,signal));
    if(prior!==null){if(!same(prior,value))fail('JOURNAL_CONFLICT');return;}
    try{await deadline.run(()=>journal.putIfAbsent(key,phase,copy(value),signal));}catch(error){deadline.check();if(signal.aborted)throw error;/* An unknown durable acknowledgement is read back, never replaced. */}
    const observed=await deadline.run(()=>journal.read(key,phase,signal));
    if(observed===null)fail('JOURNAL_OUTCOME_UNKNOWN');
    if(!same(observed,value))fail('JOURNAL_CONFLICT');
  };
  return Object.freeze({
    async stage(input,{signal:outer}={}){
      const deadline=sourceDocumentDeadline(timeoutMs,outer),{signal}=deadline;
      try{
        const row=copy(input.row),intent=prepareSourceDocumentIntent({...input,row});deadline.check();
        const guardedIO=Object.fromEntries(['metadata','read','create'].map(key=>[key,(...args)=>deadline.run(()=>io[key](...args))]));
        const documents=createDriveDocumentStore({registrations:[intent.registration],maxBytes:MAX_MULTIPART_ARTIFACT_BYTES,timeoutMs,createAttempts:2},guardedIO);
        await persist(intent.operationId,'registration',intent,deadline);
        const checkPrivacy=async(fileId,mimeType,parentId)=>{const result=validateSourceDocumentPrivacy(await deadline.run(()=>readPrivacy(fileId,signal)),{id:fileId,mimeType,parentId},policy);deadline.check();return result;};
        await checkPrivacy(intent.registration.parentId,'application/vnd.google-apps.folder');
        const artifact=await deadline.run(()=>documents.ensureJson(intent.registration.fileId,row,{signal}));
        validateDriveJsonRef(artifact);
        if(artifact.sha256!==intent.sourcePayloadSha256||artifact.bytes!==intent.sourceBytes)fail('SOURCE_PLAN_MISMATCH');
        await checkPrivacy(intent.registration.parentId,'application/vnd.google-apps.folder');
        await checkPrivacy(intent.registration.fileId,'application/json',intent.registration.parentId);
        const resolved=await deadline.run(()=>documents.readJson(artifact,{signal}));
        if(!same(resolved,row))fail('SOURCE_ROUND_TRIP_MISMATCH');
        const record=makeRecord({...intent.recordMetadata,payload:{format:'rivya-drive-payload-v1',artifact}}),cells=encodeRecord(record);
        if(!same(decodeRecord(cells),record))fail('ENVELOPE_ROUND_TRIP_MISMATCH');
        const verified={format:'rivya-source-document-verified-v1',operationId:intent.operationId,sourcePayloadSha256:intent.sourcePayloadSha256,sourceBytes:intent.sourceBytes,record,artifact};
        deadline.check();await persist(intent.operationId,'verified',verified,deadline);
        deadline.check();
        return {status:'staged-document-reference',record,cells,artifact,operationId:intent.operationId,sourcePayloadSha256:intent.sourcePayloadSha256,sourceBytes:intent.sourceBytes,canonicalWritten:false,authorityChanged:false};
      }catch(error){try{deadline.check();}catch(ended){fail(ended.code);}if(error instanceof SourceDocumentDeadlineError)fail(error.code);if(error instanceof SourceDocumentMigrationError)throw error;if(['ARTIFACT_MISMATCH','ARTIFACT_TOO_LARGE','ARTIFACT_NOT_FOUND','UNREGISTERED_ARTIFACT','INVALID_REFERENCE'].includes(error?.code))fail(error.code);fail('PROVIDER_OR_JOURNAL_UNAVAILABLE');}
      finally{deadline.close();}
    },
  });
}
