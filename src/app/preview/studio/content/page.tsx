import {redirect} from 'next/navigation';
import {requireStudioSession} from '@/lib/studio-auth';
export const metadata = {title: 'Private Studio', robots: {index: false, follow: false}};
export default async function LegacyStudio() {
  await requireStudioSession();
  redirect('/studio/' + ['content'].join('/'));
}
