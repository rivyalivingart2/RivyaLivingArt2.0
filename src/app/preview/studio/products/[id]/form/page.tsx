import {notFound} from "next/navigation";
import {concepts} from "@/lib/catalogue";
import {getContentDocument} from "@/lib/studio-content-data";
import {ApprovedExperience} from "@/components/rivya/approved-entry";
import {requirePublicPreview,publicPreviewMetadata} from "@/lib/public-preview";
export function generateMetadata(){return publicPreviewMetadata("RivyaLivingArt Studio · local demo")}
export default async function Page({params}:{params:Promise<{id:string}>}){await requirePublicPreview();const {id}=await params;if(!concepts.some(p=>p.id===id))notFound();return <ApprovedExperience initialRoute={`/studio/products/${id}/form`}/>;}
