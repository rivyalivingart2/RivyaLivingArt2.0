import type {ContentDocument} from './content-model';
import {translationRevision,translationStatus} from './translation-review';
export type DiscoveryMetadata={journey?:string;format?:string;tags?:string[];materials?:string[];context?:string;linkedRecordIds?:string[]};
export type ReviewEvidence={reviewer:string;date:string;evidence:string;revision:string};
export type EditorialReview={author?:string;source?:string;duplicateOf?:string;lastVerified?:string;authorReview?:ReviewEvidence;meaning?:Partial<Record<'en'|'hi'|'gu',ReviewEvidence>>;native?:Partial<Record<'en'|'hi'|'gu',ReviewEvidence>>};
const text=(v:unknown,n:number)=>typeof v==='string'&&v.length<=n&&!/[<>\u0000-\u001f]/.test(v);
const date=(v:unknown)=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v&&v<=new Date().toISOString().slice(0,10);
export function validDiscovery(v:unknown):v is DiscoveryMetadata{
 if(!v||typeof v!=='object'||Array.isArray(v))return false;
 const d=v as DiscoveryMetadata;
 return Object.keys(d).every(k=>['journey','format','tags','materials','context','linkedRecordIds'].includes(k))&&['journey','format','context'].every(k=>d[k as 'journey']===undefined||text(d[k as 'journey'],80))&&['tags','materials','linkedRecordIds'].every(k=>{const a=d[k as 'tags'];return a===undefined||Array.isArray(a)&&a.length<=12&&new Set(a).size===a.length&&a.every(s=>text(s,100));});
}
export function validEditorialReview(v:unknown):v is EditorialReview{
 if(!v||typeof v!=='object'||Array.isArray(v))return false;const r=v as EditorialReview;
 if(Object.keys(r).some(k=>!['author','source','duplicateOf','lastVerified','authorReview','meaning','native'].includes(k)))return false;
 if(['author','source','duplicateOf'].some(k=>r[k as 'author']!==undefined&&!text(r[k as 'author'],k==='source'?1500:150))||r.lastVerified!==undefined&&!date(r.lastVerified))return false;
 const evidence=(e:ReviewEvidence)=>!!e&&Object.keys(e).every(k=>['reviewer','date','evidence','revision'].includes(k))&&text(e.reviewer,150)&&!!e.reviewer.trim()&&date(e.date)&&text(e.evidence,1500)&&!!e.evidence.trim()&&/^[0-9a-f]{16}$/.test(e.revision);
 if(r.authorReview&&!evidence(r.authorReview))return false;
 return ['meaning','native'].every(k=>{const value=r[k as 'meaning'];return value===undefined||!!value&&typeof value==='object'&&!Array.isArray(value)&&Object.entries(value).every(([locale,e])=>['en','hi','gu'].includes(locale)&&evidence(e));});
}
export const reviewRevision=(d:ContentDocument,locale:string)=>translationRevision(d,locale==='en'?{}:d.translations?.[locale as 'hi'|'gu']?.fields||{});
export function reviewState(d:ContentDocument,kind:'author'|'meaning'|'native',locale:'en'|'hi'|'gu'='en'){
 const e=kind==='author'?d.review?.authorReview:d.review?.[kind]?.[locale];
 return !e?'Not performed':e.revision===reviewRevision(d,kind==='author'?'en':locale)?'Evidence recorded':'Stale evidence';
}
export function publicDiscovery(d:ContentDocument){return {metadata:d.discovery||{},languages:['en',...(['hi','gu'] as const).filter(locale=>translationStatus(d,locale).state==='reviewed')]};}
export function reviewPublicationIssues(d:ContentDocument){return d.review?.duplicateOf?['Resolve the duplicate-content flag before publishing this record.']:[];}
