import {routeMetadata} from '@/lib/site-metadata';
import {ApprovedExperience} from "@/components/rivya/approved-entry";
import {requirePublicPreview} from "@/lib/public-preview";
import {Suspense} from 'react';
import {ReadingLoading} from '@/components/shop/reading-loading';
export function generateMetadata(){return routeMetadata('/faq');}
// Keep the index skeleton below this route: child record existence must resolve before streaming.
export default async function Page(){await requirePublicPreview();return <Suspense fallback={<ReadingLoading/>}><ApprovedExperience initialRoute="/faq"/></Suspense>}
