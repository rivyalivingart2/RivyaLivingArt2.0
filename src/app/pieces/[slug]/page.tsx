import {routeMetadata} from '@/lib/site-metadata';
import {notFound,permanentRedirect} from 'next/navigation';
import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview} from '@/lib/public-preview';
import {findConcept} from '@/lib/catalogue';
import {publishedProducts} from '@/lib/shop-catalogue';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){return routeMetadata('/pieces/'+(await params).slug);}
export default async function Page({params}:Props){await requirePublicPreview();const {slug}=await params;const products=await publishedProducts();const direct=products.find(p=>p.slug===slug);if(!direct){const old=findConcept(slug);const product=products.find(p=>p.id===old?.id);if(product)permanentRedirect('/pieces/'+product.slug);notFound();}return <ApprovedExperience initialRoute={"/pieces/"+slug}/>}
