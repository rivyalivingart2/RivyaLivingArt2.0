import {notFound} from 'next/navigation';
import {isHostedEnvironment} from '@/lib/hosting-environment';
import {requireStudioSession} from '@/lib/studio-auth';
import {AuthoringStates} from '@/components/studio/authoring-states';
export const dynamic='force-dynamic';
export const metadata={title:'Authoring state gallery',robots:{index:false,follow:false,noarchive:true}};
export default async function StateGallery(){
 await requireStudioSession();
 if(process.env.RIVYA_DATA_MODE!=='isolated'||process.env.RIVYA_P2_STATE_GALLERY!=='1'||isHostedEnvironment(process.env)||process.env.RIVYA_ENV==='production')notFound();
 return <AuthoringStates/>;
}
