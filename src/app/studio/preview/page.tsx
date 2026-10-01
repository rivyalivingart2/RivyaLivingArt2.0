import {requireStudioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {baselineContent,validContent} from '@/lib/content-model';
import {homeId,previewHref} from '@/lib/homepage-model';
import {HomepageDocument} from '@/components/shop/homepage-document';
import {ShopShell} from '@/components/shop/shop-shell';
import {SavedPreviewFrame} from '@/components/studio/saved-preview-frame';
import s from './preview.module.css';
export const dynamic='force-dynamic';
export const metadata={title:'Saved homepage preview',robots:{index:false,follow:false,noarchive:true}};
export default async function SavedPreview({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 await requireStudioSession();
 const params=await searchParams,version=Number(params.version),mobile=params.viewport==='mobile';
 const back='/studio/content?record='+encodeURIComponent(homeId);
 if(params.record!==homeId||!Number.isSafeInteger(version)||version<1)return <main id="main-content" className={s.message}><h1>Choose a saved homepage revision</h1><p>Save a draft, then open its preview from Pages.</p><a href={back}>Return to homepage editing</a></main>;
 let document;
 try{
  const rows=await studioDb()`SELECT document FROM rivya_revisions WHERE kind='content' AND entity_key=${homeId} AND version=${version}`;
  document=rows[0]?.document;
 }catch{return <main id="main-content" className={s.message}><h1>Preview is unavailable</h1><p>Your saved draft is unchanged.</p><a href={previewHref(homeId,version,mobile)}>Retry preview</a><a href={back}>Return to homepage editing</a></main>;}
 if(!document||!validContent(document,baselineContent.find(d=>d.id===homeId))||!document.homeSnapshot)return <main id="main-content" className={s.message}><h1>This revision cannot be previewed</h1><p>Save the homepage again to capture its content and published references.</p><a href={back}>Return to homepage editing</a></main>;
 return <><header className={s.banner}><div><strong>Saved revision preview · {version}</strong><p>Private preview. This page does not publish changes.</p></div><nav aria-label="Preview controls"><a href={back}>Return to editor</a><a aria-current={!mobile?'page':undefined} href={previewHref(homeId,version)}>Full width</a><a aria-current={mobile?'page':undefined} href={previewHref(homeId,version,true)}>Mobile screen</a></nav></header>{document.homeSnapshot.issues.length>0&&<aside className={s.message}><h2>Publication needs attention</h2><ul>{document.homeSnapshot.issues.map((issue:string)=><li key={issue}>{issue}</li>)}</ul></aside>}{mobile?<main id="main-content" tabIndex={-1} className={s.mobile}><SavedPreviewFrame revision={version} href={'/studio/preview/frame?'+new URLSearchParams({record:homeId,version:String(version)})}/></main>:<ShopShell><HomepageDocument document={document} revision={version}/></ShopShell>}</>;
}
