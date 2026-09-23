import {notFound,redirect} from 'next/navigation';
import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview,publicPreviewMetadata} from '@/lib/public-preview';
import {findConcept} from '@/lib/catalogue';
import {publishedProducts} from '@/lib/shop-catalogue';
export const metadata=publicPreviewMetadata('Customize your piece');
export default async function Page({params}:{params:Promise<{slug:string}>}){
 await requirePublicPreview();
 const {slug}=await params,products=await publishedProducts();
 if(!products.some(p=>p.slug===slug)){
  const old=findConcept(slug),product=products.find(p=>p.id===old?.id);
  if(product)redirect('/pieces/'+product.slug+'/customize');
  notFound();
 }
 return <ApprovedExperience initialRoute={'/pieces/'+slug+'/customize'}/>;
}
