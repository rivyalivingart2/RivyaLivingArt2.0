import {notFound} from 'next/navigation';
import {findPortfolioStudy, portfolioPrimaryConcept} from '@/lib/portfolio';
import {ProjectStory} from '@/components/shop/project-story';
import {ShopShell} from '@/components/shop/shop-shell';
import {requirePublicPreview} from '@/lib/public-preview';
import {routeMetadata} from '@/lib/site-metadata';
import type {RealProject} from '@/lib/project-model';

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
 return routeMetadata('/portfolio/'+(await params).slug);
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
 await requirePublicPreview();const {slug}=await params;
 const study=findPortfolioStudy(slug);if(!study)notFound();
 const concept=portfolioPrimaryConcept(study);
 
 const mappedProject: RealProject = {
   slug: study.slug,
   title: study.title,
   description: study.excerpt,
   image: concept?.image || '',
   imageAlt: study.title,
   context: study.spatialQuestions.join(' '),
   brief: study.brief,
   response: study.materialDirection,
   details: [
     { label: 'Focus', value: study.focus },
     { label: 'Collection Tier', value: study.tier }
   ],
   gallery: concept?.gallery?.map(g => ({ src: g.src, alt: g.alt || '', caption: g.caption || '' })) || [],
   approvalRecord: 'demo'
 };

 return <ShopShell><ProjectStory project={mappedProject}/></ShopShell>;
}
