import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

/** Scoped cleanup also restores native anchor behavior on route exit. */
export function animateHomepage(root:HTMLElement) {
 gsap.registerPlugin(ScrollTrigger);
 const html=document.documentElement,previous=html.style.scrollBehavior;
 html.style.scrollBehavior='smooth';root.dataset.homeMotion='active';
 const context=gsap.context(()=>{
  root.querySelectorAll<HTMLElement>('[data-home-parallax]').forEach(frame=>{
   // Keep copy, captions and controls stationary; only the oversized media moves.
   const media=frame.querySelector<HTMLElement>(':scope > [data-home-parallax-layer]')||frame.firstElementChild;
   if(!media)return;
   gsap.fromTo(media,{yPercent:-3},{yPercent:3,ease:'none',scrollTrigger:{trigger:frame,start:'clamp(top bottom)',end:'clamp(bottom top)',scrub:.45}});
  });
  const heroHeading=root.querySelector('h1');
  if(heroHeading&&heroHeading.getBoundingClientRect().bottom>0){
   gsap.from(heroHeading,{y:24,duration:.95,ease:'power3.out'});
   const actions=heroHeading.parentElement?.querySelectorAll('a');
   if(actions?.length)gsap.from(actions,{y:14,duration:.8,stagger:.08,ease:'power3.out'});
  }
  // Server-rendered content never depends on an opacity-zero reveal to be read.
  root.querySelectorAll<HTMLElement>('[data-home-reveal],[data-home-chapter] h2,[data-material-film] h2,[data-band] h2').forEach(heading=>{
   if(heading.getBoundingClientRect().bottom<0)return;
   gsap.from(heading,{y:24,duration:.8,ease:'power3.out',scrollTrigger:{trigger:heading,start:'top 92%',once:true}});
  });
 },root);
 const refresh=requestAnimationFrame(()=>ScrollTrigger.refresh());
 return()=>{cancelAnimationFrame(refresh);context.revert();html.style.scrollBehavior=previous;root.dataset.homeMotion='static';};
}
