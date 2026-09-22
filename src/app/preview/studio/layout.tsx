import {requirePublicPreview} from "@/lib/public-preview";
export default async function StudioPreviewLayout({children}:{children:React.ReactNode}){await requirePublicPreview();return children}
