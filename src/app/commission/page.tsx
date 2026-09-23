import {LegacyJourney} from '@/lib/legacy-journey';
import {routeMetadata} from '@/lib/site-metadata';
export function generateMetadata(){return routeMetadata('/commission');}
export default function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){return <LegacyJourney route="/commission" searchParams={searchParams}/>;}

