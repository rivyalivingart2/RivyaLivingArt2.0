import {LegacyJourney} from '@/lib/legacy-journey';
import {publicPreviewMetadata} from '@/lib/public-preview';
export function generateMetadata(){return publicPreviewMetadata('Begin a piece');}
export default function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){return <LegacyJourney route="/commission" searchParams={searchParams}/>;}

