import {requireStudioSession} from '@/lib/studio-auth';
export default async function StudioPreviewLayout({children}:{children:React.ReactNode}){await requireStudioSession();return children}
