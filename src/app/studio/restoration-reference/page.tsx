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
export default async function RestorationReference({searchParams}:{searchParams:Promise<{view?:string;fixture?:string}>}){
 const session=await requireStudioSession();
 if(process.env.RIVYA_DATA_MODE!=='isolated'||process.env.RIVYA_QA_TARGET!=='exact-legacy-local'||process.env.RIVYA_RESTORATION_LOCAL!=='true'||process.env.VERCEL)notFound();
 const query=await searchParams;
 if(query.view==='project'){
  const product=(await publishedProducts('en'))[0];if(!product)notFound();
  const document:PublishedContentDocument={id:'editorial:8e43c7e7-192f-439f-beb2-789c0401a128',kind:'page',route:'/portfolio/local-restoration-study',title:product.name+' · layout study',eyebrow:'Isolated design reference',description:'Synthetic local template preview using an existing design visualization. This is not a completed customer project.',image:product.image,imageAlt:product.imageAlt,imagePosition:product.imagePosition,sections:[{id:'study',heading:'Material and proportion',paragraphs:[product.story]}],editorial:{schemaVersion:1,kind:'portfolio',classification:'concept',details:[{label:'Template evidence',value:'Local rendering only; no customer or installation claim'},{label:'Existing product reference',value:product.id},{label:'Material direction',value:product.material||'Not recorded'}]}};
  if(query.fixture==='matched')Object.assign(document,{title:'Synthetic reference project',eyebrow:'Reference fixtures',description:'Isolated design verification fixture. Not a customer commission.',image:'/legacy-reference/foundation/bench-coffee-top.avif',imageAlt:'Synthetic reference project',imagePosition:'50% 50%',sections:[{id:'brief',heading:'The brief',paragraphs:['Fixture brief for conditional template verification.']},{id:'process',heading:'The process',paragraphs:['Fixture process text for layout verification.']}],editorial:{schemaVersion:1,kind:'portfolio',classification:'concept',details:[{label:'Type',value:'Design fixture'},{label:'Material',value:'Reference resin surface'},{label:'Timeline',value:'Fixture timeline'}]}});
  if(query.fixture==='matched')document.editorial?.details?.push({label:'Size',value:'Fixture dimensions'},{label:'Completed',value:'October 21, 2026'});
  return <ShopShell publicDesign><LegacyProjectDocument document={document}/></ShopShell>;
 }
 return <PrivateStudioEntry session={session}><LegacyScraperReference/></PrivateStudioEntry>;
}
