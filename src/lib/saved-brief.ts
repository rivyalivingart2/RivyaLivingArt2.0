import type {AnswerSnapshot,SavedBriefV2,SavedRequestDefinition} from './order-contract';
import type {InquiryDefinition} from './inquiry-definition';
import type {CustomField} from './product-form';
import {fieldVisible,validateAnswers} from './product-form';
import {fieldSchemaIssues} from './field-schema';
import {contactIssues} from './brief-validation';
import {orderConsentVersion,orderMessageTemplate} from './order-consent';
export const uuid=(v:unknown):v is string=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const text=(v:unknown,max:number):v is string=>typeof v==='string'&&v.length<=max;
const date=(v:unknown)=>typeof v==='string'&&Number.isFinite(Date.parse(v));
export function savedDefinition(d:InquiryDefinition):SavedRequestDefinition{
 return d.kind==='product'&&d.product?{kind:'product',productId:d.product.id,product:d.product,schemaId:d.schemaId,schemaVersion:d.schemaVersion,fields:d.fields}:
 {kind:'bespoke',productId:null,product:null,schemaId:'bespoke-piece',schemaVersion:d.schemaVersion,title:d.title,fields:d.fields};
}
export function answerSnapshot(fields:readonly CustomField[],byId:Record<string,string>):AnswerSnapshot[]{
 return fields.filter(f=>fieldVisible(f,byId)&&byId[f.id]).map(f=>f.type==='number'?{fieldId:f.id,label:f.label,type:'number',value:Number(byId[f.id]),unit:null}:f.type==='select'?{fieldId:f.id,label:f.label,type:'select',value:byId[f.id],optionLabel:byId[f.id],unit:null}:{fieldId:f.id,label:f.label,type:'text',value:byId[f.id],unit:null});
}
/** Validate historical evidence without consulting today's catalogue or substituting current copy. */
export function decodeSavedBrief(row:Record<string,unknown>):SavedBriefV2{
 const d=row.schema_snapshot;
 if(row.contract_version!==2||!object(d)||!Number.isSafeInteger(d.schemaVersion)||Number(d.schemaVersion)<1||fieldSchemaIssues(d.fields).length)throw Error('Invalid saved schema');
 const fields=d.fields as CustomField[];let definition:SavedRequestDefinition;
 if(d.kind==='product'){
  const p=d.product;
  if(!object(p)||!text(p.id,100)||!text(p.name,100)||!p.name||p.id!==d.productId||row.product_id!==p.id||d.schemaId!=='product:'+p.id||!['large','memory','personal'].includes(String(p.tier))||!['slug','subtitle','category','image','story'].every(k=>typeof p[k]==='string')||p.revision!==d.schemaVersion)throw Error('Invalid saved product');
  definition={kind:'product',productId:p.id,schemaId:String(d.schemaId),schemaVersion:Number(d.schemaVersion),fields,product:{id:p.id,name:p.name,slug:String(p.slug),subtitle:String(p.subtitle),category:String(p.category),image:String(p.image),story:String(p.story),tier:p.tier as 'large'|'memory'|'personal',revision:Number(p.revision),fields}};
 }else{
  if(d.kind!=='bespoke'||d.schemaId!=='bespoke-piece'||d.productId!==null||d.product!==null||row.product_id!==null||row.product_snapshot!==null||!text(d.title,100)||!d.title)throw Error('Invalid saved custom piece');
  definition={kind:'bespoke',productId:null,product:null,schemaId:'bespoke-piece',schemaVersion:Number(d.schemaVersion),title:d.title,fields};
 }
 if(row.request_kind!==definition.kind||row.schema_id!==definition.schemaId||row.schema_version!==definition.schemaVersion||!Array.isArray(row.answer_snapshot)||row.answer_snapshot.length>fields.length)throw Error('Invalid saved identity');
 const byId:Record<string,string>={},answers:AnswerSnapshot[]=[];let last=-1;
 for(const a of row.answer_snapshot){
  if(!object(a)||typeof a.fieldId!=='string'||Object.hasOwn(byId,a.fieldId))throw Error('Invalid saved answer');
  const index=fields.findIndex(f=>f.id===a.fieldId),f=fields[index];
  if(!f||index<=last||a.label!==f.label||a.type!==f.type||a.unit!==null)throw Error('Invalid saved field');
  if(f.type==='number'){if(typeof a.value!=='number'||!Number.isSafeInteger(a.value))throw Error('Invalid number');}
  else if(!text(a.value,240)||!a.value)throw Error('Invalid text');
  if(f.type==='select'&&a.optionLabel!==a.value)throw Error('Invalid option label');
  byId[f.id]=String(a.value);last=index;
 }
 if(Object.keys(validateAnswers(fields,byId)).length||fields.some(f=>byId[f.id]&&!fieldVisible(f,byId)))throw Error('Invalid saved answers');
 answers.push(...answerSnapshot(fields,byId));
 const customer={name:row.name,phone:row.phone,email:row.email};
 if(!text(customer.name,100)||!text(customer.phone,20)||!text(customer.email,180)||!text(row.notes,1200)||Object.keys(contactIssues({name:customer.name,phone:customer.phone,email:customer.email,notes:row.notes},true)).length)throw Error('Invalid saved customer');
 if(!uuid(row.id)||!text(row.reference,80)||!row.reference||!Number.isInteger(row.reference_count)||Number(row.reference_count)<0||Number(row.reference_count)>3||row.submission_source!=='website'||row.consent_version!==orderConsentVersion||!text(row.source_route,300)||!row.source_route.startsWith('/')||/[?#]/.test(row.source_route)||!date(row.consent_accepted_at)||!date(row.created_at))throw Error('Invalid saved evidence');
 return {contractVersion:2,id:row.id,reference:row.reference,definition,answers,customer:{name:customer.name,phone:customer.phone,email:customer.email},notes:row.notes,referenceCount:Number(row.reference_count),evidence:{source:'website',route:row.source_route,consentVersion:row.consent_version,consentAcceptedAt:String(row.consent_accepted_at)},createdAt:String(row.created_at)};
}
export function inquiryDefinitionFromSaved(brief:SavedBriefV2):InquiryDefinition{
 const d=brief.definition;return {kind:d.kind,schemaId:d.schemaId,schemaVersion:d.schemaVersion,title:d.kind==='product'?d.product.name:d.title,subtitle:d.kind==='product'?d.product.subtitle:'Your own starting point',fields:[...d.fields],product:d.product};
}
/** Retain this renderer unchanged once v1 rows exist. New wording requires a new version. */
export function renderSavedMessage(brief:SavedBriefV2,template:string){
 if(template!==orderMessageTemplate)throw Error('Unsupported saved renderer');
 const d=brief.definition;
 return [`RivyaLivingArt — Order inquiry ${brief.reference}`,d.kind==='product'?`Piece: ${d.product.name} (${d.productId})`:`Custom request: ${d.title}`,`Name: ${brief.customer.name}`,`Phone: ${brief.customer.phone}`,brief.customer.email?`Email: ${brief.customer.email}`:'',...brief.answers.map(a=>`${a.label}: ${a.value}${a.unit?' '+a.unit:''}`),brief.notes?`Notes: ${brief.notes}`:'',`Reference images: ${brief.referenceCount} saved privately in the Studio.`,`Please review this order request and confirm the design, quotation and delivery with me.`].filter(Boolean).join('\n');
}
