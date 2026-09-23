import {LegacyJourney} from '@/lib/legacy-journey';
import {publicPreviewMetadata} from '@/lib/public-preview';
export function generateMetadata(){return publicPreviewMetadata('Personal art & gifts');}
export default function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){return <LegacyJourney route="/personalize" searchParams={searchParams}/>;}

