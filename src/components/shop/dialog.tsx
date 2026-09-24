'use client';
import {useEffect,useId,useRef,type ReactNode} from 'react';
import s from './shop.module.css';

const scrollLocks = new Set<symbol>();
let savedOverflow = '';

function lockScroll() {
  const lock = Symbol();
  if (scrollLocks.size === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLocks.add(lock);
  return () => {
    scrollLocks.delete(lock);
    if (scrollLocks.size === 0) document.body.style.overflow = savedOverflow;
  };
}

/** Native dialog provides focus containment, Escape and return to the opener. */
export function Dialog({open,title,onClose,children,variant='panel'}:{open:boolean;title:string;onClose:()=>void;children:ReactNode;variant?:'panel'|'navigation'}) {
  const ref=useRef<HTMLDialogElement>(null);
  const titleId=useId();
  useEffect(()=>{
    const node=ref.current;
    if(!node || !open) return;
    const previous=document.activeElement;
    node.showModal();
    const unlock=lockScroll();
    return()=>{
      node.close();
      unlock();
      if(previous instanceof HTMLElement && previous.isConnected && previous.getClientRects().length) {
        previous.focus({preventScroll:true});
      } else if (scrollLocks.size === 0) {
        document.getElementById('main-content')?.focus({preventScroll:true});
      }
    };
  },[open]);
  return <dialog ref={ref} className={`${s.dialog} ${variant==='navigation'?s.mobileMenu:''}`} aria-labelledby={titleId} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{
    if(e.target!==e.currentTarget) return;
    const rect=e.currentTarget.getBoundingClientRect();
    if(e.clientX<rect.left || e.clientX>rect.right || e.clientY<rect.top || e.clientY>rect.bottom) onClose();
  }}>
    <div className={s.dialogHead}><h2 id={titleId}>{title}</h2><button className={s.closeButton} type="button" onClick={onClose} aria-label={variant==='navigation'?'Close navigation':'Close dialog'}>Close ×</button></div>{open&&children}
  </dialog>;
}
