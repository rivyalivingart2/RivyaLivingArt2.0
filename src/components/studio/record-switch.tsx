'use client';
import {useEffect,useId,useRef,useState} from 'react';
import s from './workspace.module.css';

/** Queue a selection without changing the current draft. Only explicit discard applies it. */
export function useRecordSwitch(dirty:boolean){
 const [pending,setPending]=useState<{apply:()=>void;trigger:HTMLElement|null}|null>(null);
 function request(apply:()=>void){
  if(dirty)setPending({apply,trigger:document.activeElement instanceof HTMLElement?document.activeElement:null});
  else apply();
  return true;
 }
 function cancel(){const trigger=pending?.trigger;setPending(null);trigger?.focus();}
 function discard(){const apply=pending?.apply;setPending(null);apply?.();}
 return {request,pending:!!pending,cancel,discard};
}
export function RecordSwitchNotice({control}:{control:ReturnType<typeof useRecordSwitch>}){
 const keep=useRef<HTMLButtonElement>(null),id=useId();
 useEffect(()=>{if(control.pending)keep.current?.focus();},[control.pending]);
 if(!control.pending)return null;
 return <section className={s.panel} role="alertdialog" aria-labelledby={id} aria-describedby={id+'-body'} onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();control.cancel();}}}>
  <h2 id={id}>Keep your unsaved edits?</h2><p id={id+'-body'}>Switching records replaces the edits in this editor. Your saved and published versions stay unchanged.</p>
  <div className={s.actions}><button ref={keep} type="button" onClick={control.cancel}>Keep editing</button><button type="button" onClick={control.discard}>Discard edits and switch</button></div>
 </section>;
}
