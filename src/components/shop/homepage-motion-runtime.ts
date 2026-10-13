import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

/** Scoped cleanup also restores native anchor behavior on route exit. */
export function animateHomepage(root:HTMLElement) {
 gsap.registerPlugin(ScrollTrigger);
 const html=document.documentElement,previous=html.style.scrollBehavior;
 html.style.scrollBehavior='smooth';root.dataset.homeMotion='active';
 const context=gsap.context(()=>{
  root.querySelectorAll<HTMLElement>('[data-home-parallax]').forEach(frame=>{
   const image=frame.firstElementChild;
   if(!image)return;
   gsap.fromTo(image,{yPercent:-3},{yPercent:3,ease:'none',scrollTrigger:{trigger:frame,start:'top bottom',end:'bottom top',scrub:true}});
  });
  // Two moments establish rhythm; long-form copy and controls stay still.
  root.querySelectorAll<HTMLElement>('[data-home-chapter="selected"] h2,[data-home-chapter="story"] h2').forEach(heading=>{
   gsap.from(heading,{y:28,duration:.85,ease:'expo.out',scrollTrigger:{trigger:heading,start:'top 90%',once:true}});
  });
 },root);
 const refresh=requestAnimationFrame(()=>ScrollTrigger.refresh());
 return()=>{cancelAnimationFrame(refresh);context.revert();html.style.scrollBehavior=previous;root.dataset.homeMotion='static';};
}
