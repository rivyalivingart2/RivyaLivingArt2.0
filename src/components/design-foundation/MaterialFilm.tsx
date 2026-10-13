'use client';

import {useEffect,useRef,useState} from 'react';
import {Button} from './primitives';

export function MaterialFilm({poster,mp4,webm,description}:{poster:string;mp4:string;webm?:string;description:string}) {
  const video=useRef<HTMLVideoElement>(null);
  const [playing,setPlaying]=useState(false),[error,setError]=useState('');
  useEffect(()=>{
    const el=video.current;
    if(!el)return;
    const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting)el.pause();},{threshold:0});
    const onHidden=()=>{if(document.hidden)el.pause();};
    observer.observe(el);document.addEventListener('visibilitychange',onHidden);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',onHidden);el.pause();};
  },[]);
  async function toggle(){
    const el=video.current;if(!el)return;
    if(!el.paused){el.pause();return;}
    setError('');
    try{if(el.readyState===0)el.load();await el.play();}catch{setError('The film could not start. Try Play film again, or use the still image.');}
  }
  return <figure className="rv-film"><div className="rv-film-frame"><video ref={video} poster={poster} controls muted loop playsInline preload="none" aria-label={description} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>{setPlaying(false);setError('The film is unavailable. The still image and description remain available.');}}>
    <source src={mp4} type="video/mp4"/>{webm&&<source src={webm} type="video/webm"/>}
    Your browser cannot play this film. {description}
  </video></div><figcaption><span>{description}</span><Button variant="secondary" onClick={toggle} aria-label={playing?'Pause film':'Play film'}>{playing?'Pause film':'Play film'}</Button></figcaption><p role="status" className="rv-film-status">{error}</p></figure>;
}
