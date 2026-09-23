import {LegacyJourney} from '@/lib/legacy-journey';
import {publicPreviewMetadata} from '@/lib/public-preview';
export function generateMetadata(){return publicPreviewMetadata('Preserve a memory');}
export default function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){return <LegacyJourney route="/preserve" searchParams={searchParams}/>;}

