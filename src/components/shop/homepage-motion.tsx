'use client';

import {useEffect,useRef,type ReactNode} from 'react';
import {MOTION_QUERY} from '../design-foundation/motion-capability';
import {useVisualEffectsPaused} from '../design-foundation/cinematic-preference';

/** Content is server rendered. Animation loads only after paint on eligible devices. */
export function HomepageMotion({children}:{children:ReactNode}) {
 const root=useRef<HTMLDivElement>(null);
 const paused=useVisualEffectsPaused();
 useEffect(()=>{
  const node=root.current;if(!node)return;
  const query=matchMedia(MOTION_QUERY);
  const connection=(navigator as Navigator&{connection?:EventTarget&{saveData?:boolean;effectiveType?:string}}).connection;
  const modestDevice=navigator.hardwareConcurrency>0&&navigator.hardwareConcurrency<=4;
  const eligible=()=>!paused&&!modestDevice&&query.matches&&!connection?.saveData&&!['slow-2g','2g'].includes(connection?.effectiveType||'');
  let disposed=false,version=0,cleanup:(()=>void)|undefined;
  const enable=async()=>{
   const current=++version;cleanup?.();cleanup=undefined;
   if(!eligible())return;
   try {
    const {animateHomepage}=await import('./homepage-motion-runtime');
    if(!disposed&&current===version&&eligible())cleanup=animateHomepage(node);
   } catch {
    // Optional enhancement: a failed chunk leaves the readable static page intact.
   }
  };
  const timer=window.setTimeout(()=>void enable(),600);
  query.addEventListener('change',enable);
  connection?.addEventListener('change',enable);
  return()=>{disposed=true;version++;clearTimeout(timer);query.removeEventListener('change',enable);connection?.removeEventListener('change',enable);cleanup?.();};
 },[paused]);
 return <div ref={root} data-home-motion="static">{children}</div>;
}
