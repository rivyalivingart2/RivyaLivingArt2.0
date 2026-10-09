import {decodeSavedBrief} from './saved-brief';
/** Only persisted customer facts. Never infer specification, consent or confirmation. */
export function inquiryCard(record:Record<string,unknown>){
 const rows:{label:string;value:string}[]=[];
 const add=(label:string,value:unknown)=>{if(typeof value==='string'&&value.trim())rows.push({label,value});};
 add('Customer',record.name);add('Phone',record.phone);add('Email',record.email);
 const product=record.product_snapshot as {name?:string;id?:string}|null;
 if(product){add('Catalogue starting point',product.name);add('Product reference',product.id);}
 if(record.contract_version===2){
  const brief=decodeSavedBrief(record);add('Brief',brief.definition.kind==='bespoke'?brief.definition.title:undefined);
  for(const answer of brief.answers)add(answer.label,String(answer.value));
 }else for(const [label,value] of Object.entries((record.answers||{}) as Record<string,unknown>))add(label,value);
 add('Customer notes',record.notes);
 return rows;
}
