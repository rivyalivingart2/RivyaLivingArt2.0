'use client';

import {useEffect,useId,useRef,useState} from 'react';
import type {PresentationFilm} from '@/lib/presentation-media';
import Image from './public-image';
import {Dialog} from './dialog';
import s from './cinematic-video.module.css';

type Connection=EventTarget&{saveData?:boolean;effectiveType?:string};
type Props={
 film:PresentationFilm;
 priority?:boolean;
 className?:string;
 controlClassName?:string;
 describedBy?:string;
 expandedPlayer?:boolean;
};

/** The poster is the default experience; only visible, eligible films fetch video. */
export function CinematicVideo({film,priority=false,className='',controlClassName='',describedBy,expandedPlayer=false}:Props){
 const root=useRef<HTMLDivElement>(null),video=useRef<HTMLVideoElement>(null),id=useId();
 const fullPlayer=useRef<HTMLVideoElement>(null);
 const intent=useRef<'auto'|'play'|'pause'>('auto'),sourcesMounted=useRef(false);
 const syncPlayback=useRef<()=>void>(()=>{}),failedFormats=useRef(new Set<string>());
 const [loadSources,setLoadSources]=useState(false),[playing,setPlaying]=useState(false);
 const [hasFrame,setHasFrame]=useState(false),[failed,setFailed]=useState(false);
 const [expanded,setExpanded]=useState(false);

 useEffect(()=>{
  const element=root.current,player=video.current;if(!element||!player)return;
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection=(navigator as Navigator&{connection?:Connection}).connection;
  let visible=false,disposed=false,autoplayBlocked=false,timer:ReturnType<typeof setTimeout>|undefined;
  const mayAutoplay=()=>!preference.matches&&!connection?.saveData&&!['slow-2g','2g'].includes(connection?.effectiveType||'');
  const sync=()=>{
   if(disposed)return;
   const wantsPlayback=intent.current==='play'||(intent.current==='auto'&&mayAutoplay()&&!autoplayBlocked);
   if(!visible||document.hidden||!wantsPlayback){player.pause();return;}
   if(!sourcesMounted.current){setLoadSources(true);return;}
   void player.play().catch(error=>{
    if(disposed||(error as DOMException).name==='AbortError')return;
    // Autoplay can be declined by the browser. Keep the still and manual Play.
    if((error as DOMException).name==='NotSupportedError')setFailed(true);
    else autoplayBlocked=true;
   });
  };
  syncPlayback.current=sync;
  const observer=new IntersectionObserver(entries=>{
   visible=entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.12);
   clearTimeout(timer);
   if(!visible){player.pause();return;}
   // Give the hero poster and primary content the first network/paint opportunity.
   timer=setTimeout(sync,priority?800:160);
  },{threshold:[0,.12]});
  const changed=()=>{clearTimeout(timer);if(document.hidden)fullPlayer.current?.pause();sync();};
  const preferenceChanged=()=>{
   // A newly enabled system/data preference also stops a previously requested film.
   // A later explicit Play remains available without restoring autoplay.
   if(!mayAutoplay()){intent.current='pause';fullPlayer.current?.pause();}
   changed();
  };
  observer.observe(element);
  preference.addEventListener('change',preferenceChanged);
  connection?.addEventListener('change',preferenceChanged);
  document.addEventListener('visibilitychange',changed);
  return()=>{
   disposed=true;clearTimeout(timer);observer.disconnect();player.pause();
   preference.removeEventListener('change',preferenceChanged);
   connection?.removeEventListener('change',preferenceChanged);
   document.removeEventListener('visibilitychange',changed);
   syncPlayback.current=()=>{};
  };
 },[priority]);

 useEffect(()=>{
  if(!loadSources||!video.current)return;
  sourcesMounted.current=true;
  video.current.load();
  syncPlayback.current();
 },[loadSources]);

 function toggle(){
  const player=video.current;if(!player)return;
  intent.current=player.paused?'play':'pause';
  syncPlayback.current();
 }
 function expand(){intent.current='pause';video.current?.pause();setExpanded(true);}

 return <><div ref={root} className={s.cinema+' '+className} data-cinematic-video={film.id} data-priority={priority||undefined} data-home-parallax data-cinematic-parallax data-playing={playing||undefined}>
  <div className={s.media} data-home-parallax-layer data-cinematic-parallax-layer>
   <Image src={film.poster.path} alt="" fill priority={priority} loading={priority?'eager':'lazy'} sizes="100vw" quality={priority?60:75} className={s.poster}/>
   <video ref={video} id={id+'-video'} className={s.video} data-ready={hasFrame&&!failed||undefined} aria-label={film.title+' — material visualization'} aria-describedby={describedBy||id+'-description'} playsInline loop muted preload="none" onPlay={()=>setPlaying(true)} onPlaying={()=>setHasFrame(true)} onPause={()=>setPlaying(false)} onError={event=>{if(event.target===event.currentTarget){setFailed(true);setPlaying(false);}}}>
    {loadSources&&film.sources.map(source=><source key={source.type} src={source.path} type={source.type} onError={()=>{failedFormats.current.add(source.type);if(failedFormats.current.size===film.sources.length)setFailed(true);}}/>)}
   </video>
  </div>
  <div className={s.control+' '+controlClassName}>
   {failed?<p role="status">Film unavailable. Still image shown.</p>:<button type="button" onClick={toggle} aria-controls={id+'-video'} aria-label={(playing?'Pause':'Play')+' film: '+film.title}>
    <span className={s.controlIcon} aria-hidden="true">{playing?'Ⅱ':'▷'}</span><span>{playing?'Pause film':'Play film'}</span>
   </button>}
   {expandedPlayer&&!failed&&<button type="button" onClick={expand} aria-haspopup="dialog">View film <span aria-hidden="true">↗</span></button>}
  </div>
  {!describedBy&&<p id={id+'-description'} className={s.accessibleDescription}>{film.description} Silent, repeating material visualization. This is not a recording of a customer commission.</p>}
 </div>{expandedPlayer&&<Dialog open={expanded} title={film.title} onClose={()=>setExpanded(false)} closeLabel="Close film"><video ref={fullPlayer} className={s.fullPlayer} controls tabIndex={0} onKeyDown={event=>{if(event.key==='Tab')event.stopPropagation();}} playsInline autoPlay muted loop preload="metadata" poster={film.poster.path} aria-label={film.title+' — material visualization'} aria-describedby={id+'-full-description'}>{film.sources.map(source=><source key={source.type} src={source.path} type={source.type}/>)}Your browser cannot play this film.</video><p id={id+'-full-description'} className={s.fullDescription}>{film.description} Silent, repeating material visualization. This is not a recording of a customer commission.</p></Dialog>}</>;
}
