'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {whatsappHandoff} from '@/lib/whatsapp';
import s from './shop.module.css';
export function SavedReceipt({reference,summary,requestKey,autoOpen,whatsapp}:{reference:string;summary:string;requestKey:string;autoOpen:boolean;whatsapp:string}){
 const handoff=whatsappHandoff(reference,summary,whatsapp),opened=useRef(false),[status,setStatus]=useState('');
 useEffect(()=>{
   if(!autoOpen||opened.current)return;opened.current=true;
   window.history.replaceState(null,'','/inquiry/received?key='+encodeURIComponent(requestKey));
   if(!handoff.copyRequired)window.location.assign(handoff.whatsappUrl);
 },[autoOpen,requestKey,handoff.copyRequired,handoff.whatsappUrl]);
 return <section className={s.prose}><span className={s.eyebrow}>Inquiry saved · {reference}</span><h1>Your piece begins here.</h1><p>Your brief is saved in our Studio. Continue the conversation in WhatsApp and press Send there. Your order, quotation and delivery still need to be agreed with the atelier.</p>
 {handoff.copyRequired&&<p className={s.success}>Your brief is too long for a reliable WhatsApp link. Copy the complete summary first, open the short reference message, then paste the full summary into the conversation. The short link contains your inquiry reference only.</p>}
 <div className={s.actions}><button className={s.button} onClick={()=>void navigator.clipboard.writeText(summary).then(()=>setStatus('Complete summary copied.')).catch(()=>setStatus('Copy was unavailable. Select the summary below and copy it manually.'))}>Copy complete summary</button><a className={s.button+' '+s.outline} href={handoff.whatsappUrl} rel="noreferrer">Open WhatsApp ↗</a></div><p role="status">{status}</p>
 <details open><summary>Your saved brief</summary><pre className={s.receiptSummary}>{summary}</pre></details><p className={s.help}>This private receipt is available in this browser for up to 24 hours. Reopening WhatsApp does not create another inquiry.</p><Link className={s.textLink} href="/collectible-design">Return to the collection</Link></section>;
}
