import gsap from 'gsap';

/** Adapted from OLDWEBSITE meniscus-image / featured-rail at 2dd6d5d.
 * Called only inside the existing motion, connection and effects-pause guards. */
export function animateLegacyHome(root:HTMLElement){
 const cleanups:(()=>void)[]=[];
 const media=gsap.matchMedia();
 media.add('(min-width:1024px) and (min-height:600px)',()=>{
  const listeners:(()=>void)[]=[];
  root.querySelectorAll<HTMLElement>('[data-legacy-featured-rail]').forEach(rail=>{
   const viewport=rail.querySelector<HTMLElement>('[data-rail-viewport]');
   if(!viewport||rail.getBoundingClientRect().height>innerHeight-112)return;
   const distance=()=>Math.max(0,viewport.scrollWidth-viewport.clientWidth);
   if(distance()<32)return;
   rail.dataset.railEnhanced='true';
   const tween=gsap.to(viewport,{scrollLeft:distance,ease:'none',scrollTrigger:{trigger:rail,start:'top 96px',end:()=>'+='+distance(),pin:true,scrub:1,anticipatePin:1,invalidateOnRefresh:true}});
   // Native focus scrolling must win over scrubbing: keyboard users can visit
   // every card even while the mouse-driven rail is pinned mid-page.
   const release=()=>{tween.scrollTrigger?.kill();tween.kill();rail.dataset.railEnhanced='false';};
   rail.addEventListener('focusin',release);
   listeners.push(()=>{rail.removeEventListener('focusin',release);delete rail.dataset.railEnhanced;});
  });
  return()=>listeners.forEach(cleanup=>cleanup());
 });
 root.querySelectorAll<HTMLElement>('[data-legacy-meniscus]').forEach(wrapper=>{
  const frame=wrapper.querySelector<HTMLElement>(':scope > [data-meniscus-image]');
  const line=wrapper.querySelector<HTMLElement>(':scope > [data-meniscus-line]');
  const rect=wrapper.getBoundingClientRect();
  if(!frame||rect.top<innerHeight)return; // never wipe an already painted image
  const original=frame.getAttribute('style'),lineOriginal=line?.getAttribute('style');
  frame.style.maskImage='linear-gradient(#000,#000)';frame.style.maskPosition='bottom';frame.style.maskRepeat='no-repeat';frame.style.maskSize='100% 0%';frame.style.transformOrigin='bottom';frame.style.transform='scaleY(1.015)';
  frame.style.transition='mask-size 900ms cubic-bezier(.16,1,.3,1), transform 900ms cubic-bezier(.16,1,.3,1)';
  if(line){line.style.bottom='0%';line.style.opacity='.8';line.style.transition='bottom 900ms cubic-bezier(.16,1,.3,1), opacity 900ms linear';}
  const open=()=>{
   frame.style.maskSize='100% 100%';frame.style.transform='scaleY(1)';
   if(line){line.style.bottom='100%';line.style.opacity='0';}
  };
  const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting||entry.boundingClientRect.bottom<0){open();observer.disconnect();}},{rootMargin:'0px 0px -12% 0px'});
  observer.observe(wrapper);
  // A focused link can arrive before intersection delivery; make its picture
  // visible immediately rather than leaving a keyboard user on a closed mask.
  const focus=()=>{open();observer.disconnect();};wrapper.addEventListener('focusin',focus);
  cleanups.push(()=>{observer.disconnect();wrapper.removeEventListener('focusin',focus);if(original===null)frame.removeAttribute('style');else frame.setAttribute('style',original);if(line){if(lineOriginal==null)line.removeAttribute('style');else line.setAttribute('style',lineOriginal);}});
 });
 return()=>{media.revert();cleanups.forEach(cleanup=>cleanup());};
}
