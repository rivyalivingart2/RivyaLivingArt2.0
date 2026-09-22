import {notFound} from 'next/navigation';
import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview,publicPreviewMetadata} from '@/lib/public-preview';
const modules=['taxonomy','projects','review','enquiries','imports','subscribers','demo','navigation','staff','login','recovery','settings','environment','activity'];
export function generateMetadata(){return publicPreviewMetadata('RivyaLivingArt Studio · local demo')}
export default async function Page({params}:{params:Promise<{path:string[]}>}){await requirePublicPreview();const {path}=await params;if(!modules.includes(path[0])||path.length>2)notFound();return <ApprovedExperience initialRoute={'/studio/'+path.join('/')}/>}
