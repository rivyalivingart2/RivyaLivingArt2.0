import type {Locale} from './site-settings-model';
import type {ContentDocument,ContentTranslation} from './content-model';
export const priorityLocales=['en','hi','gu'] as const;
export type TranslationField={path:string;source:string};
const textKeys=new Set(['title','eyebrow','description','heading','text','body','alt','caption','label','annotation','appearance','limitations','care','placement']);
const textArrays=new Set(['paragraphs','checklist','strip']);
/** Only editorial text is writable: no IDs, destinations, products, crops or snapshots. */
export function translationFields(document:ContentDocument):TranslationField[]{
 const result:TranslationField[]=[];
 const visit=(value:unknown,path:string,key:string)=>{
  if(typeof value==='string'){if(value.trim()&&(textKeys.has(key)||textArrays.has(key)||key==='value'&&/^editorial\.details\.\d+\.value$/.test(path)))result.push({path,source:value});return;}
  if(Array.isArray(value)){value.forEach((v,i)=>visit(v,path+'.'+i,key));return;}
  if(value&&typeof value==='object')for(const [k,v] of Object.entries(value)){
   if(['sourceNote','evidence','translations','homeSnapshot','pageSnapshot','relatedProductIds','productIds','categories'].includes(k))continue;
   visit(v,path?path+'.'+k:k,k);
  }
 };
 for(const key of ['title','eyebrow','description','imageAlt','sections','headerImage','homepage','landing','editorial'] as const){
  if(key==='imageAlt'&&document.imageAlt)result.push({path:key,source:document.imageAlt});else visit(document[key],key,key);
 }
 return result;
}
/** Deterministic change detector, not an authorization or cryptographic signature. */
export function translationRevision(document:ContentDocument,fields:Record<string,string>){
 const value=JSON.stringify([translationFields(document),Object.entries(fields).sort(([a],[b])=>a.localeCompare(b,'en'))]);
 let a=2166136261,b=5381;for(let i=0;i<value.length;i++){a=Math.imul(a^value.charCodeAt(i),16777619);b=Math.imul(b,33)^value.charCodeAt(i);}
 return (a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');
}
export function translationStatus(document:ContentDocument,locale:string){
 if(locale==='en')return {state:'source' as const,total:translationFields(document).length,missing:0};
 const t=document.translations?.[locale as Locale];
 const fields=translationFields(document),missing=fields.filter(f=>!t?.fields?.[f.path]?.trim()).length;
 const state=!t?'missing':missing?'incomplete':t.reviewedRevision===translationRevision(document,t.fields||{})?'reviewed':t.reviewedRevision?'stale':'needs review';
 return {state,total:fields.length,missing};
}
export function validTranslationFields(document:ContentDocument,t:ContentTranslation){
 if(t.reviewedRevision!==undefined&&!/^[0-9a-f]{16}$/.test(t.reviewedRevision))return false;
 if(t.fields===undefined)return true;
 if(!t.fields||typeof t.fields!=='object'||Array.isArray(t.fields))return false;
 const allowed=new Map(translationFields(document).map(f=>[f.path,f.source]));
 return Object.entries(t.fields).every(([path,text])=>(allowed.has(path)||/^(?:sections|homepage)\.(?:[a-zA-Z]+|\d+)(?:\.(?:[a-zA-Z]+|\d+))*$/.test(path)&&!path.split('.').some(p=>['__proto__','constructor','prototype','href','path','productId','productIds'].includes(p)))&&typeof text==='string'&&text.length<=6000&&!/[<>\u0000-\u0008]/.test(text));
}
export function applyReviewedTranslation(document:ContentDocument,locale:string):ContentDocument{
 if(translationStatus(document,locale).state!=='reviewed')return document;
 const t=document.translations![locale as Locale]!,next=structuredClone(document);
 for(const {path} of translationFields(document)){
  const parts=path.split('.');let target:unknown=next;
  for(const part of parts.slice(0,-1))target=(target as Record<string,unknown>)[part];
  (target as Record<string,unknown>)[parts.at(-1)!]=t.fields![path];
 }
 return next;
}
export function reviewTranslationImport(document:ContentDocument,locale:string,input:unknown){
 const issues:string[]=[];
 if(!['hi','gu'].includes(locale))issues.push('Choose Hindi or Gujarati.');
 if(!input||typeof input!=='object'||Array.isArray(input))return {issues:['Use an object with documentId, locale and fields.'],fields:null};
 const value=input as Record<string,unknown>;
 if(Object.keys(value).some(k=>!['documentId','locale','fields'].includes(k)))issues.push('Only documentId, locale and fields are accepted; protected data cannot be imported.');
 if(value.documentId!==document.id||value.locale!==locale)issues.push('The document ID and language must match this editor.');
 const candidate={fields:value.fields} as ContentTranslation;
 const allowed=new Set(translationFields(document).map(f=>f.path));
 if(!candidate.fields||!validTranslationFields(document,candidate)||Object.keys(candidate.fields).some(path=>!allowed.has(path)))issues.push('Unknown, protected, oversized or invalid text fields were found.');
 return {issues,fields:issues.length?null:candidate.fields!};
}
