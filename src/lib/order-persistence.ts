import 'server-only';
import {randomUUID} from 'node:crypto';
import {studioDb} from './studio-db';
import {orderConsentVersion,orderMessageTemplate} from './order-consent';
import type {AcceptedOrderInput} from './order-input';
export async function commitOrder(input:AcceptedOrderInput,guest:string,key:string,destination:{number:string;version:number}){
 const sql=studioDb(),id=randomUUID(),reference='RLA-'+id.replaceAll('-','').slice(0,12).toUpperCase(),d=input.snapshot;
 // The first command serializes the request. ReadCommitted gives the core command a fresh
 // snapshot AFTER a competing upload/save releases this same lock. No JS-dependent writes.
 const [,created]=await sql.transaction([
  sql`SELECT request_key FROM rivya_inquiry_upload_sessions WHERE request_key=${key}::uuid AND guest_hash=${guest} FOR UPDATE`,
  sql`WITH session AS MATERIALIZED (
   SELECT request_key FROM rivya_inquiry_upload_sessions WHERE request_key=${key}::uuid AND guest_hash=${guest}
    AND finalized=false AND created_at>now()-interval '24 hours' AND used_slots=${input.references.length}
  ), product AS MATERIALIZED (
   SELECT product_id FROM rivya_catalogue WHERE ${d.kind}='product' AND product_id=${d.productId}
    AND visible=true AND published IS NOT NULL AND published_version=${d.schemaVersion} FOR SHARE
  ), business AS MATERIALIZED (
   SELECT id FROM rivya_business_settings WHERE id=1 AND version=${destination.version}
    AND details->>'whatsapp'=${destination.number} FOR SHARE
  ), reserved AS MATERIALIZED (
   SELECT r.id,r.state,r.normalized_mime,r.created_at FROM rivya_references r JOIN session s ON s.request_key=r.request_key
    WHERE r.guest_hash=${guest} AND r.inquiry_id IS NULL ORDER BY r.id FOR UPDATE OF r
  ), submission AS (
   UPDATE rivya_inquiry_upload_sessions SET finalized=true WHERE request_key IN(SELECT request_key FROM session)
    AND EXISTS(SELECT 1 FROM business) AND (${d.kind}='bespoke' OR EXISTS(SELECT 1 FROM product))
    AND (SELECT count(*) FROM reserved)=${input.references.length}
    AND (SELECT count(*) FROM reserved WHERE id=ANY(${input.references}::uuid[]) AND state='ready' AND normalized_mime='image/jpeg' AND created_at>now()-interval '24 hours')=${input.references.length}
    RETURNING request_key
  ), new_order AS (
   INSERT INTO rivya_studio_orders(id,client,title)
    SELECT ${id}::uuid,${input.contact.name},${d.kind==='product'?d.product.name:d.title} FROM submission RETURNING id
  ), inquiry AS (
   INSERT INTO rivya_inquiries(id,reference,guest_hash,request_key,payload_hash,product_id,product_snapshot,name,phone,email,answers,notes,summary,
    contract_version,request_kind,schema_id,schema_version,schema_snapshot,answer_snapshot,submission_source,source_route,consent_version,consent_accepted_at,
    reference_count,message_state,message_template_version,message_destination,destination_config_version)
   SELECT id,${reference},${guest},${key}::uuid,${input.hash},${d.productId},${d.product?JSON.stringify(d.product):null}::jsonb,
    ${input.contact.name},${input.contact.phone},${input.contact.email},${JSON.stringify(input.labelAnswers)}::jsonb,${input.contact.notes},'',
    2,${d.kind},${d.schemaId},${d.schemaVersion},${JSON.stringify(d)}::jsonb,${JSON.stringify(input.answers)}::jsonb,'website',${input.route},${orderConsentVersion},now(),
    (SELECT count(*) FROM reserved),'handoff_pending',${orderMessageTemplate},${destination.number},${destination.version} FROM new_order RETURNING id
  ), linked AS (
   UPDATE rivya_references SET inquiry_id=(SELECT id FROM inquiry),linked_at=now() WHERE id IN(SELECT id FROM reserved) AND EXISTS(SELECT 1 FROM inquiry)
  ), event AS (
   INSERT INTO rivya_studio_order_events(order_id,actor,from_status,to_status,version) SELECT id,'Website inquiry',NULL,'NEW',1 FROM inquiry
  ), audit AS (
   INSERT INTO rivya_audit(actor,action,entity) SELECT 'Website inquiry','inquiry:create',id::text FROM inquiry
  ) SELECT id FROM inquiry`
 ],{isolationLevel:'ReadCommitted'});
 return created[0]?.id as string|undefined;
}
