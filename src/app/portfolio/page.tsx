import {Suspense} from 'react';
import {ReadingLoading} from '@/components/shop/reading-loading';
import {PortfolioIndex} from '@/components/shop/portfolio-index';
import {routeMetadata} from '@/lib/site-metadata';
import {ShopShell} from '@/components/shop/shop-shell';
import {requirePublicPreview} from '@/lib/public-preview';
export function generateMetadata(){return routeMetadata('/portfolio');}
export default async function Page(){await requirePublicPreview();return <Suspense fallback={<ReadingLoading/>}><ShopShell><PortfolioIndex/></ShopShell></Suspense>;}
