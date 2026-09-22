import {ApprovedExperience} from "@/components/rivya/approved-entry";
import {requirePublicPreview,publicPreviewMetadata} from "@/lib/public-preview";
export function generateMetadata(){return publicPreviewMetadata('Shipping Delivery');}
export default async function Page(){await requirePublicPreview();return <ApprovedExperience initialRoute="/shipping-delivery"/>}
