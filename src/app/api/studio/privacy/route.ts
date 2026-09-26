import {studioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {originAllowed,smallJson} from '@/lib/request-security';
import {uuid} from '@/lib/saved-brief';
import {retentionDecision,type RetentionRecord} from '@/lib/retention-policy';
import {eraseOrderData,getErasureLedger,type ErasureReason} from '@/lib/data-erasure';

const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'private, no-store'}});

export async function GET(request:Request){
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);if(session.role!=='admin')return json({error:'Administrator access required.'},403);
  const id=new URL(request.url).searchParams.get('id');if(!uuid(id))return json({error:'Choose a saved order.'},400);
  const rows=await studioDb()`SELECT order_id AS id,last_contact_at AS "lastContactAt",became_order AS "becameOrder",closed_at AS "closedAt",ongoing_follow_up AS "ongoingFollowUp",hold_reason AS "holdReason",hold_review_on AS "holdReviewOn",deletion_requested_at AS "deletionRequestedAt",identity_verified_at AS "identityVerifiedAt",erased_at AS "erasedAt",version FROM rivya_privacy_controls WHERE order_id=${id}::uuid`;
  if(!rows.length)return json({error:'Retention controls are unavailable for this record.'},404);
  const decision=retentionDecision(rows[0] as RetentionRecord);
  const canErase=!rows[0].erasedAt && !decision.blocked && (decision.canEraseInquiry || rows[0].identityVerifiedAt !== null);
  const ledger=await getErasureLedger(id);
  return json({record:rows[0],decision,deletionAvailable:canErase,ledger});
 }catch{return json({error:'Retention controls are temporarily unavailable.'},503);}
}

export async function POST(request:Request){
 if(!originAllowed(request))return json({error:'Request not allowed.'},403);
 try{
  const session=await studioSession();if(!session)return json({error:'Sign in to continue.'},401);if(session.role!=='admin')return json({error:'Administrator access required.'},403);
  const b=await smallJson(request,2000);
  if(!b||!uuid(b.id))return json({error:'Invalid request.'},400);

  // Handle compliant customer data erasure / anonymization (CR-04/18)
  if(b.action==='erase'){
   if(b.confirm!=='confirm-erasure')return json({error:'Confirm the permanent erasure action.'},400);
   const reason:ErasureReason=b.reason==='retention_expiry'?'retention_expiry':b.reason==='administrative_order'?'administrative_order':'customer_request';
   const result=await eraseOrderData(b.id,session.adminId,reason);
   return json({saved:true,erased:true,result});
  }

  // Handle standard retention controls update
  if(!Number.isSafeInteger(b.version)||b.version<1||Object.keys(b).some(k=>!['id','version','lastContactAt','ongoingFollowUp','holdReason','holdReviewOn','recordDeletionRequest','verifyIdentity'].includes(k)))return json({error:'Invalid retention change.'},400);
  if(typeof b.lastContactAt!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(b.lastContactAt)||!Number.isFinite(Date.parse(b.lastContactAt))||new Date(b.lastContactAt).toISOString()!==b.lastContactAt||Date.parse(b.lastContactAt)>Date.now()||typeof b.ongoingFollowUp!=='boolean'||typeof b.holdReason!=='string'||b.holdReason.length>400||typeof b.recordDeletionRequest!=='boolean'||typeof b.verifyIdentity!=='boolean')return json({error:'Use an actual past customer-interaction time and valid retention choices.'},400);
  const review=b.holdReviewOn;
  if(review!==null&&(typeof review!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(review)||!Number.isFinite(Date.parse(review))||new Date(review).toISOString().slice(0,10)!==review)||review&&!b.holdReason.trim())return json({error:'A hold review date requires a documented hold reason.'},400);
  const rows=await studioDb()`WITH changed AS (
   UPDATE rivya_privacy_controls SET last_contact_at=GREATEST(last_contact_at,${b.lastContactAt}::timestamptz),ongoing_follow_up=${b.ongoingFollowUp},hold_reason=${b.holdReason.trim()},hold_review_on=${review}::date,
    deletion_requested_at=CASE WHEN ${b.recordDeletionRequest} THEN COALESCE(deletion_requested_at,now()) ELSE deletion_requested_at END,
    identity_verified_at=CASE WHEN ${b.verifyIdentity} THEN COALESCE(identity_verified_at,now()) ELSE identity_verified_at END,
    version=version+1,updated_by=${session.adminId},updated_at=now()
   WHERE order_id=${b.id}::uuid AND version=${b.version} AND date_trunc('milliseconds',last_contact_at)<=${b.lastContactAt}::timestamptz
    AND (NOT ${b.verifyIdentity} OR ${b.recordDeletionRequest} OR deletion_requested_at IS NOT NULL)
   RETURNING order_id
  ), logged AS (INSERT INTO rivya_audit(actor,action,entity) SELECT ${session.adminId},'privacy:controls',order_id::text FROM changed)
  SELECT order_id FROM changed`;
  return rows.length?json({saved:true}):json({error:'The record changed, contact time moved backwards, or identity verification has no deletion request. Reload and review.'},409);
 }catch(e){
  const msg=e instanceof Error?e.message:'Retention changes could not be confirmed.';
  return json({error:msg},500);
 }
}
