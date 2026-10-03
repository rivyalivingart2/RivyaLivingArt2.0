import {routeMetadata} from '@/lib/site-metadata';
import {Suspense} from 'react';
import {ReadingLoading} from '@/components/shop/reading-loading';
import {ApprovedExperience} from "@/components/rivya/approved-entry";
import {requirePublicPreview} from "@/lib/public-preview";
export function generateMetadata(){return routeMetadata('/journal');}
// Index-only fallback: nested article validation must finish before streaming a response.
export default async function Page(){await requirePublicPreview();return <Suspense fallback={<ReadingLoading/>}><ApprovedExperience initialRoute="/journal"/></Suspense>}
