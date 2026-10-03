import {retentionDecision,type RetentionRecord} from './retention-policy';
export type ErasureControl=RetentionRecord&{erasedAt?:string|null;deletionRequestedAt?:string|null;identityVerifiedAt?:string|null};
export function canErasePersonalData(record:ErasureControl,reason:'customer_request'|'retention_expiry',now=new Date()){
 const decision=retentionDecision(record,now);
 return !record.erasedAt&&!decision.blocked&&(reason==='retention_expiry'?decision.canEraseInquiry:Boolean(record.deletionRequestedAt&&record.identityVerifiedAt));
}
