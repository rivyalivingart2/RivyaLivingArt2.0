'use client';

import {useSyncExternalStore} from 'react';

export const MOTION_QUERY='(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
function subscribe(notify:()=>void){
  const query=window.matchMedia(MOTION_QUERY);
  query.addEventListener('change',notify);
  return()=>query.removeEventListener('change',notify);
}
const current=()=>window.matchMedia(MOTION_QUERY).matches;
const server=()=>false;

/** Effective capability, independent of the visitor's saved/local preference. */
export function useMotionCapability(){return useSyncExternalStore(subscribe,current,server);}
