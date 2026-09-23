'use server';
import {createHash,randomUUID} from 'node:crypto';
import {publishedProducts} from '@/lib/shop-catalogue';
import {studioDb} from '@/lib/studio-db';
import {clientRateKey,guestIdentity,limited} from '@/lib/request-security';
import {fieldVisible,validateAnswers} from '@/lib/product-form';
export type InquiryResult={error?:string;fields?:Record<string,string>;reference?:string;summary?:string;whatsappUrl?:string};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function receipt(row:Record<string,unknown>):InquiryResult{return {reference:String(row.reference),summary:String(row.summary)};}
export async function placeInquiry(form:FormData):Promise<InquiryResult>{
 try{
  const guest=await guestIdentity();if(!guest)return {error:'Please reload the form to begin a secure submission.'};
  const read=(key:string)=>{const v=form.get(key);return typeof v==='string'?v.trim():'';};
  if(read('website'))return {error:'Unable to submit this request.'};
  const key=read('requestKey');if(!uuid.test(key))return {error:'Please reload the form and try again.'};
  if(Array.from(form.values()).some(v=>typeof v!=='string')||Array.from(form.values()).reduce((n,v)=>n+String(v).length,0)>10000)return {error:'The brief is too long. Please shorten the notes.'};
  const sql=studioDb();
  const payloadHash=createHash('sha256').update(JSON.stringify(Array.from(form.entries()).sort(([a],[b])=>a.localeCompare(b)))).digest('hex');
  const prior=await sql`SELECT reference,summary,guest_hash,payload_hash FROM rivya_inquiries WHERE request_key=${key}::uuid AND created_at>now()-interval '24 hours'`;
  if(prior.length){return prior[0].guest_hash===guest&&prior[0].payload_hash===payloadHash?receipt(prior[0]):{error:'This submission has already been saved with different details. Open a new form for another inquiry.'};}
  if(!await limited(await clientRateKey('inquiry'),12)||!await limited(`inquiry:${guest}`,6))return {error:'Too many submissions. Please try again in an hour.'};
  const product=(await publishedProducts()).find(p=>p.id===read('productId'));
  if(!product)return {error:'This design is no longer available. Please choose another piece.'};
  if(String(product.revision)!==read('revision'))return {error:'The customization options have changed. Reload this page to use the current form.'};
  const name=read('name'),phoneInput=read('phone').replace(/[\s()-]/g,''),email=read('email'),notes=read('notes');
  const phone=/^[0-9]{10}$/.test(phoneInput)?'+91'+phoneInput:phoneInput.startsWith('+')?phoneInput:'+'+phoneInput;
  const fields:Record<string,string>={};const answers:Record<string,string>={};
  if(name.length<2||name.length>100)fields.name='Enter your name (2–100 characters).';
  if(!/^\+?[0-9]{10,15}$/.test(phone))fields.phone='Enter a valid phone number, including country code when outside India.';
  if(email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>180))fields.email='Enter a valid email address or leave it blank.';
  if(notes.length>1200)fields.notes='Keep notes within 1,200 characters.';
  if(read('consent')!=='on')fields.consent='Please agree to sharing these details with the studio.';
  const rawAnswers=Object.fromEntries(product.fields.map(f=>[f.id,read('answer_'+f.id)]));
  const allowed=new Set(['productId','revision','requestKey','name','phone','email','notes','consent','reference','website',...product.fields.map(f=>'answer_'+f.id)]);
  if(Array.from(form.keys()).some(k=>!allowed.has(k)))return {error:'The brief contains an unsupported field. Reload the current form.'};
  Object.assign(fields,validateAnswers(product.fields,rawAnswers));
  for(const f of product.fields){
   if(fieldVisible(f,rawAnswers))answers[f.label]=rawAnswers[f.id];
   else if(rawAnswers[f.id])fields[f.id]='This answer does not apply to the selected options. Please review your brief.';
  }
  const refs=form.getAll('reference').filter((r):r is string=>typeof r==='string');
  if(refs.length>3||new Set(refs).size!==refs.length||refs.some(r=>!uuid.test(r)))return {error:'Invalid reference images. Please reload the form.'};
  if(Object.keys(fields).length)return {error:'Please check the highlighted fields.',fields};
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
  if(!created.length)return {error:'A reference image expired. Reload the form and upload it again. Nothing was submitted.'};
  return receipt(created[0]);
 }catch{return {error:'Your inquiry could not be confirmed as saved. Keep this page open and retry; the same submission will not create a second inquiry.'};}
}
