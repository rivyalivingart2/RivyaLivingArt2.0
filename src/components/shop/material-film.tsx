'use client';
import {useEffect,useId,useRef,useState} from 'react';
import Image from './public-image';
import type {PresentationFilm} from '@/lib/presentation-media';
import s from './material-film.module.css';

/** Playback is always deliberate: no motion or video download before Play. */
export function MaterialFilm({film}:{film:PresentationFilm}){
 const video=useRef<HTMLVideoElement>(null),failedFormats=useRef(new Set<string>()),id=useId();
 const [playing,setPlaying]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{
  const player=video.current;if(!player)return;
  const observer=new IntersectionObserver(entries=>{if(!entries[0]?.isIntersecting)player.pause();},{threshold:0});
  const visibility=()=>{if(document.hidden)player.pause();};
  observer.observe(player);document.addEventListener('visibilitychange',visibility);
  return()=>{observer.disconnect();document.removeEventListener('visibilitychange',visibility);};
 },[]);
 async function toggle(){if(!video.current)return;if(!video.current.paused){video.current.pause();return;}try{await video.current.play();}catch(error){if((error as DOMException).name!=='AbortError')setFailed(true);}}
 return <figure className={s.film} data-material-film={film.id}>
  <div className={s.intro}><div><p>Material visualization</p><h2 id={id}>{film.title}</h2><p>{film.description}</p></div>{!failed&&<button type="button" onClick={()=>void toggle()} aria-controls={id+'-video'}>{playing?'Pause film':'Play film'} <span aria-hidden>{playing?'Ⅱ':'▷'}</span></button>}</div>
  <div className={s.frame}>{failed?<Image src={film.poster.path} alt={film.description} fill sizes="100vw" style={{objectFit:'cover'}}/>:<video ref={video} id={id+'-video'} aria-labelledby={id} aria-describedby={id+'-description'} controls playsInline loop muted preload="none" poster={film.poster.path} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={event=>{if(event.target===event.currentTarget)setFailed(true);}}>{film.sources.map(source=><source key={source.type} src={source.path} type={source.type} onError={()=>{failedFormats.current.add(source.type);if(failedFormats.current.size===film.sources.length)setFailed(true);}}/>)}Your browser cannot play this film.</video>}</div>
  <figcaption id={id+'-description'}>Silent, eight-second material visualization: a ribbon of deep blue resin with gold-toned streaks pours into a pool against a dark background. The sequence repeats. This is not a recording of a customer commission.{failed?' Film unavailable. The still image is shown.':''}</figcaption>
 </figure>;
}
