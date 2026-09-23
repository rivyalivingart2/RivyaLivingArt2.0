'use server';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {authenticateStaff, createStudioSession, revokeStudioSession, sessionCookie, sessionSeconds, studioConfigured} from '@/lib/studio-auth';
import {clientRateKey,limited,privateHash} from '@/lib/request-security';

export type LoginState = {error: string};
export async function loginAdmin(_state: LoginState, form: FormData): Promise<LoginState> {
  const id = form.get('id'), password = form.get('password');
  if (!studioConfigured()) return {error: 'Studio setup is not complete. Contact the site owner.'};
  if (typeof id !== 'string' || typeof password !== 'string' || id.length > 200 || password.length > 1024)
    return {error: 'Unable to sign in. Check your credentials and try again.'};
  try {
    if (!await limited(await clientRateKey('login'),40,15) || !await limited('login-id:'+privateHash(id.toLowerCase()),10,15)) return {error: 'Too many attempts. Please wait 15 minutes before trying again.'};
    const identity=await authenticateStaff(id.trim(),password);
    if (!identity) return {error: 'Unable to sign in. Check your credentials and try again.'};
    const token = await createStudioSession(identity);
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
