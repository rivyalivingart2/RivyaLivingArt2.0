import type {Metadata} from 'next';
import '@/components/studio-private.css';
export const metadata: Metadata = {title: 'Private Studio', robots: {index: false, follow: false, noarchive: true}};
export default function StudioLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}
