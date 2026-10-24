'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import Image from './public-image';
import {useMotionCapability} from '../design-foundation/motion-capability';
import {useVisualEffectsPaused} from '../design-foundation/cinematic-preference';
import s from './legacy-journal-list.module.css';

export type LegacyJournalRow={id:string;href:string;title:string;description:string;category:string;readingTime:string;image?:string;imageAlt?:string;imagePosition?:string};
/** OLDWEBSITE journal-list.tsx geometry and single cursor preview. Current
 * descriptions and image focal points are retained; dates are never invented. */
export function LegacyJournalList({rows}:{rows:LegacyJournalRow[]}){
 const preview=useRef<HTMLDivElement>(null);
 const [active,setActive]=useState<string|null>(null);
 const enabled=useMotionCapability(),paused=useVisualEffectsPaused();
 const show=enabled&&!paused;
 useEffect(()=>{
  if(!show)return;
  let frame=0,x=0,y=0;
  const move=(event:PointerEvent)=>{
   x=Math.max(120,Math.min(innerWidth-120,event.clientX));y=Math.max(150,Math.min(innerHeight-150,event.clientY));
   if(!frame)frame=requestAnimationFrame(()=>{frame=0;if(preview.current)preview.current.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(-3deg)`;});
  };
  addEventListener('pointermove',move,{passive:true});
  return()=>{removeEventListener('pointermove',move);cancelAnimationFrame(frame);};
 },[show]);
 const row=show?rows.find(item=>item.id===active):undefined;
 return <><div className={s.list}>{rows.map(item=><Link href={item.href} key={item.id} className={s.row} onPointerEnter={()=>setActive(item.id)} onPointerLeave={()=>setActive(null)} onFocus={()=>setActive(null)}>
  <span className={s.meta}>{item.readingTime}</span><div><h3>{item.title}</h3><p>{item.description}</p></div><span className={s.meta}>{item.category}</span>
 </Link>)}</div><div ref={preview} className={s.preview} aria-hidden data-visible={!!row?.image}>{row?.image&&<Image src={row.image} alt="" fill sizes="230px" style={{objectFit:'cover',objectPosition:row.imagePosition}}/>}</div></>;
}
