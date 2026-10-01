import {notFound} from 'next/navigation';
import {requirePublicPreview} from '@/lib/public-preview';
import {publishedPage} from '@/lib/published-content';
import {routeMetadata} from '@/lib/site-metadata';
import {EditorialPage} from '@/components/shop/editorial';
import {ShopShell} from '@/components/shop/shop-shell';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return routeMetadata('/p/'+slug);}
export default async function Page({params}:{params:Promise<{slug:string}>}){await requirePublicPreview();const {slug}=await params;if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||!await publishedPage('/p/'+slug))notFound();return <ShopShell><EditorialPage route={'/p/'+slug}/></ShopShell>;}
