import {fieldVisible,validateAnswers} from './product-form';
import type {InquiryDefinition} from './inquiry-definition';
export type BriefContact={name:string;phone:string;email:string;notes:string};
export function contactIssues(contact:BriefContact,consent:boolean){
 const errors:Record<string,string>={};
 if(contact.name.trim().length<2||contact.name.trim().length>100)errors.name='Enter your name (2–100 characters).';
 if(!/^\+?[0-9]{10,15}$/.test(contact.phone.replace(/[\s()-]/g,'')))errors.phone='Enter a valid phone number, including country code when outside India.';
 if(contact.email.trim()&&(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())||contact.email.trim().length>180))errors.email='Enter a valid email or leave it blank.';
 if(contact.notes.length>1200)errors.notes='Keep notes within 1,200 characters.';
 if(!consent)errors.consent='Please agree to saving your order details and references.';
 return errors;
}
export function validateBriefForm(form:FormData,definition:InquiryDefinition){
 const read=(key:string)=>{const value=form.get(key);return typeof value==='string'?value.trim():'';};
 const contact={name:read('name'),phone:read('phone'),email:read('email'),notes:read('notes')};
 const errors=contactIssues(contact,read('consent')==='on');
 const raw=Object.fromEntries(definition.fields.map(f=>[f.id,read('answer_'+f.id)]));
 const allowed=new Set(['kind','schemaId','schemaVersion','productId','revision','requestKey','name','phone','email','notes','consent','consentVersion','reference','website',...definition.fields.map(f=>'answer_'+f.id)]);
 if([...form.keys()].some(k=>!allowed.has(k)||k!=='reference'&&form.getAll(k).length!==1))errors.form='The brief contains an unsupported or repeated field. Review the current form.';
 if([...form.values()].some(v=>typeof v!=='string')||[...form.values()].reduce((n,v)=>n+String(v).length,0)>10000)errors.form='The brief is too long or contains unsupported data.';
 if(read('website'))errors.form='Unable to submit this request.';
 Object.assign(errors,validateAnswers(definition.fields,raw));
 const answers:Record<string,string>={},byId:Record<string,string>={};
 for(const field of definition.fields){if(fieldVisible(field,raw)){answers[field.label]=raw[field.id];byId[field.id]=raw[field.id];}else if(raw[field.id])errors[field.id]='This answer does not apply to the selected options.';}
 const refs=form.getAll('reference').filter((r):r is string=>typeof r==='string');
 if(refs.length>3||new Set(refs).size!==refs.length||refs.some(r=>!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(r)))errors.references='Retry or remove invalid reference images.';
 const phoneInput=contact.phone.replace(/[\s()-]/g,'');
 const phone=/^[0-9]{10}$/.test(phoneInput)?'+91'+phoneInput:phoneInput.startsWith('+')?phoneInput:'+'+phoneInput;
 return {errors,contact:{...contact,phone},answers,byId,refs};
}
