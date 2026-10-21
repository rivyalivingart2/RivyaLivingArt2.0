import {notFound} from 'next/navigation';
import {requireStudioSession} from '@/lib/studio-auth';
import {PrivateStudioEntry} from '@/components/rivya/private-studio-entry';
import {LegacyScraperReference} from '@/components/studio/legacy-scraper-reference';
import {publishedProducts} from '@/lib/shop-catalogue';
import {ShopShell} from '@/components/shop/shop-shell';
import {LegacyProjectDocument} from '@/components/shop/legacy-project-document';
import type {PublishedContentDocument} from '@/lib/published-content';
export const dynamic='force-dynamic';
export const metadata={title:'Legacy scraper reference',robots:{index:false,follow:false,noarchive:true}};
export default async function RestorationReference({searchParams}:{searchParams:Promise<{view?:string}>}){
 const session=await requireStudioSession();
 if(process.env.RIVYA_DATA_MODE!=='isolated'||process.env.RIVYA_QA_TARGET!=='exact-legacy-local'||process.env.RIVYA_RESTORATION_LOCAL!=='true'||process.env.VERCEL)notFound();
 if((await searchParams).view==='project'){
  const product=(await publishedProducts('en'))[0];if(!product)notFound();
  const document:PublishedContentDocument={id:'editorial:8e43c7e7-192f-439f-beb2-789c0401a128',kind:'page',route:'/portfolio/local-restoration-study',title:product.name+' · layout study',eyebrow:'Isolated design reference',description:'Synthetic local template preview using an existing design visualization. This is not a completed customer project.',image:product.image,imageAlt:product.imageAlt,imagePosition:product.imagePosition,sections:[{id:'study',heading:'Material and proportion',paragraphs:[product.story]}],editorial:{schemaVersion:1,kind:'portfolio',classification:'concept',details:[{label:'Template evidence',value:'Local rendering only; no customer or installation claim'},{label:'Existing product reference',value:product.id},{label:'Material direction',value:product.material||'Not recorded'}]}};
  return <ShopShell publicDesign><LegacyProjectDocument document={document}/></ShopShell>;
 }
 return <PrivateStudioEntry session={session}><LegacyScraperReference/></PrivateStudioEntry>;
}
