import {notFound} from 'next/navigation';
import {requireStudioSession} from '@/lib/studio-auth';
import {AuthoringStates} from '@/components/studio/authoring-states';
export const dynamic='force-dynamic';
export const metadata={title:'Authoring state gallery',robots:{index:false,follow:false,noarchive:true}};
export default async function StateGallery(){
 await requireStudioSession();
 if(process.env.RIVYA_DATA_MODE!=='isolated'||process.env.RIVYA_P2_STATE_GALLERY!=='1'||process.env.VERCEL_ENV==='production'||process.env.RIVYA_ENV==='production')notFound();
 return <AuthoringStates/>;
}
