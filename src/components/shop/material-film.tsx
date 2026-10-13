'use client';
import {useEffect,useId,useRef,useState} from 'react';
import Image from './public-image';
import type {PresentationFilm} from '@/lib/presentation-media';
import s from './material-film.module.css';

/** Playback is always deliberate: no motion or video download before Play. */
export function MaterialFilm({film}:{film:PresentationFilm}){
 const video=useRef<HTMLVideoElement>(null),failedFormats=useRef(new Set<string>()),id=useId();
 const [playing,setPlaying]=useState(false),[failed,setFailed]=useState(false),[posterReady,setPosterReady]=useState(false);
 useEffect(()=>{
  const player=video.current;if(!player)return;
  const observer=new IntersectionObserver(entries=>{if(!entries[0]?.isIntersecting)player.pause();},{threshold:0});
  // preload="none" defers video bytes, but not an eager poster request.
  // Keep the original still and reserve the frame while loading it near the film.
  const posterObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){setPosterReady(true);posterObserver.disconnect();}},{rootMargin:'800px 0px'});
  const visibility=()=>{if(document.hidden)player.pause();};
  observer.observe(player);posterObserver.observe(player);document.addEventListener('visibilitychange',visibility);
  return()=>{observer.disconnect();posterObserver.disconnect();document.removeEventListener('visibilitychange',visibility);};
 },[]);
 async function toggle(){if(!video.current)return;if(!video.current.paused){video.current.pause();return;}setPosterReady(true);try{await video.current.play();}catch(error){if((error as DOMException).name!=='AbortError')setFailed(true);}}
 return <figure className={s.film} data-material-film={film.id}>
  <div className={s.intro}><div><p>Material visualization</p><h2 id={id}>{film.title}</h2><p>{film.description}</p></div>{!failed&&<button type="button" onClick={()=>void toggle()} aria-controls={id+'-video'}>{playing?'Pause film':'Play film'} <span aria-hidden>{playing?'Ⅱ':'▷'}</span></button>}</div>
  <div className={s.frame}>{failed?<Image src={film.poster.path} alt={film.description} fill sizes="100vw" style={{objectFit:'cover'}}/>:<video ref={video} id={id+'-video'} aria-labelledby={id} aria-describedby={id+'-description'} controls playsInline loop muted preload="none" poster={posterReady?film.poster.path:undefined} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={event=>{if(event.target===event.currentTarget)setFailed(true);}}>{film.sources.map(source=><source key={source.type} src={source.path} type={source.type} onError={()=>{failedFormats.current.add(source.type);if(failedFormats.current.size===film.sources.length)setFailed(true);}}/>)}Your browser cannot play this film.</video>}</div>
  {/* The print-only source avoids an eager screen download and works before scrolling. */}
  <picture className={s.printStill}><source media="print" srcSet={film.poster.path}/>
   <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" width={1920} height={1080} alt={film.description}/>
  </picture>
  <figcaption id={id+'-description'}>Silent, eight-second material visualization: a ribbon of deep blue resin with gold-toned streaks pours into a pool against a dark background. The sequence repeats. This is not a recording of a customer commission.{failed?' Film unavailable. The still image is shown.':''}</figcaption>
 </figure>;
}
