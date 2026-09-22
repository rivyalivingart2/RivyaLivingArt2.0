import {ApprovedExperience} from "@/components/rivya/approved-entry";
import {requirePublicPreview,publicPreviewMetadata} from "@/lib/public-preview";
export function generateMetadata(){return publicPreviewMetadata('Our Story');}
export default async function Page(){await requirePublicPreview();return <ApprovedExperience initialRoute="/our-story"/>}
