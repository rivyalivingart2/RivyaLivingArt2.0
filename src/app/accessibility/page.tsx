import {ApprovedExperience} from "@/components/rivya/approved-entry";
import {requirePublicPreview,publicPreviewMetadata} from "@/lib/public-preview";
export function generateMetadata(){return publicPreviewMetadata('Accessibility');}
export default async function Page(){await requirePublicPreview();return <ApprovedExperience initialRoute="/accessibility"/>}
