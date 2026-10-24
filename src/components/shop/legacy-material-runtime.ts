import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

/** Source sequence algorithm: coarse coverage first, nearest loaded frame,
 * CSS sticky stage, scrub .5, four readable stages, and complete cleanup. */
export function animateMaterialSequence(root:HTMLElement,canvas:HTMLCanvasElement,src:(n:number)=>string,count:number){
 gsap.registerPlugin(ScrollTrigger);
 const context=canvas.getContext('2d');if(!context)return()=>{};
 const frames:(HTMLImageElement|null)[]=Array(count).fill(null);
 const state={frame:0};let cancelled=false,drawn=-1,started=false;
 const draw=(target:number,force=false)=>{
  let nearest=-1;for(let offset=0;offset<count;offset++){if(frames[target-offset]){nearest=target-offset;break;}if(frames[target+offset]){nearest=target+offset;break;}}
  const picture=frames[nearest];if(!picture||nearest===drawn&&!force)return;drawn=nearest;
  const scale=Math.max(canvas.width/picture.naturalWidth,canvas.height/picture.naturalHeight),w=picture.naturalWidth*scale,h=picture.naturalHeight*scale;
  context.clearRect(0,0,canvas.width,canvas.height);context.drawImage(picture,(canvas.width-w)/2,(canvas.height-h)/2,w,h);root.dataset.frame=String(nearest);
 };
 const load=async(i:number)=>{if(cancelled||frames[i])return;const picture=new Image();picture.decoding='async';picture.src=src(i);try{await picture.decode();if(!cancelled){frames[i]=picture;draw(Math.round(state.frame));}}catch{/* Poster and nearest good frame preserve the study on a missing frame. */}};
 const start=()=>{if(cancelled||started)return;started=true;root.dataset.sequenceLoading='true';const coarse=[];for(let i=0;i<count;i+=8)coarse.push(load(i));void Promise.allSettled(coarse).then(async()=>{for(let i=0;i<count&&!cancelled;i+=6)await Promise.allSettled(Array.from({length:Math.min(6,count-i)},(_,j)=>load(i+j)));if(!cancelled){root.dataset.sequenceLoaded=String(frames.filter(Boolean).length);delete root.dataset.sequenceLoading;}});};
 const resize=()=>{const b=canvas.parentElement!.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(b.width*dpr);canvas.height=Math.round(b.height*dpr);draw(Math.round(state.frame),true);};
 const observer=new ResizeObserver(resize);observer.observe(canvas.parentElement!);resize();
 const blocks=[...root.querySelectorAll<HTMLElement>('li')];
 const ctx=gsap.context(()=>{
  const fades=blocks.map(block=>gsap.quickTo(block,'opacity',{duration:.25,ease:'power2.out'}));
  gsap.to(state,{frame:count-1,ease:'none',onUpdate:()=>draw(Math.round(state.frame)),scrollTrigger:{trigger:root,start:'top top',end:'bottom bottom',scrub:.5,onUpdate:self=>{const active=Math.min(blocks.length-1,Math.floor(self.progress*blocks.length));blocks.forEach((block,i)=>{fades[i](i===active?1:.3);block.toggleAttribute('data-active',i===active);});}}});
  ScrollTrigger.create({trigger:root,start:'top 250%',once:true,onEnter:start});
 },root);
 if(root.getBoundingClientRect().top<innerHeight*2.5)start();
 return()=>{cancelled=true;observer.disconnect();ctx.revert();frames.fill(null);delete root.dataset.frame;delete root.dataset.sequenceLoaded;delete root.dataset.sequenceLoading;blocks.forEach(b=>b.removeAttribute('data-active'));};
}
