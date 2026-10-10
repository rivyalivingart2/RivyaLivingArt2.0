import {notFound,redirect} from 'next/navigation';
import {requireStudioSession} from '@/lib/studio-auth';
import {PrivateStudioEntry} from '@/components/rivya/private-studio-entry';
import {studioRoute,studioModule,studioChildHref} from '@/lib/studio-modules';
export default async function StudioModule({params}: {params: Promise<{path: string[]}>}) {
  const session=await requireStudioSession();
  const {path} = await params;
  if(path.length===1&&['signup','forgot-password','reset-password'].includes(path[0]))redirect('/studio/login');
  const selectedModule=studioModule(path[0]);if(selectedModule?.adminOnly&&session.role!=='admin')notFound();
  const child=studioChildHref(path);if(child)redirect(child);
  if (!studioRoute(path)) notFound();
  return <PrivateStudioEntry session={session}/>;
}
