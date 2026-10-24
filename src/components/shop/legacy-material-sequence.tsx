'use client';
import {useEffect,useRef,useSyncExternalStore} from 'react';
import {useMotionCapability} from '../design-foundation/motion-capability';
import {useVisualEffectsPaused} from '../design-foundation/cinematic-preference';
import s from './legacy-material-sequence.module.css';

const count=121;
const stageQuery='(min-width:1024px) and (min-height:760px)';
function subscribeStage(notify:()=>void){const query=matchMedia(stageQuery);query.addEventListener('change',notify);return()=>query.removeEventListener('change',notify);}
const stageFits=()=>matchMedia(stageQuery).matches;
const staticStage=()=>false;
const src=(index:number)=>`/legacy-reference/pour-cure/frame_${String(index).padStart(3,'0')}.webp`;
const stages=[['The pour','Deep sapphire resin, poured in one unbroken pass — the moment every piece begins.'],['The gild','Gold leaf drifts through the settling resin, catching light the way a wave catches the sun.'],['The cure','Days of patient curing hold that motion still — liquid light, kept forever.'],['The polish','From 400 grit to 3000, then compound — until the surface disappears and only the depth is left.']];
/** Source: OLDWEBSITE 2dd6d5d pour-cure-showcase. An additional material study;
 * the owner's existing image, copy and crops remain in the following section. */
export function LegacyMaterialSequence(){
 const root=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 const capable=useMotionCapability(),paused=useVisualEffectsPaused();
 const fits=useSyncExternalStore(subscribeStage,stageFits,staticStage);
 useEffect(()=>{
  const node=root.current,screen=canvas.current;
  if(!node||!screen||!capable||!fits||paused||getComputedStyle(node).display==='none')return;
  let cancelled=false,dispose:(()=>void)|undefined;
  void import('./legacy-material-runtime').then(({animateMaterialSequence})=>{if(!cancelled)dispose=animateMaterialSequence(node,screen,src,count);});
  return()=>{cancelled=true;dispose?.();};
 },[capable,fits,paused]);
 const heading=(suffix:string)=><><p className={s.eyebrow}>The signature</p><h2 id={'legacy-material-'+suffix}>From liquid to light</h2></>;
 const list=<ol>{stages.map(([title,copy],i)=><li key={title}><h3>{String(i+1).padStart(2,'0')} · {title}</h3><p>{copy}</p></li>)}</ol>;
 return <div className={s.sequence} lang="en" data-legacy-sequence data-paused={paused}>
  <noscript><style>{'[data-sequence-stage]{display:none!important}[data-sequence-static]{display:block!important}'}</style></noscript>
  <section className={s.static} data-sequence-static aria-labelledby="legacy-material-static"><div className={s.shell}>{heading('static')}<div className={s.staticGrid}><div className={s.poster} role="img" aria-label="Deep blue resin with gold leaf, a material study"/>{list}</div><p className={s.provenance}>Material study · legacy reference sequence</p></div></section>
  <section ref={root} className={s.stage} data-sequence-stage aria-labelledby="legacy-material-stage"><div className={s.sticky}><canvas ref={canvas} role="img" aria-label="Blue resin and gold leaf, from pour to polished material study"/><div className={s.scrim}/><div className={s.copy}>{heading('stage')}{list}</div></div></section>
 </div>;
}
