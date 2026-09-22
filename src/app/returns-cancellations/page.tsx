import {ApprovedExperience} from "@/components/rivya/approved-entry";
import {requirePublicPreview,publicPreviewMetadata} from "@/lib/public-preview";
export function generateMetadata(){return publicPreviewMetadata('Returns Cancellations');}
export default async function Page(){await requirePublicPreview();return <ApprovedExperience initialRoute="/returns-cancellations"/>}
