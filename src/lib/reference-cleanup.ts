import 'server-only';
import {studioDb} from './studio-db';
import {deleteReference,type ReferenceProvider} from './reference-storage';
/** Attached references are never removed here. Failed object deletion keeps the durable reservation. */
export async function discardReference(id:string,expiredOnly=false){
 const sql=studioDb();
 const claimed=await sql`UPDATE rivya_references SET state='deleting'
  WHERE id=${id}::uuid AND inquiry_id IS NULL AND (NOT ${expiredOnly} OR created_at<now()-interval '24 hours')
  RETURNING pathname,storage_provider,bytes,request_key`;
 if(!claimed.length)return false;
 await deleteReference(claimed[0].pathname,claimed[0].storage_provider as ReferenceProvider);
 await sql`WITH removed AS(DELETE FROM rivya_references WHERE id=${id}::uuid AND inquiry_id IS NULL AND state='deleting' RETURNING bytes,request_key),
  slots AS(UPDATE rivya_inquiry_upload_sessions SET used_slots=GREATEST(0,used_slots-1) WHERE request_key IN(SELECT request_key FROM removed))
  UPDATE rivya_storage_budget SET bytes=GREATEST(0,bytes-COALESCE((SELECT sum(bytes) FROM removed),0)) WHERE id=1`;
 return true;
}
