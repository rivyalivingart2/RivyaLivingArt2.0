import {notFound} from 'next/navigation';
import {connection} from 'next/server';
import {ownerCreations} from '@/lib/owner-creations';
import {ShopShell} from '@/components/shop/shop-shell';
import {OwnerCreationsGallery} from '@/components/shop/owner-creations-gallery';
import s from '@/components/shop/migration-public.module.css';
export const metadata={title:'Creations | Rivya Living Art',robots:{index:false,follow:false}};
export default async function Creations({searchParams}:{searchParams:Promise<{image?:string}>}){
 await connection();const {images}=await ownerCreations();if(!images.length)notFound();
 const params=await searchParams,initialImage=typeof params.image==='string'&&/^\d{3}$/.test(params.image)?params.image:'';
 return <ShopShell publicDesign><header className={s.intro}><p>Rivya / Creations</p><h1>Made personal.<br/>Presented beautifully.</h1><p>Explore keepsakes, floral art, clocks and gifts from the studio-selected image collection.</p><p>AI-enhanced presentations. Personalisation and fine details shown are illustrative.</p></header><OwnerCreationsGallery images={images} initialImage={initialImage}/></ShopShell>;
}
