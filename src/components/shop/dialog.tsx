'use client';
import {useEffect,useRef,type ReactNode} from 'react';
import s from './shop.module.css';

/** Native dialog provides focus containment, Escape and return to the opener. */
export function Dialog({open,title,onClose,children}:{open:boolean;title:string;onClose:()=>void;children:ReactNode}) {
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const node=ref.current;if(!node)return;
    if(open){const previous=document.activeElement;node.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{node.close();document.body.style.overflow=old;if(previous instanceof HTMLElement)previous.focus();};}
    node.close();
  },[open]);
  return <dialog ref={ref} className={s.dialog} aria-label={title} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current)onClose();}}>
    <div className={s.dialogHead}><h2>{title}</h2><button className={s.closeButton} type="button" onClick={onClose} aria-label="Close dialog">Close ×</button></div>{children}
  </dialog>;
}
