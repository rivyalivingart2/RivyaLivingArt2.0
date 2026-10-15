'use client';
import {useActionState, useState} from 'react';
import Link from 'next/link';
import {Eye, EyeOff, ArrowRight} from 'lucide-react';
import {StudioAccessShell} from './studio/access-shell';
import s from './studio/studio-access.module.css';
import {loginAdmin} from '@/app/studio/login/actions';

export function StudioLogin({configured, unavailable}: {configured: boolean; unavailable: boolean}) {
  const [state, action, pending] = useActionState(loginAdmin, {error: ''});
  const [visible, setVisible] = useState(false);
  return <StudioAccessShell title="Welcome to the atelier." description="Sign in to care for your pieces, stories and commissions.">
    <form action={action} className={s.form} aria-busy={pending}>
      {!configured ? <p role="status">Studio setup is pending. The owner must finish configuration before sign-in is available.</p> : <>
        <label htmlFor="admin-id">Staff ID<input id="admin-id" name="id" autoComplete="username" maxLength={200} required disabled={pending} placeholder="Your Studio ID"/></label>
        <div className={s.passwordField}><label htmlFor="admin-password">Password</label><span className={s.password}><input id="admin-password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" maxLength={1024} required disabled={pending}/><button type="button" aria-label={visible?'Hide password':'Show password'} aria-pressed={visible} aria-controls="admin-password" disabled={pending} onClick={() => setVisible(v => !v)}>{visible?<EyeOff size={19}/>:<Eye size={19}/>}</button></span></div>
        <Link className={s.forgot} href="/studio/forgot-password">Forgot password?</Link>
        <p className={s.error} role="alert">{state.error || (unavailable ? 'Sign-in is temporarily unavailable. Please try again later.' : '')}</p>
        <button className={s.primary} type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in to Studio'}<ArrowRight size={18} aria-hidden="true"/></button>
      </>}
    </form>
    <p className={s.join}>New to the atelier? <Link href="/studio/request-access">Request an account</Link></p>
    <p className={s.note}>Private access for Rivya staff. New accounts require administrator approval.</p>
  </StudioAccessShell>;
}
