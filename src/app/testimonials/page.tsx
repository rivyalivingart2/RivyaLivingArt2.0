import {publishedOrders} from '@/lib/editorial-order-store';
import {Suspense} from 'react';
import {ReadingLoading} from '@/components/shop/reading-loading';
import {requirePublicPreview} from '@/lib/public-preview';
import {ShopShell} from '@/components/shop/shop-shell';
import {EditorialArchive} from '@/components/shop/editorial-archive';
import {publishedContent} from '@/lib/published-content';
import {publicLocale} from '@/lib/site-settings';
import {publicEntry} from '@/lib/landing-dependencies';
import {routeMetadata} from '@/lib/site-metadata';
import s from '@/components/shop/migration-public.module.css';
export function generateMetadata(){return routeMetadata('/testimonials');}
async function Stories(){const entries=(await publishedContent(await publicLocale(),undefined,'/testimonials')).filter(d=>d.editorial?.kind==='testimonial').map(d=>({...publicEntry(d),sections:[],image:undefined}));return <ShopShell><header className={s.intro}><p>Words & perspectives</p><h1>Thoughts on a piece.</h1><p>Genuine feedback is published with permission. Any fictional sample is clearly labelled and is not a customer review.</p></header><EditorialArchive orders={await publishedOrders()} entries={entries} label="Testimonials"/></ShopShell>;}
export default async function Page(){await requirePublicPreview();return <Suspense fallback={<ReadingLoading/>}><Stories/></Suspense>;}
