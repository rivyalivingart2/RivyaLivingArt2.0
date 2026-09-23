import 'server-only';
import {studioDb} from './studio-db';
import {deleteReference,type ReferenceProvider} from './reference-storage';
/** Session -> reference -> budget lock order matches upload and core save. */
export async function discardReference(id:string,expiredOnly=false){
 const sql=studioDb();
 const [,claimed]=await sql.transaction([
  sql`SELECT s.request_key FROM rivya_inquiry_upload_sessions s JOIN rivya_references r USING(request_key) WHERE r.id=${id}::uuid FOR UPDATE OF s`,
  sql`UPDATE rivya_references r SET state='deleting' WHERE id=${id}::uuid AND inquiry_id IS NULL
   AND (NOT ${expiredOnly} OR created_at<now()-interval '24 hours')
   AND (state IN('ready','deleting') OR state='pending' AND created_at<now()-interval '24 hours')
   AND ((to_jsonb(r)->>'write_expires_at') IS NULL OR (to_jsonb(r)->>'write_expires_at')::timestamptz<now())
   RETURNING pathname,storage_provider,bytes,request_key`
 ],{isolationLevel:'ReadCommitted'});
 if(!claimed.length)return false;
 // Retain the row and its quota reservation if provider deletion is uncertain.
 await deleteReference(claimed[0].pathname,claimed[0].storage_provider as ReferenceProvider);
 await sql.transaction([
  sql`SELECT request_key FROM rivya_inquiry_upload_sessions WHERE request_key=${claimed[0].request_key}::uuid FOR UPDATE`,
  sql`WITH removed AS(DELETE FROM rivya_references WHERE id=${id}::uuid AND inquiry_id IS NULL AND state='deleting' RETURNING bytes,request_key),
   slots AS(UPDATE rivya_inquiry_upload_sessions SET used_slots=GREATEST(0,used_slots-1) WHERE request_key IN(SELECT request_key FROM removed))
   UPDATE rivya_storage_budget SET bytes=GREATEST(0,bytes-COALESCE((SELECT sum(bytes) FROM removed),0)) WHERE id=1`
 ],{isolationLevel:'ReadCommitted'});
 return true;
}
