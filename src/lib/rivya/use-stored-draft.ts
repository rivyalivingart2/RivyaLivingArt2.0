'use client';
import {useRef,useState} from 'react';
/** Only used inside the hydrated, isolated demo provider. Never stores customer data. */
export function useStoredDraft<T extends object>(key:string,defaults:T,prepare:(value:T)=>T=(v)=>v){
 const [initial]=useState(()=>{
  const value={...defaults};let storage=true;
  try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved&&typeof saved==='object')for(const k of Object.keys(defaults) as (keyof T)[])if(typeof saved[k]===typeof defaults[k]&&String(saved[k]).length<180)value[k]=saved[k];}catch{storage=false;}
  return {value:prepare(value),storage};
 });
 const [draft,setDraft]=useState(initial.value),[storage,setStorage]=useState(initial.storage);
 const current=useRef(initial.value);
 function update(value:T|((previous:T)=>T)){
  const next=typeof value==='function'?(value as (p:T)=>T)(current.current):value;
  current.current=next;setDraft(next);
  try{localStorage.setItem(key,JSON.stringify(next));setStorage(true);}catch{setStorage(false);}
 }
 return [draft,update,storage] as const;
}
