import {sharedCopyId} from '@/lib/shared-copy-model';
import {requireStudioSession} from '@/lib/studio-auth';
import {savedContentPreview,SavedContentDocument,supportedSavedPreview} from '@/lib/saved-content-preview';
import {previewHref} from '@/lib/homepage-model';
import {ShopShell} from '@/components/shop/shop-shell';
import {SavedPreviewFrame} from '@/components/studio/saved-preview-frame';
import s from './preview.module.css';
export const dynamic='force-dynamic';
export const metadata={title:'Saved page preview',robots:{index:false,follow:false,noarchive:true}};
export default async function SavedPreview({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 await requireStudioSession();
 const params=await searchParams,version=Number(params.version),mobile=params.viewport==='mobile';
 const record=supportedSavedPreview(params.record)?params.record:null;
 const back=record?'/studio/content?record='+encodeURIComponent(record):'/studio/content';
 if(!record||!Number.isSafeInteger(version)||version<1)return <main id="main-content" className={s.message}><h1>Choose a saved page revision</h1><p>Save a draft, then open its preview from Pages.</p><a href={back}>Return to editing</a></main>;
 let document;
 try{
  document=await savedContentPreview(record,version);
 }catch{return <main id="main-content" className={s.message}><h1>Preview is unavailable</h1><p>Your saved draft is unchanged.</p><a href={previewHref(record,version,mobile)}>Retry preview</a><a href={back}>Return to editing</a></main>;}
 if(!document)return <main id="main-content" className={s.message}><h1>This revision cannot be previewed</h1><p>Open the saved record and choose an available revision.</p><a href={back}>Return to editing</a></main>;
 return <><header className={s.banner}><div><strong>Saved revision preview · {version}</strong><p>Private preview. This page does not publish changes.</p>{!document.homepage&&<p>{document.pageSnapshot?'Saved text, media and related references. Navigation and business contacts remain current.':'Historical text-only revision: current published media and related content. Save a new draft for fixed dependencies.'}</p>}</div><nav aria-label="Preview controls"><a href={back}>Return to editor</a><a aria-current={!mobile?'page':undefined} href={previewHref(record,version)}>Full width</a><a aria-current={mobile?'page':undefined} href={previewHref(record,version,true)}>Mobile screen</a></nav></header>{!!(document.homeSnapshot||document.pageSnapshot)?.issues.length&&<aside className={s.message}><h2>Publication needs attention</h2><ul>{(document.homeSnapshot||document.pageSnapshot)!.issues.map((issue:string)=><li key={issue}>{issue}</li>)}</ul></aside>}{mobile?<main id="main-content" tabIndex={-1} className={s.mobile}><SavedPreviewFrame revision={version} href={'/studio/preview/frame?'+new URLSearchParams({record,version:String(version)})}/></main>:<ShopShell copyDocument={document.id===sharedCopyId?document:undefined} copyVersion={version}><SavedContentDocument document={document} version={version}/></ShopShell>}</>;
}
