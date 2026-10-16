'use client';

import {createContext,useContext,useEffect,useRef,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {setVisualEffectsPaused,useVisualEffectsPaused} from './cinematic-preference';
import s from './cinematic-canvas.module.css';

type Mode='public'|'studio'|'access';
type Connection=EventTarget&{saveData?:boolean;effectiveType?:string};
type DeviceNavigator=Navigator&{connection?:Connection;deviceMemory?:number};
const CanvasContext=createContext(false);
const pointerQuery='(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/** One enhancement boundary per page, including saved public previews nested in Studio. */
export function CinematicCanvas({children,mode='public'}:{children:ReactNode;mode?:Mode}){
 const nested=useContext(CanvasContext);
 return nested?<>{children}</>:<CanvasRoot mode={mode}>{children}</CanvasRoot>;
}

function CanvasRoot({children,mode}:{children:ReactNode;mode:Mode}){
 const root=useRef<HTMLDivElement>(null),spot=useRef<HTMLDivElement>(null);
 const paused=useVisualEffectsPaused(),pathname=usePathname();
 useEffect(()=>{
  const node=root.current,light=spot.current;if(!node||!light)return;
  const capability=matchMedia(pointerQuery),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const device=navigator as DeviceNavigator,connection=device.connection;
  const modestDevice=(device.deviceMemory!==undefined&&device.deviceMemory<=4)||(device.hardwareConcurrency>0&&device.hardwareConcurrency<=4);
  let disposed=false,visible=true,active=false,frame=0,timer=0,resizeTimer=0,version=0;
  let x=innerWidth*.7,y=innerHeight*.4,targetX=x,targetY=y,lastTime=0;
  let card:HTMLElement|null=null,cardBounds:DOMRect|null=null;
  let motionCleanup:(()=>void)|undefined;
  const cleanupMotion=()=>{version++;window.clearTimeout(timer);motionCleanup?.();motionCleanup=undefined;};
  const cancel=()=>{if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;};
  const forgetCard=()=>{card?.removeAttribute('data-lighting-active');card?.style.removeProperty('--card-light-x');card?.style.removeProperty('--card-light-y');card=null;cardBounds=null;};
  const paint=(time:number)=>{
   frame=0;if(!active||disposed)return;
   const delta=lastTime?Math.min(50,time-lastTime):16;lastTime=time;
   const amount=1-Math.exp(-delta/115);
   x+=(targetX-x)*amount;y+=(targetY-y)*amount;
   light.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0)`;
   if(card&&cardBounds){card.style.setProperty('--card-light-x',`${(x-cardBounds.left).toFixed(2)}px`);card.style.setProperty('--card-light-y',`${(y-cardBounds.top).toFixed(2)}px`);}
   if(Math.abs(targetX-x)+Math.abs(targetY-y)>.2)frame=requestAnimationFrame(paint);else lastTime=0;
  };
  const schedule=()=>{if(active&&!frame)frame=requestAnimationFrame(paint);};
  const update=()=>{
   cancel();cleanupMotion();forgetCard();
   const restricted=!!connection?.saveData||['slow-2g','2g'].includes(connection?.effectiveType||'')||modestDevice;
   active=!paused&&capability.matches&&!restricted&&!document.hidden&&visible;
   node.dataset.cinemaState=paused?'paused':document.hidden||!visible?'hidden':reduced.matches?'reduced-motion':restricted?'low-power':!capability.matches?'touch':'active';
   if(!active)return;
   schedule();
   // Public content is already visible. Load scroll enhancement after its first paint.
   if(mode==='public'&&innerWidth>=900){
    const current=version;
    timer=window.setTimeout(()=>{void import('./cinematic-motion-runtime').then(module=>{
     if(!disposed&&active&&current===version)motionCleanup=module.animateCinematicPages(node);
    }).catch(()=>{/* A failed optional chunk leaves static content readable. */});},500);
   }
  };
  const pointer=(event:PointerEvent)=>{
   if(!active||event.pointerType!=='mouse')return;
   targetX=event.clientX;targetY=event.clientY;
   const target=event.target instanceof Element?event.target:null;
   const next=target?.closest<HTMLElement>('[data-lighting-card]')||null;
   if(next!==card){forgetCard();card=next;if(card){cardBounds=card.getBoundingClientRect();card.dataset.lightingActive='true';}}
   const tone=target?.closest<HTMLElement>('[data-atmosphere]')?.dataset.atmosphere||'story';
   node.dataset.lightTone=tone;
   // Photography and input fields keep their accurate colours and clear focus treatment.
   node.dataset.lightQuiet=String(!!target?.closest('img,video,input,textarea,select,[data-lighting-card="product"],dialog'));
   schedule();
  };
  const leave=()=>{forgetCard();node.dataset.lightQuiet='false';targetX=innerWidth*.7;targetY=innerHeight*.4;schedule();};
  const scroll=()=>{forgetCard();};
  const resize=()=>{window.clearTimeout(resizeTimer);resizeTimer=window.setTimeout(update,180);};
  const focus=()=>{node.dataset.lightFocus=String(!!node.querySelector('input:focus,textarea:focus,select:focus,dialog[open]'));};
  const observer=new IntersectionObserver(([entry])=>{const next=entry.isIntersecting;if(next!==visible){visible=next;update();}});
  observer.observe(node);node.addEventListener('pointermove',pointer,{passive:true});node.addEventListener('pointerleave',leave);
  node.addEventListener('focusin',focus);node.addEventListener('focusout',focus);
  window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',resize,{passive:true});
  capability.addEventListener('change',update);reduced.addEventListener('change',update);connection?.addEventListener('change',update);
  document.addEventListener('visibilitychange',update);update();
  return()=>{disposed=true;active=false;cancel();cleanupMotion();window.clearTimeout(resizeTimer);forgetCard();observer.disconnect();node.removeEventListener('pointermove',pointer);node.removeEventListener('pointerleave',leave);node.removeEventListener('focusin',focus);node.removeEventListener('focusout',focus);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',resize);capability.removeEventListener('change',update);reduced.removeEventListener('change',update);connection?.removeEventListener('change',update);document.removeEventListener('visibilitychange',update);};
 },[mode,pathname,paused]);
 return <CanvasContext.Provider value={true}><div ref={root} className={s.canvas} data-cinematic-canvas={mode} data-cinema-state="static" data-visual-effects={paused?'paused':'enabled'}>
  {children}
  <div className={s.lighting} aria-hidden="true"><div className={s.ambient}/><div ref={spot} className={s.spotlight}><div className={s.glow}/></div></div>
 </div></CanvasContext.Provider>;
}

/** A durable opt-out for decorative lighting and scroll effects; film has its own controls. */
export function VisualEffectsControl(){
 const within=useContext(CanvasContext),paused=useVisualEffectsPaused();
 if(!within)return null;
 return <button type="button" className={s.control} aria-pressed={paused} aria-label="Pause decorative visual effects" onClick={()=>setVisualEffectsPaused(!paused)}><span aria-hidden="true">{paused?'○':'◐'}</span>{paused?'Effects paused':'Pause effects'}</button>;
}
