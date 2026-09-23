import {redirect} from 'next/navigation';
import {requireStudioSession} from '@/lib/studio-auth';
export const metadata = {title: 'Private Studio', robots: {index: false, follow: false}};
export default async function LegacyStudio({params}: {params: Promise<{module: string}>}) {
  await requireStudioSession();
  const values = await params;
  redirect('/studio/' + [values.module].join('/'));
}
