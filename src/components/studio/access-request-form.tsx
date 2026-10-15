'use client';
import {useActionState} from 'react';
import Link from 'next/link';
import {ArrowRight} from 'lucide-react';
import {submitAccessRequest} from '@/app/studio/login/access-actions';
import {StudioAccessShell} from './access-shell';
import s from './studio-access.module.css';
export function AccessRequestForm({kind}:{kind:'access'|'recovery'}) {
  const [state,action,pending]=useActionState(submitAccessRequest,{error:'',message:''});
  const recovery=kind==='recovery';
  return <StudioAccessShell title={recovery?'A way back in.':'Your place in the atelier.'} description={recovery?'Request help resetting your Studio password. Your administrator will verify it’s you.':'Request a Studio account. An administrator reviews each request before access is granted.'}>
    {state.message?<div className={s.success} role="status"><h2>Request received.</h2><p>{state.message}</p><Link href="/studio/login">Back to sign in</Link></div>:<form action={action} className={s.form} aria-busy={pending}>
      <input type="hidden" name="kind" value={kind}/>
      <label htmlFor="access-name">Your name<input id="access-name" name="name" autoComplete="name" maxLength={100} required disabled={pending}/></label>
      <label htmlFor="access-login">{recovery?'Staff ID':'Choose a Staff ID'}<input id="access-login" name="login" autoComplete="username" minLength={3} maxLength={80} pattern="[a-zA-Z0-9_.@\-]{3,80}" required disabled={pending} aria-describedby="login-help"/></label>
      <p id="login-help" className={s.note}>Use letters, numbers, dots, underscores, @ or hyphens.</p>
      <label htmlFor="access-contact">Email or phone for the administrator<input id="access-contact" name="contact" autoComplete="off" minLength={3} maxLength={160} required disabled={pending}/></label>
      <label className={s.consent}><input type="checkbox" name="consent" required disabled={pending}/>I agree that an administrator may use these details to review this access request.</label>
      <p className={s.error} role="alert">{state.error}</p>
      <button className={s.primary} disabled={pending}>{pending?'Sending request…':recovery?'Request password reset':'Request an account'}<ArrowRight size={18} aria-hidden="true"/></button>
      <p className={s.note}>Your administrator shares a one-time link after verification. No automatic email is sent.{recovery?' The owner account is recovered through secure hosting settings.':' Approved new accounts start with editor access.'}</p>
    </form>}
    {!state.message&&<p className={s.join}>Already have access? <Link href="/studio/login">Sign in</Link></p>}
  </StudioAccessShell>;
}
