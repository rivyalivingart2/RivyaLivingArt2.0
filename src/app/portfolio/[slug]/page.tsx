import {notFound} from 'next/navigation';
import {approvedProjects} from '@/lib/project-model';
import {ProjectStory} from '@/components/shop/project-story';
import {ShopShell} from '@/components/shop/shop-shell';
import {requirePublicPreview} from '@/lib/public-preview';
import {routeMetadata} from '@/lib/site-metadata';
import {publishedPage} from '@/lib/published-content';
import {publicLocale} from '@/lib/site-settings';
import {EditorialPage} from '@/components/shop/editorial';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
 return routeMetadata('/portfolio/'+(await params).slug);
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
 await requirePublicPreview();
 const {slug}=await params;
 const route='/portfolio/'+slug;
 const document=await publishedPage(route);
 if(document?.editorial?.kind==='portfolio')return <ShopShell><EditorialPage route={route} locale={await publicLocale()}/></ShopShell>;
 const project=approvedProjects.find(project=>project.slug===slug&&!!project.approvalRecord);
 if(!project)notFound();
 return <ShopShell><ProjectStory project={project}/></ShopShell>;
}
