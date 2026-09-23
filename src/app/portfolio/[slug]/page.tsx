import {notFound} from 'next/navigation';
import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview,publicPreviewMetadata} from '@/lib/public-preview';
import {isPublicWebsiteAvailable} from '@/lib/public-website';
import {findPortfolioStudy} from '@/lib/portfolio';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){if(!isPublicWebsiteAvailable(process.env))return publicPreviewMetadata('Not found');return publicPreviewMetadata(findPortfolioStudy((await params).slug)?.title||'Not found')}
export default async function Page({params}:Props){await requirePublicPreview();const {slug}=await params;if(!findPortfolioStudy(slug))notFound();return <ApprovedExperience initialRoute={"/portfolio/"+slug}/>}
