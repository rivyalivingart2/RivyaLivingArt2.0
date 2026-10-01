import {sharedCopyId} from '@/lib/shared-copy-model';
import {requireStudioSession} from '@/lib/studio-auth';
import {savedContentPreview,SavedContentDocument,supportedSavedPreview} from '@/lib/saved-content-preview';
import {ShopShell} from '@/components/shop/shop-shell';
import {notFound} from 'next/navigation';
export const dynamic='force-dynamic';
export default async function PreviewFrame({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 await requireStudioSession();
 const params=await searchParams,version=Number(params.version);
 if(!supportedSavedPreview(params.record))notFound();
 const document=await savedContentPreview(params.record,version);
 if(!document)notFound();
 return <ShopShell copyDocument={document.id===sharedCopyId?document:undefined} copyVersion={version}><SavedContentDocument document={document} version={version}/></ShopShell>;
}
