import {requirePublicPreview,publicPreviewMetadata} from '@/lib/public-preview';
import {publishedProducts} from '@/lib/shop-catalogue';
import {ShopShell} from '@/components/shop/shop-shell';
import {Intro} from '@/components/shop/shop-site';
import {SavedPieces} from '@/components/shop/saved-pieces';
export const metadata=publicPreviewMetadata('Your saved pieces','A browser-local list of published designs to return to.');
export default async function Page(){await requirePublicPreview();const products=await publishedProducts();return <ShopShell><Intro eyebrow="A collection of ideas" title="Your saved pieces.">Return to a design, compare directions and open its current details.</Intro><SavedPieces products={products.map(({id,slug,name,subtitle,category,tier,material,image,imageAlt,imagePosition,price})=>({id,slug,name,subtitle,category,tier,material,image,imageAlt,imagePosition,price}))}/></ShopShell>;}
