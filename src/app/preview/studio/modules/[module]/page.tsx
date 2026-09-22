import {notFound} from 'next/navigation';
import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview,publicPreviewMetadata} from '@/lib/public-preview';
const modules=['content','media','taxonomy','projects','review','enquiries','imports','subscribers','demo','navigation','staff','settings','environment','activity'];
export function generateMetadata(){return publicPreviewMetadata('Studio module · local demo')}
export default async function Page({params}:{params:Promise<{module:string}>}){await requirePublicPreview();const {module}=await params;if(!modules.includes(module))notFound();return <ApprovedExperience initialRoute={`/studio/${module}`}/>}
