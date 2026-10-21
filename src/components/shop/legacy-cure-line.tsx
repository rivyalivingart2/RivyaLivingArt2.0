'use client';

import {useEffect,useRef,useState} from 'react';
import s from './legacy-cure-line.module.css';

/** Adapted from OLDWEBSITE 2dd6d5d/storefront/cure-line.tsx.
 * Measured section offsets, not equal divisions. Only the active tick uses React state. */
export function LegacyCureLine({marks,label}:{marks:{id:string;label:string}[];label:string}){
 const rail=useRef<HTMLElement>(null),bar=useRef<HTMLSpanElement>(null);
 const [active,setActive]=useState(0);
 const ids=marks.map(mark=>mark.id).join('|');
 useEffect(()=>{
  const nodes=ids.split('|').map(id=>document.getElementById(id));
  const nav=rail.current;if(!nav||!nodes.length)return;
  let frame=0;
  const paint=()=>{
   frame=0;
   const max=Math.max(0,document.documentElement.scrollHeight-innerHeight);
   const progress=max?Math.min(1,Math.max(0,scrollY/max)):0;
   nav.style.setProperty('--cure-progress',String(progress));
   bar.current?.style.setProperty('transform',`scaleX(${progress})`);
   let current=0;
   nodes.forEach((node,i)=>{
    if(node&&node.getBoundingClientRect().top<=innerHeight*.4)current=i;
    const top=node?node.getBoundingClientRect().top+scrollY:0;
    (nav.querySelectorAll<HTMLElement>('li')[i])?.style.setProperty('top',`${max?Math.min(1,Math.max(0,top/max))*100:0}%`);
   });
   setActive(current);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint);};
  const observer=new ResizeObserver(schedule);observer.observe(document.body);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});schedule();
  return()=>{observer.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',schedule);cancelAnimationFrame(frame);};
 },[ids]);
 if(!marks.length)return null;
 return <>
  <nav ref={rail} className={s.rail} aria-label={label} data-legacy-cure-line>
   <span className={s.line} aria-hidden/><span className={s.fill} aria-hidden/>
   <ol>{marks.map((mark,i)=><li key={mark.id}><a href={'#'+mark.id} aria-label={`${String(i+1).padStart(2,'0')} · ${mark.label}`} aria-current={i===active?'location':undefined}>
    <span className={s.tick} aria-hidden data-passed={i<=active}/><span className={s.index} aria-hidden>{String(i+1).padStart(2,'0')}</span><span className={s.label} aria-hidden>{String(i+1).padStart(2,'0')} · {mark.label}</span>
   </a></li>)}</ol>
  </nav>
  <div className={s.mobile} aria-hidden><span ref={bar}/></div>
 </>;
}
