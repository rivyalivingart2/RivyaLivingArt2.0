'use client';
import {useActionState,useEffect,useState,useSyncExternalStore} from 'react';
import Link from 'next/link';
import {setAccessPassword} from '@/app/studio/login/access-actions';
import {StudioAccessShell} from './access-shell';
import s from './studio-access.module.css';
const subscribe=()=>()=>{};
export function AccessPasswordForm() {
  const mounted=useSyncExternalStore(subscribe,()=>true,()=>false);
  return mounted?<PasswordForm/>:<StudioAccessShell title="Make it yours." description="Set a private password for your approved Studio access."><p role="status">Preparing your secure form…</p></StudioAccessShell>;
}
function PasswordForm() {
  const [token,setToken]=useState(()=>new URLSearchParams(window.location.hash.slice(1)).get('token')||'');
  const [state,action,pending]=useActionState(setAccessPassword,{error:'',message:''});
  useEffect(()=>{
    // Fragment never reaches HTTP logs, referrers or server-rendered markup.
    window.history.replaceState(null,'',window.location.pathname);
    const receiveLink=()=>{
      setToken(new URLSearchParams(window.location.hash.slice(1)).get('token')||'');
      window.history.replaceState(null,'',window.location.pathname);
    };
    window.addEventListener('hashchange',receiveLink);
    return ()=>window.removeEventListener('hashchange',receiveLink);
  },[]);
  return <StudioAccessShell title="Make it yours." description="Set a private password for your approved Studio access.">
    {state.message?<div className={s.success} role="status"><h2>You’re ready to sign in.</h2><p>{state.message}</p><Link href="/studio/login">Sign in to Studio</Link></div>:!token?<div className={s.success}><p role="alert">Open the complete one-time link shared by your administrator. If you refreshed this page, reopen that link.</p><Link href="/studio/forgot-password">Request a new link</Link></div>:<form action={action} className={s.form} aria-busy={pending}>
      <input type="hidden" name="token" value={token}/>
      <label htmlFor="new-password">New password<input id="new-password" name="password" type="password" minLength={16} maxLength={200} autoComplete="new-password" required disabled={pending} aria-describedby="password-help"/></label>
      <p id="password-help" className={s.note}>Use 16–200 characters. A long, unique passphrase works well.</p>
      <label htmlFor="confirm-password">Confirm password<input id="confirm-password" name="confirm" type="password" minLength={16} maxLength={200} autoComplete="new-password" required disabled={pending}/></label>
      <p className={s.error} role="alert">{state.error}</p>
      <button className={s.primary} disabled={pending}>{pending?'Saving password…':'Save password'}</button>
      <p className={s.note}>Links expire after 30 minutes and work once. Setting your password signs out previous sessions.</p>
    </form>}
  </StudioAccessShell>;
}
