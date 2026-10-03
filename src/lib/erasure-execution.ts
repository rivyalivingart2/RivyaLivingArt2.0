import 'server-only';
import {randomBytes} from 'node:crypto';
import {studioDb} from './studio-db';
import {deleteReference,type ReferenceProvider} from './reference-storage';
import type {RetentionRecord} from './retention-policy';
import {canErasePersonalData} from './erasure-policy';

export class ErasureConflict extends Error {}
type Reason='customer_request'|'retention_expiry';
type Control=RetentionRecord&{version:number;erasedAt:string|null;deletionRequestedAt:string|null;identityVerifiedAt:string|null};
/** Deny stale/unverified changes before any storage call. The SQL claim rechecks this version. */
export async function eraseOrderData(orderId:string,actor:string,reason:Reason,version:number){
 const sql=studioDb();
 const rows=await sql`SELECT last_contact_at AS "lastContactAt",closed_at AS "closedAt",became_order AS "becameOrder",ongoing_follow_up AS "ongoingFollowUp",hold_reason AS "holdReason",version,erased_at AS "erasedAt",deletion_requested_at AS "deletionRequestedAt",identity_verified_at AS "identityVerifiedAt" FROM rivya_privacy_controls WHERE order_id=${orderId}::uuid`;
 const control=rows[0] as Control|undefined;
 if(!control||control.version!==version)throw new ErasureConflict('The retention record changed. Reload before erasing.');
 if(!control.erasedAt){
  if(!canErasePersonalData(control,reason))throw new ErasureConflict('Erasure is paused by the current retention policy or missing request verification.');
  if(!await anonymize(orderId,actor,reason,version,false))throw new ErasureConflict('The retention record changed. Reload before erasing.');
 }
 return finishReferenceErasure(orderId);
}

/** Atomically remove personal fields and revoke access; retain failed storage work for retry. */
async function anonymize(id:string,actor:string,reason:Reason,version:number,replay:boolean){
 const sql=studioDb(),revoked=randomBytes(32).toString('hex');
 const [,changed]=await sql.transaction([
  // Match the normal order -> privacy lock order, including the status-change trigger.
  sql`SELECT id FROM rivya_studio_orders WHERE id=${id}::uuid FOR UPDATE`,
  sql`WITH claimed AS (
   UPDATE rivya_privacy_controls SET erased_at=COALESCE(erased_at,now()),version=version+1,updated_by=${actor},updated_at=now()
   WHERE order_id=${id}::uuid AND ((NOT ${replay} AND version=${version} AND erased_at IS NULL) OR (${replay} AND EXISTS(SELECT 1 FROM rivya_erasure_ledger WHERE order_id=${id}::uuid))) RETURNING *
  ), inquiries AS (
   UPDATE rivya_inquiries SET name='[ERASED]',phone='',email='',notes='',summary='[Personal data erased]',answers='{}'::jsonb,answer_snapshot='[]'::jsonb,
    product_snapshot=CASE WHEN product_snapshot IS NULL THEN NULL ELSE jsonb_build_object('id',product_id,'name','[ERASED]') END,
    guest_hash=${revoked},payload_hash=${revoked},assignee=NULL,follow_up=NULL,reference_count=0,
    message_state=CASE WHEN contract_version=2 THEN 'handoff_ready' ELSE 'legacy_unverified' END,
    message_finalized_at=CASE WHEN contract_version=2 THEN now() ELSE message_finalized_at END,message_failure_code=NULL
   WHERE id IN(SELECT order_id FROM claimed) RETURNING id,reference
  ), orders AS (
   UPDATE rivya_studio_orders SET client='[ERASED]',title='[Personal data erased]',version=version+1,updated_at=now() WHERE id IN(SELECT order_id FROM claimed)
  ), notes AS (
   DELETE FROM rivya_inquiry_notes WHERE inquiry_id IN(SELECT order_id FROM claimed) RETURNING id
  ), events AS (
   UPDATE rivya_studio_order_events SET reason=NULL WHERE order_id IN(SELECT order_id FROM claimed)
  ), refs AS (
   UPDATE rivya_references SET state='deleting',guest_hash=${revoked} WHERE inquiry_id IN(SELECT order_id FROM claimed)
  ), recovery_notes AS (
   UPDATE rivya_audit SET entity=jsonb_build_object('id',${id}::text,'reason','[Personal details removed by erasure]')::text
   WHERE (CASE WHEN action='inquiry:message-recovery' THEN entity::jsonb END)->>'id'=${id} AND EXISTS(SELECT 1 FROM claimed)
  ), exports AS (
   UPDATE rivya_managed_exports SET invalidated_at=COALESCE(invalidated_at,now()),invalidation_reason='Contains erased customer data',criteria='{}'::jsonb WHERE EXISTS(SELECT 1 FROM claimed)
  ), ledger AS (
   INSERT INTO rivya_erasure_ledger(order_id,reference,requested_at,identity_verified_at,erased_by,reason,notes_purged)
   SELECT c.order_id,i.reference,c.deletion_requested_at,c.identity_verified_at,${actor},${reason},(SELECT count(*) FROM notes) FROM claimed c JOIN inquiries i ON i.id=c.order_id WHERE NOT ${replay}
  ), audit AS (
   INSERT INTO rivya_audit(actor,action,entity) SELECT ${actor},${replay?'privacy:restore_replay':'privacy:erasure_revoked'},order_id::text FROM claimed
  ) SELECT order_id FROM claimed`
 ],{isolationLevel:'Serializable'});
 return changed.length>0;
}

async function finishReferenceErasure(id:string){
 const sql=studioDb();
 const refs=await sql`SELECT id,pathname,storage_provider FROM rivya_references WHERE inquiry_id=${id}::uuid AND state='deleting'`;
 for(const ref of refs){
  try{
   await deleteReference(ref.pathname,ref.storage_provider as ReferenceProvider);
   // Concurrent retries can delete the provider object repeatedly, but release quota only once.
   await sql`WITH removed AS (DELETE FROM rivya_references WHERE id=${ref.id}::uuid AND inquiry_id=${id}::uuid AND state='deleting' RETURNING bytes,request_key),
    slots AS (UPDATE rivya_inquiry_upload_sessions SET used_slots=GREATEST(0,used_slots-1) WHERE request_key IN(SELECT request_key FROM removed)),
    budget AS (UPDATE rivya_storage_budget SET bytes=GREATEST(0,bytes-COALESCE((SELECT sum(bytes) FROM removed),0)) WHERE id=1)
    UPDATE rivya_erasure_ledger SET references_deleted=references_deleted+(SELECT count(*) FROM removed) WHERE id=(SELECT id FROM rivya_erasure_ledger WHERE order_id=${id}::uuid ORDER BY erased_at DESC LIMIT 1)`;
  }catch{/* The inaccessible row and quota remain until a confirmed provider deletion. */}
 }
 const remaining=await sql`SELECT count(*)::int AS count FROM rivya_references WHERE inquiry_id=${id}::uuid`;
 const ledger=await sql`SELECT reference,erased_at,references_deleted,notes_purged FROM rivya_erasure_ledger WHERE order_id=${id}::uuid ORDER BY erased_at DESC LIMIT 1`;
 if(!ledger.length)throw new ErasureConflict('The erasure ledger is unavailable. Recovery review is required.');
 return {success:remaining[0].count===0,orderId:id,reference:ledger[0].reference,referencesDeleted:ledger[0].references_deleted,notesPurged:ledger[0].notes_purged,pendingReferences:remaining[0].count,erasedAt:new Date(ledger[0].erased_at).toISOString()};
}

/** Recovery operator must import the latest external ledger before exposing a restored backup. */
export async function replayErasureLedger(actor:string){
 const sql=studioDb();
 const entries=await sql`SELECT DISTINCT order_id FROM rivya_erasure_ledger ORDER BY order_id`;
 let replayedCount=0,pendingReferences=0;
 for(const entry of entries){
  if(await anonymize(entry.order_id,actor,'customer_request',0,true)){
   replayedCount++;pendingReferences+=(await finishReferenceErasure(entry.order_id)).pendingReferences;
  }
 }
 return {replayedCount,pendingReferences,complete:pendingReferences===0};
}
