import type {ShopProduct} from './shop-model';
import type {CustomField} from './product-form';
import {bespokeSchemaV1} from './bespoke-schema';

export type InquiryDefinition={kind:'product'|'bespoke';schemaId:string;schemaVersion:number;title:string;subtitle:string;fields:CustomField[];product:ShopProduct|null};
export const productDefinition=(product:ShopProduct):InquiryDefinition=>({kind:'product',schemaId:'product:'+product.id,schemaVersion:product.revision,title:product.name,subtitle:product.subtitle,fields:product.fields,product});
export const bespokeDefinition=():InquiryDefinition=>({kind:'bespoke',schemaId:bespokeSchemaV1.id,schemaVersion:bespokeSchemaV1.version,title:bespokeSchemaV1.title,subtitle:'Your own starting point',fields:structuredClone([...bespokeSchemaV1.fields]),product:null});

/** Retain compatible answers only; return every changed answer for visible manual review. */
export function reconcileAnswers(previous:InquiryDefinition,next:InquiryDefinition,answers:Record<string,string>){
 const retained:Record<string,string>={},review:string[]=[];
 for(const [id,value] of Object.entries(answers)){
  if(!value)continue;
  const old=previous.fields.find(f=>f.id===id),field=next.fields.find(f=>f.id===id);
  if(old&&field&&old.type===field.type&&old.label===field.label&&old.visibleWhen?.field===field.visibleWhen?.field&&old.visibleWhen?.value===field.visibleWhen?.value&&value.length<=(field.maxLength??240)&&(field.type!=='select'||field.options?.includes(value))&&(field.type!=='number'||/^\d+$/.test(value)&&Number(value)>=(field.min??1)&&Number(value)<=(field.max??500)))retained[id]=value;
  else review.push((old?.label||id)+': '+value);
 }
 return {answers:retained,review};
}
