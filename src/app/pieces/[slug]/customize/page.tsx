import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview,publicPreviewMetadata} from '@/lib/public-preview';
export const metadata=publicPreviewMetadata('Customize your piece');
export default async function Page({params}:{params:Promise<{slug:string}>}){await requirePublicPreview();return <ApprovedExperience initialRoute={`/pieces/${(await params).slug}/customize`}/>;}
