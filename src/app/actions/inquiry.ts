'use server';
import {createHash,randomUUID} from 'node:crypto';
import {publishedProducts} from '@/lib/shop-catalogue';
import {studioDb} from '@/lib/studio-db';
import {clientRateKey,guestIdentity,limited} from '@/lib/request-security';
import {productDefinition,type InquiryDefinition} from '@/lib/inquiry-definition';
import {validateBriefForm} from '@/lib/brief-validation';
export type InquiryResult={error?:string;fields?:Record<string,string>;reference?:string;summary?:string;whatsappUrl?:string;code?:'SCHEMA_CHANGED'|'SESSION_REQUIRED'|'NO_SAVE'|'SAVE_UNCONFIRMED';definition?:InquiryDefinition};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function receipt(row:Record<string,unknown>):InquiryResult{return {reference:String(row.reference),summary:String(row.summary)};}
export async function placeInquiry(form:FormData):Promise<InquiryResult>{
 try{
  const kind=form.get('kind')||'product';
  if(kind!=='product')return {code:'NO_SAVE',error:kind==='bespoke'?'Saving custom-piece requests is temporarily unavailable. Nothing was saved or sent. Keep or copy your brief and try again later.':'Unsupported request type.'};
  const guest=await guestIdentity();if(!guest)return {code:'SESSION_REQUIRED',error:'Reconnect the form before submitting. Your entered details remain here.'};
  const read=(key:string)=>{const v=form.get(key);return typeof v==='string'?v.trim():'';};
  if(read('website'))return {error:'Unable to submit this request.'};
  const key=read('requestKey');if(!uuid.test(key))return {error:'Please reload the form and try again.'};
  if(Array.from(form.values()).some(v=>typeof v!=='string')||Array.from(form.values()).reduce((n,v)=>n+String(v).length,0)>10000)return {error:'The brief is too long. Please shorten the notes.'};
  const sql=studioDb();
  const payloadHash=createHash('sha256').update(JSON.stringify(Array.from(form.entries()).sort(([a],[b])=>a.localeCompare(b)))).digest('hex');
  const prior=await sql`SELECT reference,summary,guest_hash,payload_hash FROM rivya_inquiries WHERE request_key=${key}::uuid AND created_at>now()-interval '24 hours'`;
  if(prior.length){return prior[0].guest_hash===guest&&prior[0].payload_hash===payloadHash?receipt(prior[0]):{error:'This submission has already been saved with different details. Open a new form for another inquiry.'};}
  if(!await limited(await clientRateKey('inquiry'),12)||!await limited(`inquiry:${guest}`,6))return {code:'NO_SAVE',error:'Too many submissions. Please try again in an hour.'};
  const product=(await publishedProducts()).find(p=>p.id===read('productId'));
  if(!product)return {code:'NO_SAVE',error:'This design is no longer available. Please choose another piece.'};
  if(String(product.revision)!==(read('schemaVersion')||read('revision'))||read('schemaId')&&read('schemaId')!=='product:'+product.id)return {code:'SCHEMA_CHANGED',error:'The customization options have changed. Review the current form without losing your entered details.',definition:productDefinition(product)};
  const validated=validateBriefForm(form,productDefinition(product));
  if(Object.keys(validated.errors).length)return {code:'NO_SAVE',error:'Please check the highlighted fields.',fields:validated.errors};
  const {name,phone,email,notes}=validated.contact,{answers,refs}=validated;
  const id=randomUUID(),reference=`RLA-${id.replaceAll('-','').slice(0,12).toUpperCase()}`;
  const summary=[`RivyaLivingArt — Order inquiry ${reference}`,`Piece: ${product.name} (${product.id})`,`Name: ${name}`,`Phone: ${phone}`,email?`Email: ${email}`:'',...Object.entries(answers).filter(([,v])=>v).map(([k,v])=>`${k}: ${v}`),notes?`Notes: ${notes}`:'',`Reference images: ${refs.length} saved privately in the Studio.`, 'Please confirm the design, price, payment and delivery with me.'].filter(Boolean).join('\n');
  let created;
  try{
   created=await sql`WITH eligible AS MATERIALIZED (
     SELECT id FROM rivya_references WHERE id=ANY(${refs}::uuid[]) AND guest_hash=${guest} AND request_key=${key}::uuid AND inquiry_id IS NULL AND state='ready' AND created_at>now()-interval '24 hours' FOR UPDATE
    ), submission AS (
     INSERT INTO rivya_inquiry_upload_sessions(request_key,guest_hash,finalized)
     SELECT ${key}::uuid,${guest},true WHERE (SELECT count(*) FROM eligible)=${refs.length}
     ON CONFLICT(request_key) DO UPDATE SET finalized=true
     WHERE rivya_inquiry_upload_sessions.guest_hash=${guest} AND rivya_inquiry_upload_sessions.finalized=false
     AND rivya_inquiry_upload_sessions.created_at>now()-interval '24 hours'
     RETURNING request_key
    ), new_order AS (
     INSERT INTO rivya_studio_orders(id,client,title) SELECT ${id}::uuid,${name},${product.name} WHERE EXISTS(SELECT 1 FROM submission) RETURNING id
    ), inquiry AS (
     INSERT INTO rivya_inquiries(id,reference,guest_hash,request_key,payload_hash,product_id,product_snapshot,name,phone,email,answers,notes,summary)
     SELECT id,${reference},${guest},${key}::uuid,${payloadHash},${product.id},${JSON.stringify(product)}::jsonb,${name},${phone},${email},${JSON.stringify(answers)}::jsonb,${notes},${summary} FROM new_order RETURNING *
    ), linked AS (
     UPDATE rivya_references SET inquiry_id=(SELECT id FROM inquiry) WHERE id IN(SELECT id FROM eligible) AND EXISTS(SELECT 1 FROM inquiry)
    ), event AS (
     INSERT INTO rivya_studio_order_events(order_id,actor,from_status,to_status,version) SELECT id,'Website inquiry',NULL,'NEW',1 FROM inquiry
    ), audit AS (
     INSERT INTO rivya_audit(actor,action,entity) SELECT 'Website inquiry','inquiry:create',id::text FROM inquiry
    ) SELECT reference,summary FROM inquiry`;
  }catch{
   // A concurrent retry may have won the unique request key. Read only the same guest and payload.
   created=await sql`SELECT reference,summary FROM rivya_inquiries WHERE request_key=${key}::uuid AND guest_hash=${guest} AND payload_hash=${payloadHash}`;
   if(!created.length)throw new Error('Save unavailable');
  }
  if(!created.length)created=await sql`SELECT reference,summary FROM rivya_inquiries WHERE request_key=${key}::uuid AND guest_hash=${guest} AND payload_hash=${payloadHash} AND created_at>now()-interval '24 hours'`;
  if(!created.length)return {code:'NO_SAVE',error:'A reference or form session expired. Copy your brief before reopening this form, then upload the images again. Nothing was submitted.'};
  return receipt(created[0]);
 }catch{return {code:'SAVE_UNCONFIRMED',error:'Your inquiry could not be confirmed as saved. Keep this page open and retry; the same submission will not create a second inquiry.'};}
}
