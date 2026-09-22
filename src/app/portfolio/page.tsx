import {ApprovedExperience} from "@/components/rivya/approved-entry";
import {requirePublicPreview,publicPreviewMetadata} from "@/lib/public-preview";
export function generateMetadata(){return publicPreviewMetadata('Portfolio');}
export default async function Page(){await requirePublicPreview();return <ApprovedExperience initialRoute="/portfolio"/>}
