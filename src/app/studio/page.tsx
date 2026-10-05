import {requireStudioSession} from '@/lib/studio-auth';
import {PrivateStudioEntry} from '@/components/rivya/private-studio-entry';
export default async function StudioPage() {
  const session=await requireStudioSession();
  return <PrivateStudioEntry session={session}/>;
}
