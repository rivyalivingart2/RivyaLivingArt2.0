import {notFound,permanentRedirect} from 'next/navigation';
import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview} from '@/lib/public-preview';
import {routeMetadata} from '@/lib/site-metadata';
import {publishedPage} from '@/lib/published-content';
import {articleAliases} from '@/lib/content-model';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){const {slug}=await params;return routeMetadata('/journal/'+(Object.hasOwn(articleAliases,slug)?articleAliases[slug]:slug));}
export default async function Page({params}:Props){await requirePublicPreview();const {slug}=await params;const target=Object.hasOwn(articleAliases,slug)?articleAliases[slug]:slug;if(!await publishedPage('/journal/'+target))notFound();if(target!==slug)permanentRedirect('/journal/'+target);return <ApprovedExperience initialRoute={'/journal/'+slug}/>;}
