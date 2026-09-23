'use client';
import type {InquiryDefinition} from '@/lib/inquiry-definition';
import type {BriefContact} from '@/lib/brief-validation';
export type Reference={localId:string;file:File;id?:string;state:'pending'|'uploading'|'saved'|'failed';error?:string;progress?:number};
export type OrderDraft={definition:InquiryDefinition;key:string;answers:Record<string,string>;contact:BriefContact;consent:boolean;references:Reference[];step:number;review:string[];sealed:boolean};
// Tab memory only. Never localStorage/sessionStorage, cookies or serialized browser history.
const drafts=new Map<string,{draft:OrderDraft;timer:ReturnType<typeof setTimeout>}>();
export function readDraft(id:string){const draft=drafts.get(id)?.draft;return draft?{...draft,references:draft.references.map(r=>r.state==='uploading'||r.state==='pending'?{...r,state:'failed' as const,error:'Upload interrupted. Retry the same file.'}:r)}:undefined;}
export function forgetDraft(id:string){const item=drafts.get(id);if(item)clearTimeout(item.timer);drafts.delete(id);}
export function rememberDraft(id:string,draft:OrderDraft){
 forgetDraft(id);
 drafts.set(id,{draft,timer:setTimeout(()=>forgetDraft(id),30*60*1000)});
 if(drafts.size>5)forgetDraft(drafts.keys().next().value!);
}
