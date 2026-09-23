'use client';
import {useEffect,useRef,useState} from 'react';
import type {OrderReceipt} from '@/lib/order-receipt';
import s from './shop.module.css';
export function SavedOrderActions({receipt,endpoint,identity,autoOpen=false,onChange}:{receipt:OrderReceipt;endpoint:string;identity:{key:string}|{id:string};autoOpen?:boolean;onChange:(value:OrderReceipt)=>void}){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[copied,setCopied]=useState(false),[manualCopy,setManualCopy]=useState(false);
 const lock=useRef(false),opened=useRef(false);
 async function refresh(open=false,automatic=false){
  if(lock.current)return;lock.current=true;setBusy(true);
  try{
   const response=await fetch(endpoint+(open?'&open=1':''),{cache:'no-store'}),data=await response.json();
   if(!response.ok||!data.receipt)throw Error(data.error||'This private receipt is unavailable or expired.');
   onChange(data.receipt);
   if(!open){setMessage('Saved inquiry refreshed.');return;}
   if(!data.receipt.handoffAllowed||!data.whatsappUrl){setMessage(data.receipt.reason);return;}
   if(data.copyRequired&&(automatic||!copied)){setManualCopy(true);setMessage('Copy the complete saved summary before opening the short reference message. Then paste it into WhatsApp and press Send.');return;}
   setMessage('If WhatsApp did not open, copy the saved summary and try Open WhatsApp again. You still press Send yourself.');
   window.location.assign(data.whatsappUrl);
  }catch(e){setMessage(e instanceof Error?e.message:'The saved receipt is temporarily unavailable.');}finally{lock.current=false;setBusy(false);}
 }
 useEffect(()=>{
  if(!autoOpen||opened.current)return;opened.current=true;
  if('key' in identity)window.history.replaceState(window.history.state,'','/inquiry/received?key='+encodeURIComponent(identity.key));
  if(receipt.state==='handoff_ready'&&receipt.handoffAllowed)void refresh(true,true);
  // One continuation per mounted receipt. Subsequent opens are explicit and freshly authorized.
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[autoOpen]);
 async function prepare(){
  if(lock.current)return;lock.current=true;setBusy(true);
  try{const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...identity,action:'prepare'})}),data=await response.json();if(!response.ok||!data.receipt)throw Error(data.error||'Message preparation is unavailable.');onChange(data.receipt);setMessage(data.receipt.state==='handoff_ready'?'Your saved order message is ready. Open WhatsApp when you are ready to send it.':data.receipt.reason);}
  catch(e){setMessage(e instanceof Error?e.message:'Your inquiry remains saved. Try preparing its message later.');}finally{lock.current=false;setBusy(false);}
 }
 async function copy(){if(!receipt.summary)return;try{await navigator.clipboard.writeText(receipt.summary);setCopied(true);setMessage('Complete saved order summary copied.');}catch{setManualCopy(true);setMessage('Clipboard access is unavailable. Select and copy the saved summary below.');}}
 return <><p>{receipt.reason}</p><div className={s.actions}>
 {receipt.summary&&<button type="button" disabled={busy} className={s.button} onClick={()=>void copy()}>Copy saved order summary</button>}
 {receipt.handoffAllowed&&<button type="button" disabled={busy} className={s.button+' '+s.outline} onClick={()=>void refresh(true)}>Open WhatsApp ↗</button>}
 {receipt.retryAvailable&&<button type="button" disabled={busy} className={s.button} onClick={()=>void prepare()}>Prepare saved order message</button>}
 <button type="button" disabled={busy} className={s.textLink} onClick={()=>void refresh()}>Refresh saved inquiry</button></div>
 <p role="status">{busy?'Checking your saved inquiry…':message}</p>
 {manualCopy&&receipt.summary&&<div><label className={s.field}>Complete saved summary<textarea readOnly rows={10} value={receipt.summary} onFocus={e=>e.currentTarget.select()}/></label><label className={s.check}><input type="checkbox" checked={copied} onChange={e=>setCopied(e.target.checked)}/>I have copied the complete summary and can paste it in WhatsApp.</label></div>}</>;
}
