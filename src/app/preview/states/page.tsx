import {notFound} from "next/navigation";
import {ApprovedExperience} from "@/components/rivya/approved-entry";
import {requireVisualPreview,publicPreviewMetadata} from "@/lib/public-preview";
export function generateMetadata(){return publicPreviewMetadata("System presentations · not performed QA")}
export default async function Page(){await requireVisualPreview();return <ApprovedExperience initialRoute={"/states"}/>;}
