import {routeMetadata} from '@/lib/site-metadata';
import {ApprovedExperience} from '@/components/rivya/approved-entry';
import {requirePublicPreview} from '@/lib/public-preview';
export function generateMetadata(){return routeMetadata('/resin-art-delhi');}
export default async function Page(){await requirePublicPreview();return <ApprovedExperience initialRoute='/resin-art-delhi'/>}
