'use client';
import {useEffect,useRef,useState} from 'react';
export function SavedPreviewFrame({href,revision,marker}:{href:string;revision:number;marker?:'data-presentation-revision'}){
 const frame=useRef<HTMLIFrameElement>(null);
 const [attempt,setAttempt]=useState(0),[status,setStatus]=useState<'loading'|'ready'|'failed'>('loading');
 useEffect(()=>{const timer=setTimeout(()=>setStatus(value=>value==='loading'?'failed':value),15000);return()=>clearTimeout(timer);},[attempt]);
 return <>
  <div style={{maxWidth:390,margin:'0 auto 16px',padding:16}} aria-live="polite">
   {status==='loading'?'Loading the saved revision…':status==='failed'?<>
    <p>Preview could not load this revision. Your draft is unchanged.</p>
    <a href={href.replace('/frame','')} target="_blank" rel="noreferrer">Open full preview or renew sign-in</a><br/>
    <button type="button" onClick={()=>{setStatus('loading');setAttempt(v=>v+1);}}>Retry preview</button>
   </>:<span>Mobile preview · revision {revision}</span>}
  </div>
  <iframe ref={frame} key={attempt} title={'Page revision '+revision+' at mobile width'} src={href} onLoad={()=>{
   try{
    const content=frame.current?.contentDocument;
    setStatus(content?.querySelector(marker?`[${marker}="${revision}"]`:`[data-home-revision="${revision}"], [data-saved-content-revision="${revision}"]`)?'ready':'failed');
   }catch{setStatus('failed');}
  }}/>
 </>;
}
