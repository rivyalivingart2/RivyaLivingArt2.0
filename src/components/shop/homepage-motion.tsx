'use client';

import {useEffect,useRef,type ReactNode} from 'react';
import {MOTION_QUERY} from '../design-foundation/motion-capability';

/** Content is server rendered. Animation loads only after paint on eligible devices. */
export function HomepageMotion({children}:{children:ReactNode}) {
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const node=root.current;if(!node)return;
  const query=matchMedia(MOTION_QUERY);
  let disposed=false,version=0,cleanup:(()=>void)|undefined;
  const enable=async()=>{
   const current=++version;cleanup?.();cleanup=undefined;
   if(!query.matches)return;
   try {
    const {animateHomepage}=await import('./homepage-motion-runtime');
    if(!disposed&&current===version&&query.matches)cleanup=animateHomepage(node);
   } catch {
    // Optional enhancement: a failed chunk leaves the readable static page intact.
   }
  };
  const timer=window.setTimeout(()=>void enable(),600);
  query.addEventListener('change',enable);
  return()=>{disposed=true;version++;clearTimeout(timer);query.removeEventListener('change',enable);cleanup?.();};
 },[]);
 return <div ref={root} data-home-motion="static">{children}</div>;
}
