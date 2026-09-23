import 'server-only';
import {studioDb} from './studio-db';
import {decodeSavedBrief,renderSavedMessage} from './saved-brief';
import {messageRetryEnabled,requireOrderWrites} from './order-service';
import {maxMessageAttempts} from './order-consent';
import {validBusiness} from './business-settings';
import {whatsappHandoff} from './whatsapp';
import type {OrderReceipt} from './order-receipt';
export type OrderAccess={kind:'guest';guest:string;key:string}|{kind:'staff';admin:boolean;staffId:string|null};
export async function readOrder(id:string|null,access:OrderAccess){
 const rows=await studioDb()`SELECT to_jsonb(i) AS record FROM rivya_inquiries i WHERE (${id}::uuid IS NULL OR i.id=${id}::uuid)
  AND ((${access.kind==='guest'} AND i.guest_hash=${access.kind==='guest'?access.guest:null} AND i.request_key=${access.kind==='guest'?access.key:null}::uuid AND i.created_at>now()-interval '24 hours')
   OR (${access.kind==='staff'} AND (${access.kind==='staff'&&access.admin} OR i.assignee=${access.kind==='staff'?access.staffId:null}::uuid)))`;
 return rows[0]?.record as Record<string,unknown>|undefined;
}
/** Stage B begins only after a committed Stage A; guarded writes never change a ready message. */
export async function finalizeOrderMessage(id:string,access:OrderAccess){
 await requireOrderWrites('message');
 const sql=studioDb();
 const rows=await sql`UPDATE rivya_inquiries i SET message_attempts=message_attempts+1,message_last_attempt_at=now()
  WHERE i.id=${id}::uuid AND contract_version=2 AND message_state IN('handoff_pending','handoff_failed') AND message_attempts<${maxMessageAttempts}
   AND ((${access.kind==='guest'} AND guest_hash=${access.kind==='guest'?access.guest:null} AND request_key=${access.kind==='guest'?access.key:null}::uuid AND created_at>now()-interval '24 hours')
    OR (${access.kind==='staff'} AND (${access.kind==='staff'&&access.admin} OR assignee=${access.kind==='staff'?access.staffId:null}::uuid)))
  RETURNING to_jsonb(i) AS record`;
 if(!rows.length)return;
 const row=rows[0].record as Record<string,unknown>;let summary:string;
 try{summary=renderSavedMessage(decodeSavedBrief(row),String(row.message_template_version));}
 catch{
  await sql`UPDATE rivya_inquiries SET message_state='handoff_failed',message_failure_code='render_failed'
   WHERE id=${id}::uuid AND message_state IN('handoff_pending','handoff_failed') AND message_attempts=${Number(row.message_attempts)}
   AND ((${access.kind==='guest'} AND guest_hash=${access.kind==='guest'?access.guest:null} AND request_key=${access.kind==='guest'?access.key:null}::uuid AND created_at>now()-interval '24 hours')
    OR (${access.kind==='staff'} AND (${access.kind==='staff'&&access.admin} OR assignee=${access.kind==='staff'?access.staffId:null}::uuid)))`;
  return;
 }
 await sql`UPDATE rivya_inquiries SET summary=${summary},message_state='handoff_ready',message_finalized_at=now(),message_failure_code=NULL
  WHERE id=${id}::uuid AND message_state IN('handoff_pending','handoff_failed')
   AND ((${access.kind==='guest'} AND guest_hash=${access.kind==='guest'?access.guest:null} AND request_key=${access.kind==='guest'?access.key:null}::uuid AND created_at>now()-interval '24 hours')
    OR (${access.kind==='staff'} AND (${access.kind==='staff'&&access.admin} OR assignee=${access.kind==='staff'?access.staffId:null}::uuid)))`;
}
export async function orderReceipt(row:Record<string,unknown>):Promise<OrderReceipt>{
 const base:OrderReceipt={reference:String(row.reference),state:'unavailable',summary:null,retryAvailable:false,handoffAllowed:false,reason:'This saved brief needs staff review. Do not submit it again.',brief:null};
 if(!row.contract_version||row.contract_version===1)return {...base,state:'legacy_unverified',summary:typeof row.summary==='string'?row.summary:null,reason:'This earlier inquiry is saved. Its WhatsApp destination was not recorded; automatic handoff is unavailable.'};
 try{
  const brief=decodeSavedBrief(row),state=row.message_state;
  base.brief={title:brief.definition.kind==='product'?brief.definition.product.name:brief.definition.title,...brief.customer,notes:brief.notes,referenceCount:brief.referenceCount,answers:brief.answers.map(a=>({label:a.label,value:String(a.value)}))};
  if(state!=='handoff_ready'&&state!=='handoff_pending'&&state!=='handoff_failed')return base;
  base.state=state;base.retryAvailable=state!=='handoff_ready'&&messageRetryEnabled()&&Number(row.message_attempts)<maxMessageAttempts;
  if(state!=='handoff_ready')return {...base,reason:'Your inquiry and references are saved in Studio. The WhatsApp message is not ready yet. Retry preparing it here; do not submit another inquiry.'};
  if(typeof row.summary!=='string'||!row.summary||!row.message_finalized_at)return {...base,state:'unavailable',retryAvailable:false};
  base.summary=row.summary;
  const business=await studioDb()`SELECT details,version FROM rivya_business_settings WHERE id=1`;
  const current=business[0];
  if(!current||!validBusiness(current.details)||current.details.whatsapp!==row.message_destination||Number(current.version)!==row.destination_config_version)return {...base,reason:'The atelier contact settings changed. Your brief remains saved and copyable; WhatsApp opening is paused for staff review.'};
  return {...base,handoffAllowed:true,reason:'Your complete order brief is saved. Open WhatsApp and press Send yourself.'};
 }catch{return {...base,reason:base.summary?'Your message is saved, but its destination cannot be checked right now. Retry opening later.':base.reason};}
}
/** Re-read ownership, saved state and current destination immediately before producing any link. */
export async function authorizedHandoff(id:string|null,access:OrderAccess){
 const row=await readOrder(id,access);if(!row)return null;
 const receipt=await orderReceipt(row);
 return {receipt,...(receipt.handoffAllowed&&receipt.summary?whatsappHandoff(receipt.reference,receipt.summary,String(row.message_destination)):{} )};
}
