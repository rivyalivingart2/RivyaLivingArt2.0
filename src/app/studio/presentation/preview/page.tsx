import {requireStudioSession} from '@/lib/studio-auth';
import Link from 'next/link';
import {savedPresentation} from '@/lib/presentation-store';
import {presentationPreviewHref} from '@/lib/presentation-model';
import {localizeContent} from '@/lib/content-model';
import {isLocale} from '@/lib/site-settings-model';
import {publishedCopy} from '@/lib/published-copy';
import {ShopShell} from '@/components/shop/shop-shell';
import {HomepageDocument} from '@/components/shop/homepage-document';
import {SavedPreviewFrame} from '@/components/studio/saved-preview-frame';
import s from '../../preview/preview.module.css';
export const dynamic='force-dynamic';
export const metadata={title:'Saved homepage design',robots:{index:false,follow:false,noarchive:true}};
export default async function PresentationPreview({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 await requireStudioSession();
 const params=await searchParams,version=Number(params.version),mobile=params.viewport==='mobile',frame=params.frame==='1';
 const locale=typeof params.locale==='string'&&isLocale(params.locale)&&['en','hi','gu'].includes(params.locale)?params.locale:'en';
 let saved;try{saved=await savedPresentation(version);}catch{return <main id="main-content" className={s.message}><h1>Preview is unavailable</h1><p>Your saved draft is unchanged.</p><a href={presentationPreviewHref(version,locale,mobile)}>Retry preview</a><Link href="/studio/sections">Return to editing</Link></main>;}
 if(!saved)return <main id="main-content" className={s.message}><h1>Choose an available saved design</h1><p>Save a draft, then open its exact revision.</p><Link href="/studio/sections">Return to editing</Link></main>;
 const content=<ShopShell previewLocale={locale}><div lang={locale}><HomepageDocument document={localizeContent(saved.home,locale)} revision={saved.homeVersion} presentation={{layout:saved.layout,version}} locale={locale} copy={(await publishedCopy(locale)).values}/></div></ShopShell>;
 if(frame)return content;
 return <><header className={s.banner}><div><strong>Saved design preview · {version}</strong><p>Captured homepage revision {saved.homeVersion}. This private preview does not publish changes.</p><p>Text, products, image choices and crops are fixed. Navigation and business contacts remain current.</p></div><nav aria-label="Preview controls"><Link href="/studio/sections">Return to editor</Link><a href={presentationPreviewHref(version,locale)} aria-current={!mobile?'page':undefined}>Full width</a><a href={presentationPreviewHref(version,locale,true)} aria-current={mobile?'page':undefined}>Mobile screen</a></nav></header>{!!saved.home.homeSnapshot?.issues.length&&<aside className={s.message}><h2>Publication needs attention</h2><ul>{saved.home.homeSnapshot.issues.map(issue=><li key={issue}>{issue}</li>)}</ul></aside>}{mobile?<main id="main-content" className={s.mobile}><SavedPreviewFrame revision={version} marker="data-presentation-revision" href={'/studio/presentation/preview/frame?'+new URLSearchParams({version:String(version),locale})}/></main>:content}</>;
}
