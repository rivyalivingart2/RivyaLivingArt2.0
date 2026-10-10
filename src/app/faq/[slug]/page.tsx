import {notFound} from 'next/navigation';
import {requirePublicPreview} from '@/lib/public-preview';
import {publishedPage} from '@/lib/published-content';
import {publicLocale} from '@/lib/site-settings';
import {routeMetadata} from '@/lib/site-metadata';
import {EditorialPage} from '@/components/shop/editorial';
import {ShopShell} from '@/components/shop/shop-shell';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){return routeMetadata('/faq/'+(await params).slug);}
export default async function Page({params}:{params:Promise<{slug:string}>}){await requirePublicPreview();const route='/faq/'+(await params).slug;if((await publishedPage(route))?.editorial?.kind!=='faq')notFound();return <ShopShell><EditorialPage route={route} locale={await publicLocale()}/></ShopShell>;}
