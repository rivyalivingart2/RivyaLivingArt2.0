import {notFound} from "next/navigation";
import {ApprovedExperience} from "@/components/rivya/approved-entry";
import {requirePublicPreview,publicPreviewMetadata} from "@/lib/public-preview";
export function generateMetadata(){return publicPreviewMetadata("System presentations · not performed QA")}
export default async function Page({params}:{params:Promise<{kind:string}>}){await requirePublicPreview();const {kind}=await params;if(!["loading","error","empty","unavailable","failed-media","404"].includes(kind))notFound();return <ApprovedExperience initialRoute={`/states/${kind}`}/>;}
