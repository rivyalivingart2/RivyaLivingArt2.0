'use client';
import {useActionState, useState} from 'react';
import {loginAdmin} from '@/app/studio/login/actions';

export function StudioLogin({configured, unavailable}: {configured: boolean; unavailable: boolean}) {
  const [state, action, pending] = useActionState(loginAdmin, {error: ''});
  const [visible, setVisible] = useState(false);
  return <main id="main-content" className="studio-login"><form action={action} className="studio-login-card">
    <p className="eyebrow">RivyaLivingArt · Private Studio</p><h1>Welcome back.</h1>
    <p>Sign in to manage your atelier.</p>
    {!configured ? <p role="status">Studio setup is pending. The owner must finish configuration before sign-in is available.</p> : <>
      <label htmlFor="admin-id">Admin ID</label><input id="admin-id" name="id" autoComplete="username" maxLength={200} required autoFocus disabled={pending}/>
      <label htmlFor="admin-password">Password</label><input id="admin-password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" maxLength={1024} required disabled={pending}/>
      <button type="button" className="studio-password-toggle" aria-pressed={visible} aria-controls="admin-password" onClick={() => setVisible(v => !v)}>{visible ? 'Hide password' : 'Show password'}</button>
      <p role="alert">{state.error || (unavailable ? 'Sign-in is temporarily unavailable. Please try again later.' : '')}</p>
      <button className="studio-button primary" type="submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
    </>}
    <p className="studio-note">Access is reserved for the site administrator.</p>
  </form></main>;
}
