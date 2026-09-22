import {notFound} from 'next/navigation';
import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview,publicPreviewMetadata} from '@/lib/public-preview';
import {isVisualPreviewAllowed} from '@/lib/preview-mode';
import {findCollection} from '@/lib/catalogue';
type Props={params:Promise<{collection:string}>};
export async function generateMetadata({params}:Props){if(!isVisualPreviewAllowed(process.env))return publicPreviewMetadata('Not found');return publicPreviewMetadata(findCollection((await params).collection)?.label||'Not found')}
export default async function Page({params}:Props){await requirePublicPreview();const {collection}=await params;if(!findCollection(collection))notFound();return <ApprovedExperience initialRoute={`/${collection}`}/>}
