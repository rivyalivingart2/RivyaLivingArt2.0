'use client';
import {useEffect} from 'react';
/** Keep private edits in this tab, not persistent browser storage. */
export function useUnsavedWork(dirty:boolean) {
  useEffect(()=>{
    const warn=(event:BeforeUnloadEvent)=>{if(dirty){event.preventDefault();event.returnValue='';}};
    window.addEventListener('beforeunload',warn);
    return ()=>window.removeEventListener('beforeunload',warn);
  },[dirty]);
}
