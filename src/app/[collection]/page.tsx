import {routeMetadata} from '@/lib/site-metadata';
import {notFound} from 'next/navigation';
import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview} from '@/lib/public-preview';
import {isPublicWebsiteAvailable} from '@/lib/public-website';
import {findCollection} from '@/lib/catalogue';
type Props={params:Promise<{collection:string}>};
export async function generateMetadata({params}:Props){return routeMetadata('/'+(await params).collection);}
export default async function Page({params}:Props){await requirePublicPreview();const {collection}=await params;if(!findCollection(collection))notFound();return <ApprovedExperience initialRoute={`/${collection}`}/>}
