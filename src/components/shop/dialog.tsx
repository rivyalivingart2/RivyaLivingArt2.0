'use client';
import {useJourneyText} from './journey-language';
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

/** Native modal inertness with explicit keyboard wrap, Escape and opener recovery. */
export function Dialog({open,title,onClose,children,variant='panel',closeLabel}:{open:boolean;title:string;onClose:()=>void;children:ReactNode;variant?:'panel'|'navigation';closeLabel?:string}) {
  const tr=useJourneyText();
  const ref=useRef<HTMLDialogElement>(null);
  const titleId=useId();
  useEffect(()=>{
    const node=ref.current;
    if(!node || !open) return;
    const previous=document.activeElement;
    node.showModal();
    node.querySelector<HTMLElement>('[data-dialog-autofocus]')?.focus({preventScroll:true});
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
  return <dialog ref={ref} className={`${s.dialog} ${variant==='navigation'?s.mobileMenu:''}`} aria-labelledby={titleId} onKeyDown={e=>{
    if(e.key!=='Tab')return;
    const controls=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('a[href],button,input,select,textarea,[tabindex]')).filter(node=>node.tabIndex>=0&&!node.matches(':disabled')&&node.getClientRects().length>0&&!node.closest('[inert]'));
    const first=controls[0],last=controls.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
  }} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{
    if(e.target!==e.currentTarget) return;
    const rect=e.currentTarget.getBoundingClientRect();
    if(e.clientX<rect.left || e.clientX>rect.right || e.clientY<rect.top || e.clientY>rect.bottom) onClose();
  }}>
    <div className={s.dialogHead}><h2 id={titleId}>{title}</h2><button className={s.closeButton} type="button" onClick={onClose} aria-label={closeLabel||tr(variant==='navigation'?'Close navigation':'Close dialog')}>{closeLabel||tr('Close')} ×</button></div>{open&&children}
  </dialog>;
}
