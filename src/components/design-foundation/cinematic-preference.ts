'use client';

import {useSyncExternalStore} from 'react';

const key='rivya-visual-effects-paused';
let sessionPaused=false;
let sessionOverride=false;
export const VISUAL_EFFECTS_EVENT='rivya:visual-effects';
function subscribe(listener:()=>void){
 window.addEventListener(VISUAL_EFFECTS_EVENT,listener);
 window.addEventListener('storage',listener);
 return()=>{window.removeEventListener(VISUAL_EFFECTS_EVENT,listener);window.removeEventListener('storage',listener);};
}
function snapshot(){if(sessionOverride)return sessionPaused;try{const stored=localStorage.getItem(key);return stored===null?sessionPaused:stored==='true';}catch{return sessionPaused;}}
export function useVisualEffectsPaused(){return useSyncExternalStore(subscribe,snapshot,()=>false);}
export function setVisualEffectsPaused(paused:boolean){
 sessionPaused=paused;
 try{localStorage.setItem(key,String(paused));sessionOverride=false;}catch{sessionOverride=true;/* Keep the explicit preference even when an older stored value remains readable. */}
 window.dispatchEvent(new Event(VISUAL_EFFECTS_EVENT));
}
