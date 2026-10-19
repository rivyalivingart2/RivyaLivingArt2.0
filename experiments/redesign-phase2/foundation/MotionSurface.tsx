'use client';

import {useEffect,useLayoutEffect,useRef,type ReactNode} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {MOTION_QUERY} from './motion-capability';

const useMotionEffect=typeof window==='undefined'?useEffect:useLayoutEffect;

/** Archived Phase 2 presentation boundary. Studio stays on native scrolling.
 * Native smooth anchors preserve focus, browser history and pointer targeting;
 * only image transforms are scroll-linked. Content is visible before JavaScript.
 */
export function MotionSurface({children,enabled=true,smooth=false,paused=false}:{children:ReactNode;enabled?:boolean;smooth?:boolean;paused?:boolean}) {
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const html=document.documentElement,prior=html.style.scrollBehavior;
    const query=matchMedia(MOTION_QUERY);
    const apply=()=>{html.style.scrollBehavior=enabled&&smooth&&!paused&&query.matches?'smooth':prior;};
    apply();query.addEventListener('change',apply);
    return()=>{query.removeEventListener('change',apply);html.style.scrollBehavior=prior;};
  },[enabled,smooth,paused]);
  useMotionEffect(()=>{
    if(!enabled||!root.current)return;
    gsap.registerPlugin(ScrollTrigger);
    const media=gsap.matchMedia();
    media.add(MOTION_QUERY,()=>{
      const container=root.current!;
      container.dataset.motion='active';
      if(!paused){
        container.querySelectorAll<HTMLElement>('[data-rv-parallax]').forEach(frame=>{
          const picture=frame.querySelector('picture');if(!picture)return;
          gsap.fromTo(picture,{yPercent:-3},{yPercent:3,ease:'none',scrollTrigger:{trigger:frame,start:'top bottom',end:'bottom top',scrub:true}});
        });
        container.querySelectorAll<HTMLElement>('[data-rv-reveal]').forEach(el=>{
          // No opacity change: headings remain readable throughout.
          gsap.from(el,{y:28,duration:.85,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}});
        });
      }
      const refresh=requestAnimationFrame(()=>ScrollTrigger.refresh());
      return()=>{cancelAnimationFrame(refresh);delete container.dataset.motion;};
    });
    // matchMedia owns the animations/triggers and reverts their inline styles.
    // Keep the historical specimen runnable with the retained core GSAP package.
    return()=>media.revert();
  },[enabled,smooth,paused]);
  return <div ref={root} className="rv-motion-content">{children}</div>;
}
