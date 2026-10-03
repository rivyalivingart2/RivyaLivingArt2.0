import {sharedCopyId} from '@/lib/shared-copy-model';
import {requireStudioSession} from '@/lib/studio-auth';
import {savedContentPreview,SavedContentDocument,supportedSavedPreview} from '@/lib/saved-content-preview';
import {ShopShell} from '@/components/shop/shop-shell';
import {notFound} from 'next/navigation';
import {localizeContent} from '@/lib/content-model';
import {isLocale} from '@/lib/site-settings-model';
export const dynamic='force-dynamic';
export default async function PreviewFrame({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 await requireStudioSession();
 const params=await searchParams,version=Number(params.version);
 if(!supportedSavedPreview(params.record))notFound();
 const document=await savedContentPreview(params.record,version);
 if(!document)notFound();
 const locale=typeof params.locale==='string'&&isLocale(params.locale)&&['en','hi','gu'].includes(params.locale)?params.locale:'en';
 return <ShopShell previewLocale={locale} copyDocument={document.id===sharedCopyId?document:undefined} copyVersion={version}><div lang={locale}><SavedContentDocument document={localizeContent(document,locale)} version={version}/></div></ShopShell>;
}
