'use server';
import {publishedProducts} from '@/lib/shop-catalogue';
import {studioDb} from '@/lib/studio-db';
import {clientRateKey,guestIdentity,limited} from '@/lib/request-security';
import {bespokeDefinition,productDefinition,type InquiryDefinition} from '@/lib/inquiry-definition';
import {acceptedOrderInput} from '@/lib/order-input';
import {commitOrder} from '@/lib/order-persistence';
import {decodeSavedBrief,inquiryDefinitionFromSaved,uuid} from '@/lib/saved-brief';
import {readOrder,finalizeOrderMessage} from '@/lib/order-handoff';
import {requireOrderWrites,messageRetryEnabled} from '@/lib/order-service';
import {validBusiness} from '@/lib/business-settings';
export type InquiryResult={error?:string;fields?:Record<string,string>;reference?:string;code?:'SCHEMA_CHANGED'|'SESSION_REQUIRED'|'NO_SAVE'|'SAVE_UNCONFIRMED';definition?:InquiryDefinition};
export async function placeInquiry(form:FormData):Promise<InquiryResult>{
 let committed:Record<string,unknown>|undefined;
 try{
  // Next Server Actions enforce same-origin requests; the guest cookie is still mandatory.
  const guest=await guestIdentity();if(!guest)return {code:'SESSION_REQUIRED',error:'Reconnect the form before submitting. Your entered details remain here.'};
  const key=form.get('requestKey');if(!uuid(key)||form.getAll('requestKey').length!==1)return {code:'NO_SAVE',error:'Reconnect this form before submitting.'};
  if([...form.values()].some(v=>typeof v!=='string')||[...form.values()].reduce((n,v)=>n+String(v).length,0)>10000||form.get('website'))return {code:'NO_SAVE',error:'Check the brief and keep notes within the displayed limits.'};
  const access={kind:'guest' as const,guest,key};
  const prior=await readOrder(null,access);
  if(prior){
   if(prior.contract_version!==2)return {error:'This request key belongs to an earlier saved inquiry. Check its saved receipt; do not submit it again.'};
   const input=acceptedOrderInput(form,inquiryDefinitionFromSaved(decodeSavedBrief(prior)));
   if(Object.keys(input.errors).length||input.hash!==prior.payload_hash)return {error:'This request was already saved with different details. Check its original receipt; the saved brief has not been changed.'};
   committed=prior;
  }else{
   try{await requireOrderWrites();}catch{return {code:'NO_SAVE',error:'Saving order requests is temporarily unavailable. Keep or copy your brief and try again later. Nothing new was submitted.'};}
   const kind=form.get('kind');let definition:InquiryDefinition;
   if(kind==='bespoke')definition=bespokeDefinition();
   else if(kind==='product'){
    const product=(await publishedProducts()).find(p=>p.id===form.get('productId'));
    if(!product)return {code:'NO_SAVE',error:'This piece is no longer available. Keep or copy your entered brief.'};
    definition=productDefinition(product);
   }else return {code:'NO_SAVE',error:'Choose a product or custom-piece request.'};
   if(form.get('schemaId')!==definition.schemaId||form.get('schemaVersion')!==String(definition.schemaVersion))return {code:'SCHEMA_CHANGED',error:'The customization form changed. Review the current options; your details remain here.',definition};
   const input=acceptedOrderInput(form,definition);
   if(Object.keys(input.errors).length)return {code:'NO_SAVE',error:'Please check the highlighted fields.',fields:input.errors};
   if(!await limited(await clientRateKey('inquiry'),12)||!await limited('inquiry:'+guest,6))return {code:'NO_SAVE',error:'Too many attempts. Keep your brief and try again later.'};
   const rows=await studioDb()`SELECT details,version FROM rivya_business_settings WHERE id=1`;
   if(!rows[0]||!validBusiness(rows[0].details)||!Number.isSafeInteger(Number(rows[0].version)))return {code:'NO_SAVE',error:'Order requests are temporarily unavailable. Keep your brief; nothing was submitted.'};
   let id:string|undefined;
   try{id=await commitOrder(input,guest,key,{number:rows[0].details.whatsapp,version:Number(rows[0].version)});}
   catch{
    // A concurrent retry or lost commit response can only recover the exact owned payload.
    const found=await readOrder(null,access);
    if(!found||found.payload_hash!==input.hash)throw Error('Save unconfirmed');
    id=String(found.id);
   }
   committed=await readOrder(id||null,access);
   if(committed&&committed.payload_hash!==input.hash)return {error:'This request was already saved with different details. Check the saved receipt.'};
   if(!committed){
    if(definition.kind==='product'){
     const current=(await studioDb()`SELECT published_version FROM rivya_catalogue WHERE product_id=${definition.product!.id}`)[0];
     if(current?.published_version!==definition.schemaVersion)return {code:'SCHEMA_CHANGED',error:'This form changed while saving. Check current options before retrying.'};
    }
    return {code:'NO_SAVE',error:'The form, references or atelier settings changed. Reconnect, check current options, and retry or remove incomplete references. Nothing was submitted.'};
   }
  }
  // Core save is now confirmed. Message failure must NEVER be reported as a lost order.
  if(messageRetryEnabled())try{await finalizeOrderMessage(String(committed.id),access);}catch{/* Receipt exposes the saved pending state and authorized recovery. */}
  return {reference:String(committed.reference)};
 }catch{
  return committed?{reference:String(committed.reference)}:{code:'SAVE_UNCONFIRMED',error:'We could not confirm the save. Keep this page open and retry the same brief, or check its saved receipt. Do not start another inquiry.'};
 }
}
