import {reviewPublicationIssues} from './editorial-metadata';
import type {ContentDocument} from './content-model';
import {validUsage,type EditorialUsage} from './homepage-model';
import {safeEditorialHref} from './editorial-body';

export const editorialKinds=['portfolio','testimonial','faq'] as const;
export type EditorialKind=typeof editorialKinds[number];
export type EditorialRecord={schemaVersion:1;kind:EditorialKind;classification:'genuine'|'concept'|'fictional'|'guidance';attribution?:string;gallery?:EditorialUsage[];details?:{label:string;value:string}[];evidence?:{source:string;permission:string;reviewer:string;approvedOn:string};policyHref?:string};
export type PublicEditorialRecord=Omit<EditorialRecord,'evidence'>;
export const isEditorialId=(id:unknown):id is string=>typeof id==='string'&&/^editorial:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id);
const text=(v:unknown,max:number)=>typeof v==='string'&&v.length<=max&&!/[<>\u0000-\u0008]/.test(v);
export function validEditorialRecord(value:unknown,route:string):value is EditorialRecord {
 try{
  const e=value as EditorialRecord;
  if(!e||Object.keys(e).some(k=>!['schemaVersion','kind','classification','attribution','gallery','details','evidence','policyHref'].includes(k))||e.schemaVersion!==1||!editorialKinds.includes(e.kind))return false;
  const routeKind=e.kind==='testimonial'?'testimonials':e.kind;
  if(!new RegExp('^/'+routeKind+'/[a-z0-9]+(?:-[a-z0-9]+)*$').test(route))return false;
  const classifications=e.kind==='portfolio'?['genuine','concept']:e.kind==='testimonial'?['genuine','fictional']:['guidance'];
  if(!classifications.includes(e.classification))return false;
  if(e.attribution!==undefined&&(!text(e.attribution,150)||e.classification!=='genuine'&&e.attribution.trim()))return false;
  if(e.gallery!==undefined&&(!Array.isArray(e.gallery)||e.gallery.length>12||e.gallery.some(i=>!validUsage(i))))return false;
  if(e.kind==='testimonial'&&e.gallery?.length)return false;
  if(e.details!==undefined&&(!Array.isArray(e.details)||e.details.length>12||e.details.some(d=>!d||!text(d.label,80)||!text(d.value,500))))return false;
  if(e.policyHref!==undefined&&!safeEditorialHref(e.policyHref))return false;
  if(e.evidence!==undefined&&(!e.evidence||!['source','permission','reviewer','approvedOn'].every(k=>text(e.evidence![k as keyof NonNullable<EditorialRecord['evidence']>],1000))))return false;
  return true;
 }catch{return false;}
}
export function editorialPublicationIssues(d:ContentDocument):string[]{
 const reviewIssues=reviewPublicationIssues(d);if(reviewIssues.length)return reviewIssues;
 const e=d.editorial;if(!e)return [];
 if(e.classification==='genuine'){
  const evidence=e.evidence;
  if(!evidence||![evidence.source,evidence.permission,evidence.reviewer].every(v=>v.trim())||!/^\d{4}-\d{2}-\d{2}$/.test(evidence.approvedOn)||!Number.isFinite(Date.parse(evidence.approvedOn))||new Date(evidence.approvedOn).toISOString().slice(0,10)!==evidence.approvedOn||evidence.approvedOn>new Date().toISOString().slice(0,10))return ['Record the genuine source, permission to publish, reviewer and approval date before publishing.'];
  if(e.kind==='testimonial'&&!e.attribution?.trim())return ['Record the permitted public attribution before publishing genuine feedback.'];
 }
 if(e.kind==='faq'&&!e.policyHref&&!e.evidence?.source.trim())return ['Record the source or related policy for this new answer.'];
 return [];
}
export function publicEditorial(e:EditorialRecord):PublicEditorialRecord{
 return {schemaVersion:1,kind:e.kind,classification:e.classification,...(e.classification==='genuine'&&e.attribution?{attribution:e.attribution}:{}),...(e.gallery?{gallery:e.gallery}:{}),...(e.details?{details:e.details}:{}),...(e.policyHref?{policyHref:e.policyHref}:{})};
}
export function editorialDisclosure(e:PublicEditorialRecord){return e.classification==='concept'?'Concept study — not a completed customer project':e.classification==='fictional'?'Fictional sample — not a customer review':e.kind==='portfolio'?'Approved project story':e.kind==='testimonial'?'Published with permission':'Questions and guidance';}
