import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

/** Inner-page motion shares GSAP with the homepage and never hides readable SSR content. */
export function animateCinematicPages(root:HTMLElement){
 gsap.registerPlugin(ScrollTrigger);
 root.dataset.cinematicMotion='active';
 const context=gsap.context(()=>{
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(heading=>{
   if(heading.closest('[data-home-motion]')||heading.getBoundingClientRect().bottom<0)return;
   gsap.from(heading,{y:18,duration:.75,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 94%',once:true}});
  });
  root.querySelectorAll<HTMLElement>('[data-cinematic-parallax]').forEach(frame=>{
   const layer=frame.querySelector<HTMLElement>(':scope > [data-cinematic-parallax-layer]');
   if(!layer||frame.closest('[data-home-motion]'))return;
   gsap.fromTo(layer,{yPercent:-2},{yPercent:2,ease:'none',scrollTrigger:{trigger:frame,start:'clamp(top bottom)',end:'clamp(bottom top)',scrub:.5}});
  });
 },root);
 const refresh=requestAnimationFrame(()=>ScrollTrigger.refresh());
 return()=>{cancelAnimationFrame(refresh);context.revert();delete root.dataset.cinematicMotion;};
}
