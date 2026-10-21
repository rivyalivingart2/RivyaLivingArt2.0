'use client';
import {useRef,useState} from 'react';
import {Check} from 'lucide-react';
import f from './public-frame.module.css';
const accepted=new Set<string>();
/** Old inline newsletter composition with the destination's capture endpoint. */
export function LegacyNewsletter({source='footer'}:{source?:'footer'|'journal'}){
 const [status,setStatus]=useState<'idle'|'submitting'|'done'|'already'|'error'>('idle'),[error,setError]=useState('');
 const emailRef=useRef<HTMLInputElement>(null),id='newsletter-email-'+source;
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();if(status==='submitting')return;
  const form=new FormData(event.currentTarget),email=String(form.get('email')||'').trim();
  if(accepted.has(email.toLowerCase())){setStatus('already');return;}
  setStatus('submitting');setError('');
  try{
   const response=await fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,source,honeypot:String(form.get('website')||'')})});
   const body=await response.json();if(!response.ok||!body.ok)throw Error(body.error||'Please try again.');
   accepted.add(email.toLowerCase());setStatus('done');
  }catch(e){setError(e instanceof Error?e.message:'Please try again.');setStatus('error');emailRef.current?.focus();}
 }
 return <div className={f.newsletter} lang="en"><div><label htmlFor={id}>Get first access to new pieces.</label><p>Notes from the atelier</p></div><div>
  {status==='done'||status==='already'?<p className={f.newsletterSuccess} role="status"><Check size={18} aria-hidden/>{status==='already'?"You’ve already joined from this browser.":"You’re on the list."}</p>:<form onSubmit={submit} aria-busy={status==='submitting'}>
   <div className={f.newsletterFields}><input ref={emailRef} id={id} name="email" type="email" autoComplete="email" maxLength={254} placeholder="Your email address" required aria-describedby={error?id+'-error':undefined} aria-invalid={status==='error'||undefined}/><button type="submit" disabled={status==='submitting'}>{status==='submitting'?'Joining…':status==='error'?'Try again':'Subscribe'}</button></div>
   <div className={f.honeypot} aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
   {error&&<p id={id+'-error'} role="alert">{error}</p>}
  </form>}
 </div></div>;
}
