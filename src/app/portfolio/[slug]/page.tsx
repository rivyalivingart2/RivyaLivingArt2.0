import {notFound} from 'next/navigation';
import {approvedProjects} from '@/lib/project-model';
import {ProjectStory} from '@/components/shop/project-story';
import {ShopShell} from '@/components/shop/shop-shell';
import {requirePublicPreview} from '@/lib/public-preview';
import {routeMetadata} from '@/lib/site-metadata';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
 return routeMetadata('/portfolio/'+(await params).slug);
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
 await requirePublicPreview();const {slug}=await params;
 const project=approvedProjects.find(p=>p.slug===slug&&p.approvalRecord);if(!project)notFound();
 return <ShopShell><ProjectStory project={project}/></ShopShell>;
}
