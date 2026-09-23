'use client';
import {useState} from 'react';
import Link from 'next/link';
import s from './workspace.module.css';
export function ReferenceViewer({id,inquiryId,reference}:{id:string;inquiryId:string;reference:string}){
 const [attempt,setAttempt]=useState(0),[failed,setFailed]=useState(false),[loaded,setLoaded]=useState(false);
 return <main id="main-content" className={s.referencePage}><p>RivyaLivingArt / Private reference</p><h1>{reference}</h1><p>This image is available only to staff authorized for its inquiry.</p><div className={s.actions}><Link href={'/studio/inquiries?record='+inquiryId}>Return to inquiry</Link><a href="/studio/login" target="_blank" rel="noreferrer">Renew sign-in ↗</a><button onClick={()=>{setFailed(false);setLoaded(false);setAttempt(v=>v+1);}}>Reload image</button></div>{failed?<p role="alert">The image could not be loaded. Your session or assignment may have changed. Sign in again, then reload.</p>:<>{!loaded&&<p role="status">Loading private image…</p>}{/* Private references must bypass public image optimization and caching. */}{/* eslint-disable-next-line @next/next/no-img-element */}<img key={attempt} src={'/api/studio/references/'+id+'?retry='+attempt} alt={'Private customer reference for '+reference} onLoad={()=>setLoaded(true)} onError={()=>setFailed(true)}/></>}</main>;
}
