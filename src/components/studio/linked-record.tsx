'use client';
import {useEffect,useMemo,useRef} from 'react';
import {useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {studioRecordTarget,type RecordEditor,type RecordTarget} from '@/lib/studio-record-links';
import s from './workspace.module.css';

/** URL selection only. Never saves, publishes, or applies a proposed correction. */
export function useLinkedRecord<T>({editor,records,loaded,selectedId,onSelect,idOf,busy=false}:{editor:RecordEditor;records:T[];loaded:boolean;selectedId?:string;idOf:(record:T)=>string;onSelect:(record:T,target:RecordTarget)=>boolean;busy?:boolean}){
 const params=useSearchParams();
 const target=useMemo(()=>studioRecordTarget(editor,params),[editor,params]);
 const key=target?JSON.stringify(target):'';
 const handled=useRef(''),focusKey=useRef('');
 const record=target?records.find(row=>idOf(row)===target.record):undefined;
 useEffect(()=>{
  if(!loaded||busy||handled.current===key)return;
  handled.current=key;
  if(target&&record&&onSelect(record,target))focusKey.current=key;
 },[loaded,busy,key,target,record,onSelect]);
 useEffect(()=>{
  if(!target||selectedId!==target.record||focusKey.current!==key)return;
  const frame=requestAnimationFrame(()=>{
   const field=document.getElementById(`${editor}-field-${target.field}`);
   if(field){field.focus({preventScroll:true});field.scrollIntoView({block:'center',behavior:'instant'});focusKey.current='';}
  });
  return()=>cancelAnimationFrame(frame);
 },[editor,key,selectedId,target]);
 return {requested:!!params.get('record'),missing:loaded&&!!params.get('record')&&(!target||!record)};
}
export function LinkedRecordNotice({requested,missing}:{requested:boolean;missing:boolean}){
 if(!requested)return null;
 return <div className={s.panel}>{missing&&<p role="alert">The linked record is unavailable. It may have been removed or your access may have changed. No other record was selected automatically.</p>}<Link href="/studio/content-health">← Return to Content health</Link></div>;
}
