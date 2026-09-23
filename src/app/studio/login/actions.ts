'use server';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {allowLoginAttempt, createStudioSession, revokeStudioSession, sessionCookie, sessionSeconds, studioConfigured, verifyAdmin} from '@/lib/studio-auth';

export type LoginState = {error: string};
export async function loginAdmin(_state: LoginState, form: FormData): Promise<LoginState> {
  const id = form.get('id'), password = form.get('password');
  if (!studioConfigured()) return {error: 'Studio setup is not complete. Contact the site owner.'};
  if (typeof id !== 'string' || typeof password !== 'string' || id.length > 200 || password.length > 1024)
    return {error: 'Unable to sign in. Check your credentials and try again.'};
  try {
    if (!await allowLoginAttempt()) return {error: 'Too many attempts. Please wait 15 minutes before trying again.'};
    if (!await verifyAdmin(id, password)) return {error: 'Unable to sign in. Check your credentials and try again.'};
    const token = await createStudioSession();
    (await cookies()).set(sessionCookie, token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict',
      path: '/', maxAge: sessionSeconds,
    });
  } catch { return {error: 'Sign-in is temporarily unavailable. Please try again later.'}; }
  redirect('/studio');
}
export async function logoutAdmin(): Promise<void> {
  // If revocation fails, keep the current session and show the route error boundary.
  await revokeStudioSession();
  (await cookies()).delete(sessionCookie);
  redirect('/studio/login');
}
