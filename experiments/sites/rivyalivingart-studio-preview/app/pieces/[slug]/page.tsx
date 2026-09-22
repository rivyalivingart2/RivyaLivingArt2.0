import {Experience} from '@/components/rivya/experience';
import {findProduct} from '@/lib/rivya/data';
import {notFound} from 'next/navigation';
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!findProduct(slug))notFound();return <Experience initialRoute={`/pieces/${slug}`}/>}
