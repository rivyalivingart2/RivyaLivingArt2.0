import 'server-only';
import {createHash} from 'node:crypto';
import {validateBriefForm} from './brief-validation';
import type {InquiryDefinition} from './inquiry-definition';
import {answerSnapshot,savedDefinition} from './saved-brief';
import {orderConsentVersion} from './order-consent';
export function acceptedOrderInput(form:FormData,definition:InquiryDefinition){
 const validated=validateBriefForm(form,definition),errors=validated.errors;
 if(form.get('kind')!==definition.kind||form.get('schemaId')!==definition.schemaId||form.get('schemaVersion')!==String(definition.schemaVersion)||form.get('consentVersion')!==orderConsentVersion)errors.form='Review the current form and consent before submitting.';
 if(definition.kind==='product'&&(form.get('productId')!==definition.product?.id||form.get('revision')!==String(definition.schemaVersion)))errors.form='Review this piece’s current form.';
 if(definition.kind==='bespoke'&&(form.has('productId')||form.has('revision')))errors.form='A custom request cannot include a catalogue product.';
 const snapshot=savedDefinition(definition),answers=answerSnapshot(definition.fields,validated.byId),references=validated.refs.map(id=>id.toLowerCase()).sort();
 const route=definition.kind==='product'?'/pieces/'+definition.product!.slug+'/customize':'/commission/customize';
 const canonical={contractVersion:2,kind:definition.kind,schemaId:definition.schemaId,schemaVersion:definition.schemaVersion,answers,customer:validated.contact,referenceIds:references,consentVersion:orderConsentVersion,source:'website',route};
 return {errors,snapshot,answers,references,route,contact:validated.contact,labelAnswers:validated.answers,hash:createHash('sha256').update(JSON.stringify(canonical)).digest('hex')};
}
export type AcceptedOrderInput=ReturnType<typeof acceptedOrderInput>;
