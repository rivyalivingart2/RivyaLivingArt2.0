import {redirect} from 'next/navigation';
import {studioConfigured, studioSession} from '@/lib/studio-auth';
import {StudioLogin} from '@/components/studio-login';
export default async function LoginPage({searchParams}: {searchParams: Promise<{status?: string}>}) {
  let session = null;
  try { session = await studioSession(); } catch { /* Render the safe login state without storage details. */ }
  if (session) redirect('/studio');
  return <StudioLogin configured={studioConfigured()} unavailable={(await searchParams).status === 'unavailable'}/>;
}
