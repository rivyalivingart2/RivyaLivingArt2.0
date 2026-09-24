import {notFound} from 'next/navigation';
import {requireStudioSession} from '@/lib/studio-auth';
import {PrivateStudioEntry} from '@/components/rivya/private-studio-entry';
const modules = ['inquiries','follow-ups','kanban','forms','journal','pages','orders','products','content','media','taxonomy','projects','review','enquiries','imports','subscribers','demo','navigation','staff','settings','environment','activity'];
export default async function StudioModule({params}: {params: Promise<{path: string[]}>}) {
  await requireStudioSession();
  const {path} = await params;
  if (!modules.includes(path[0]) || path.length > 3) notFound();
  return <PrivateStudioEntry/>;
}
