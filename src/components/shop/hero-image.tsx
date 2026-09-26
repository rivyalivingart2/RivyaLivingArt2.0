'use client';
import {getImageProps} from 'next/image';
import {useState,type CSSProperties} from 'react';
import s from './shop.module.css';

/** One browser-selected resource: the same published piece, composed for each viewport. */
export function HeroImage({portrait,landscape,name,portraitPosition,landscapePosition}:{portrait:string;landscape:string;name:string;portraitPosition?:string;landscapePosition?:string}){
 const [failed,setFailed]=useState(false);
 const common={alt:name+' — design visualization',fill:true,sizes:'(max-width:780px) 100vw, 53vw',loading:'eager' as const,fetchPriority:'high' as const};
 const {props:mobile}=getImageProps({...common,src:portrait});
 const {props:desktop}=getImageProps({...common,src:landscape});
 if(failed)return <span className={s.heroImageFallback}>Image unavailable — explore {name} in the collection.</span>;
 return <picture>
  <source media="(max-width:780px)" srcSet={mobile.srcSet} sizes={mobile.sizes}/>
  {/* getImageProps supplies Next's optimized URLs; picture selects before requesting. */}
  <img {...desktop} alt={desktop.alt || `${name} — design visualization`} className={s.artDirectedHero} style={{...desktop.style,'--portrait-position':portraitPosition||'50% 50%','--landscape-position':landscapePosition||'50% 50%'} as CSSProperties} onError={()=>setFailed(true)}/>
 </picture>;
}
