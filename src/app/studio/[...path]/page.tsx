import {notFound} from 'next/navigation';
import {requireStudioSession} from '@/lib/studio-auth';
import {PrivateStudioEntry} from '@/components/rivya/private-studio-entry';
import {studioRoute} from '@/lib/studio-modules';
export default async function StudioModule({params}: {params: Promise<{path: string[]}>}) {
  await requireStudioSession();
  const {path} = await params;
  if (!studioRoute(path)) notFound();
  return <PrivateStudioEntry/>;
}
