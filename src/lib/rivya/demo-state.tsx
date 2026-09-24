'use client';
import {useSyncExternalStore,createContext,useContext,useEffect,useRef,useState,type ReactNode} from 'react';
export type DemoRecord={id:string;title:string;kind:string;refs:string[];batch:string;route?:string|null};
export type LocalRevision={revision:number;data:string;at:string;status:'DRAFT'|'IN_REVIEW'|'APPROVED'|'ARCHIVED'};
export type DemoState={schemaVersion:1;removed:string[];retained:string[];drafts:Record<string,LocalRevision>;history:Record<string,LocalRevision[]>;published:Record<string,string>;hiddenMenus:string[];events:{id:string;at:string;action:string;target:string}[]};
export type SaveResult={ok:boolean;revision?:number;reason?:string};
export type RemovalPlan={removed:string[];blocked:string[];reasons:Record<string,string[]>};
const empty=():DemoState=>({schemaVersion:1,removed:[],retained:[],drafts:{},history:{},published:{},hiddenMenus:[],events:[]});
const KEY='rivya-sites-studio-v1';
export const localDocumentId=(id:string)=>/^LOCAL-(page|article|faq|testimonial|product)(?:-[a-f0-9-]{36})?$/.test(id);
const own=(o:object,k:string)=>Object.prototype.hasOwnProperty.call(o,k);
const object=(v:unknown):v is Record<string,unknown>=>Boolean(v)&&typeof v==='object'&&!Array.isArray(v);
const strings=(v:unknown)=>Array.isArray(v)?v.filter((x):x is string=>typeof x==='string'&&x.length<160).slice(0,2000):[];
function revision(v:unknown):v is LocalRevision{return object(v)&&Number.isSafeInteger(v.revision)&&Number(v.revision)>0&&typeof v.data==='string'&&v.data.length<=200000&&typeof v.at==='string'&&['DRAFT','IN_REVIEW','APPROVED','ARCHIVED'].includes(String(v.status))}
function decode(raw:string|null,allowed:(id:string)=>boolean):DemoState{
 if(!raw)return empty();if(raw.length>4000000)throw Error('Local state exceeds its safe size.');
 const v=JSON.parse(raw);if(!object(v)||v.schemaVersion!==1)throw Error('Unrecognized local state.');
 const s=empty();s.removed=strings(v.removed);s.retained=strings(v.retained);s.hiddenMenus=strings(v.hiddenMenus);
 if(object(v.drafts))for(const [id,r] of Object.entries(v.drafts))if(allowed(id)&&revision(r))s.drafts[id]=r;
 if(object(v.history))for(const [id,list] of Object.entries(v.history))if(allowed(id)&&Array.isArray(list))s.history[id]=list.filter(revision).slice(-12);
 if(object(v.published))for(const [id,data] of Object.entries(v.published))if(allowed(id)&&typeof data==='string'&&data.length<=200000)s.published[id]=data;
 if(Array.isArray(v.events))s.events=v.events.filter(e=>object(e)&&['id','at','action','target'].every(k=>typeof e[k]==='string'&&String(e[k]).length<20000)).slice(-250) as DemoState['events'];
 return s;
}
/** Only named reference fields become edges. Never treat ordinary prose as an ID. */
export function draftReferences(raw?:string):string[]{
 const refs=new Set<string>();let visited=0;
 const walk=(value:unknown,depth=0)=>{if(depth>24||++visited>15000)return;if(Array.isArray(value)){value.forEach(v=>walk(v,depth+1));return}if(!object(value))return;
  for(const [key,v] of Object.entries(value)){if(['relatedProductIds','referenceIds','productIds','mediaIds'].includes(key)&&Array.isArray(v))v.forEach(id=>{if(typeof id==='string')refs.add(id)});else if(['productId','mediaId','assetId','documentId','pageId'].includes(key)&&typeof v==='string')refs.add(v);else walk(v,depth+1)}
 };try{walk(JSON.parse(raw||'null'))}catch{}return [...refs];
}
export function planDemoRemoval(records:DemoRecord[],state:DemoState,ids:string[]):RemovalPlan{
 const selected=new Set(ids.filter(id=>records.some(r=>r.id===id)&&!state.removed.includes(id))),reasons:Record<string,string[]>={};
 const edges=records.map(r=>({id:r.id,refs:[...r.refs,...draftReferences(state.drafts[r.id]?.data),...draftReferences(state.published[r.id]),...(r.id.startsWith('FORM-')?[r.id.slice(5)]:[])]}));
 for(const id of selected){if(state.retained.includes(id))reasons[id]=['Explicit retain protection'];if(state.drafts[id])reasons[id]=[...(reasons[id]||[]),'Locally edited draft'];if(state.published[id])reasons[id]=[...(reasons[id]||[]),'Local published snapshot'];}
 let changed=true;while(changed){changed=false;for(const id of selected){if(reasons[id])continue;const inbound=edges.filter(r=>r.id!==id&&r.refs.includes(id)&&!state.removed.includes(r.id)&&(!selected.has(r.id)||reasons[r.id])).map(r=>`Referenced by ${r.id}`);if(inbound.length){reasons[id]=inbound;changed=true}}}
 return {removed:[...selected].filter(id=>!reasons[id]),blocked:Object.keys(reasons),reasons};
}

type DemoContextType={state:DemoState;records:DemoRecord[];ready:boolean;storage:boolean;notice:string;save:(id:string,data:unknown,expectedRevision?:number)=>SaveResult;saveMany:(items:{id:string;data:unknown;expectedRevision:number}[])=>SaveResult;transition:(id:string,action:'submit'|'approve'|'publish'|'unpublish'|'archive')=>void;retain:(id:string)=>void;planRemoval:(ids:string[])=>RemovalPlan;remove:(ids:string[])=>RemovalPlan;restore:(id:string,revision:number)=>void;reinstall:()=>void;menu:(id:string)=>void;visible:(id:string)=>boolean};
const Context=createContext<DemoContextType|null>(null);
const subscribeHydration=()=>()=>{};
export function DemoProvider(props:{children:ReactNode;records:DemoRecord[]}){
 const ready=useSyncExternalStore(subscribeHydration,()=>true,()=>false);
 return ready?<HydratedDemoProvider {...props}/>:<p role="status">Opening the local design preview…</p>;
}
function HydratedDemoProvider({children,records}:{children:ReactNode;records:DemoRecord[]}){
 const [initial]=useState(()=>{try{const raw=localStorage.getItem(KEY),state=decode(raw,id=>records.some(r=>r.id===id)||localDocumentId(id)||/^FORM-(DP\d{3}|GENERAL)$/.test(id));state.removed=[...new Set([...state.removed,...strings(JSON.parse(localStorage.getItem(KEY+':removed')||'[]'))])];return {state,raw,storage:true,notice:''};}catch{return {state:empty,raw:null,storage:false,notice:'Saved browser data could not be read. It has not been overwritten. Export current edits before clearing storage.'};}});
 const [state,setState]=useState<DemoState>(initial.state),[storage,setStorage]=useState(initial.storage),[notice,setNotice]=useState(initial.notice);const ready=true;
 const current=useRef(state),lastRaw=useRef<string|null>(initial.raw),loaded=useRef(true),canWrite=useRef(initial.storage);
 const allowed=(id:string)=>records.some(r=>r.id===id)||localDocumentId(id)||/^FORM-(DP\d{3}|GENERAL)$/.test(id);
 const adopt=(next:DemoState)=>{current.current=next;setState(next)};
 useEffect(()=>{
  const hydrate=()=>{let removed:string[]=[];try{removed=strings(JSON.parse(localStorage.getItem(KEY+':removed')||'[]'));const raw=localStorage.getItem(KEY),next=decode(raw,allowed);lastRaw.current=raw;next.removed=[...new Set([...next.removed,...removed])];adopt(next);canWrite.current=true;setStorage(true)}catch{adopt({...current.current,removed:[...new Set([...current.current.removed,...removed])]});canWrite.current=false;setStorage(false);setNotice('Saved browser data could not be read. It has not been overwritten. Export any current edits before clearing storage.')}};
  const external=(event:StorageEvent)=>{if(event.key===KEY||event.key===KEY+':removed'){hydrate();setNotice('Another tab changed this browser demo. Open editors keep their input; stale draft saves are rejected.')}};
  window.addEventListener('storage',external);return()=>window.removeEventListener('storage',external);
 // The source registry is immutable for this mounted provider.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[]);
 function update(action:string,target:string,change:(s:DemoState)=>DemoState):SaveResult{
  if(!loaded.current)return {ok:false,reason:'Local storage is still loading.'};
  if(canWrite.current)try{const raw=localStorage.getItem(KEY);if(raw!==lastRaw.current){const next=decode(raw,allowed);next.removed=[...new Set([...next.removed,...strings(JSON.parse(localStorage.getItem(KEY+':removed')||'[]'))])];adopt(next);lastRaw.current=raw;const reason='Another tab changed this demo. Review the current state before retrying.';setNotice(reason);return {ok:false,reason}}}catch{canWrite.current=false;setStorage(false)}
  const base=current.current,next=change(base);if(next===base)return {ok:false,reason:'The requested transition is unavailable for this revision.'};
  next.events=[...base.events,{id:crypto.randomUUID(),at:new Date().toISOString(),action,target}].slice(-250);
  const raw=JSON.stringify(next);if(raw.length>3900000){const reason='The browser demo is full. Export your drafts before removing browser data.';setNotice(reason);return {ok:false,reason}}
  adopt(next);
  if(canWrite.current)try{localStorage.setItem(KEY+':removed',JSON.stringify(next.removed));localStorage.setItem(KEY,raw);lastRaw.current=raw;setStorage(true)}catch{canWrite.current=false;setStorage(false);setNotice('Browser storage is full or unavailable. This change is held only in this tab; export it before leaving.')}
  return {ok:true};
 }
 const saveMany:DemoContextType['saveMany']=(items)=>{
  if(!items.length||items.length>120||new Set(items.map(i=>i.id)).size!==items.length)return {ok:false,reason:'Choose between one and 120 distinct records.'};
  const prepared:{id:string;data:string;expectedRevision:number}[]=[];
  for(const item of items){if(!allowed(item.id)||current.current.removed.includes(item.id))return {ok:false,reason:`${item.id} is unavailable.`};let data:string;try{data=JSON.stringify(item.data)}catch{return {ok:false,reason:'The draft cannot be serialized.'}}if(!data||data.length>200000)return {ok:false,reason:'A draft exceeds the local size limit.'};prepared.push({...item,data})}
  let conflict='';const result=update('Local draft checkpoint',prepared.map(i=>i.id).join(', '),s=>{for(const item of prepared)if((s.drafts[item.id]?.revision||0)!==item.expectedRevision){conflict=`${item.id} has a newer local revision. Reopen it or export your current input before reconciling.`;return s}const next={...s,drafts:{...s.drafts},history:{...s.history}};for(const item of prepared){const r:LocalRevision={revision:item.expectedRevision+1,data:item.data,at:new Date().toISOString(),status:'DRAFT'};next.drafts[item.id]=r;next.history[item.id]=[...(s.history[item.id]||[]),r].slice(-12)}return next});
  if(conflict){setNotice(conflict);return {ok:false,reason:conflict}}return result.ok?{...result,revision:prepared[0].expectedRevision+1}:result;
 };
 const save:DemoContextType['save']=(id,data,expectedRevision=current.current.drafts[id]?.revision||0)=>saveMany([{id,data,expectedRevision}]);
 const allRecords=(s:DemoState)=>[...records,...Object.keys(s.drafts).filter(id=>localDocumentId(id)||id.startsWith('FORM-')).map(id=>{let title=id;try{const d=JSON.parse(s.drafts[id].data);title=d.title||d.name||id}catch{}return {id,title,kind:id.startsWith('FORM-')?'form':id.split('-')[1],refs:[],batch:'local-drafts'}})];
 const planRemoval=(ids:string[])=>planDemoRemoval(allRecords(current.current),current.current,ids);
 const context:DemoContextType={state,records:allRecords(state),ready,storage,notice,save,saveMany,planRemoval,
  transition:(id,action)=>{update(`Demo ${action}`,id,s=>{const d=s.drafts[id];if(s.removed.includes(id))return s;if(action==='unpublish'){if(!own(s.published,id))return s;const p={...s.published};delete p[id];return {...s,published:p}}if(!d)return s;if(action==='publish')return d.status==='APPROVED'?{...s,published:{...s.published,[id]:d.data}}:s;if(action==='submit'&&d.status!=='DRAFT'||action==='approve'&&d.status!=='IN_REVIEW')return s;const status:LocalRevision['status']=action==='submit'?'IN_REVIEW':action==='approve'?'APPROVED':'ARCHIVED';const next={...d,status};return {...s,drafts:{...s.drafts,[id]:next},history:{...s.history,[id]:(s.history[id]||[]).map(r=>r.revision===d.revision?next:r)}}})},
  remove:ids=>{let plan=planRemoval(ids);const result=update('Manual demo removal',ids.join(', '),s=>{plan=planDemoRemoval(allRecords(s),s,ids);return {...s,removed:[...new Set([...s.removed,...plan.removed])]}});return result.ok?plan:{removed:[],blocked:ids,reasons:Object.fromEntries(ids.map(id=>[id,[result.reason||'Removal could not be applied.']]))}},
  visible:id=>!state.removed.includes(id),retain:id=>{if(allowed(id))update('Retain protection changed',id,s=>({...s,retained:s.retained.includes(id)?s.retained.filter(x=>x!==id):[...s.retained,id]}))},
  restore:(id,version)=>{const old=current.current.history[id]?.find(r=>r.revision===version);if(old)try{save(id,JSON.parse(old.data))}catch{}},
  reinstall:()=>{update('Deliberate reinstall of removed samples','sample batch',s=>({...s,removed:[]}))},
  menu:id=>{update('Demo menu visibility changed',id,s=>({...s,hiddenMenus:s.hiddenMenus.includes(id)?s.hiddenMenus.filter(x=>x!==id):[...s.hiddenMenus,id]}))}
 };
 return <Context.Provider value={context}>{children}</Context.Provider>
}
export function useDemo(){const value=useContext(Context);if(!value)throw Error('Demo context is required');return value}
export function useOptionalDemo(){return useContext(Context)}
