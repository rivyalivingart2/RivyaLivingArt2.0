import {requireStudioSession} from '@/lib/studio-auth';
import Link from 'next/link';
import {savedPresentation} from '@/lib/presentation-store';
import {presentationPreviewHref} from '@/lib/presentation-model';
import {referenceSectionStates} from '@/lib/home-reference-model';
import {isDesignPageRoute} from '@/lib/page-design-model';
import {isDiscoveryRoute} from '@/lib/detailed-pages';
import {localizeContent} from '@/lib/content-model';
import {isLocale} from '@/lib/site-settings-model';
import {publishedCopy} from '@/lib/published-copy';
import {ShopShell} from '@/components/shop/shop-shell';
import {HomepageDocument} from '@/components/shop/homepage-document';
import {EditorialDocument} from '@/components/shop/editorial';
import {CollectionDocument} from '@/components/shop/collection-document';
import {WorkshopTemplatePreview} from '@/components/studio/workshop-template-preview';
import {SavedPreviewFrame} from '@/components/studio/saved-preview-frame';
import s from '../../preview/preview.module.css';
export const dynamic='force-dynamic';
export const metadata={title:'Saved page design',robots:{index:false,follow:false,noarchive:true}};
export default async function PresentationPreview({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 await requireStudioSession();
 const params=await searchParams,version=Number(params.version),mobile=params.viewport==='mobile',frame=params.frame==='1';
 const page=typeof params.page==='string'?params.page:'/';
 const locale=typeof params.locale==='string'&&isLocale(params.locale)&&['en','hi','gu'].includes(params.locale)?params.locale:'en';
 let saved;try{saved=await savedPresentation(version);}catch{return <main id="main-content" className={s.message}><h1>Preview is unavailable</h1><p>Your saved draft is unchanged.</p><a href={presentationPreviewHref(version,locale,mobile,page)}>Retry preview</a><Link href="/studio/sections">Return to editing</Link></main>;}
 const captured=page==='/'?undefined:saved?.reference?.pages.find(p=>p.document.route===page);
 const design=isDesignPageRoute(page)?saved?.layout.pages?.[page]:undefined;
 const workshop=page==='/workshops'?saved?.layout.serviceTemplates?.workshops:undefined;
 if(!saved||(page!=='/'&&!workshop&&(!design||!captured)))return <main id="main-content" className={s.message}><h1>Choose an available saved design</h1><p>Save this page’s design, then open its exact revision.</p><Link href="/studio/sections">Return to editing</Link></main>;
 const capturedPage=captured?{...localizeContent(captured.document,locale),publishedRevision:captured.version,image:captured.document.pageSnapshot?.image?.path,imageAlt:captured.document.pageSnapshot?.image?.alt,imagePosition:captured.document.pageSnapshot?.image?.position}:undefined;
 const rendered=workshop?<WorkshopTemplatePreview design={workshop} version={version}/>:capturedPage&&design?(isDiscoveryRoute(page)?<CollectionDocument document={capturedPage} design={design} designVersion={version}/>:<EditorialDocument content={capturedPage} documents={[]} design={design} designVersion={version} reference={saved.reference} locale={locale} film={design.film?saved.media?.[0]:undefined}/>):<HomepageDocument document={localizeContent(saved.home,locale)} revision={saved.homeVersion} presentation={{layout:saved.layout,version}} reference={saved.reference} locale={locale} film={saved.layout.film?saved.media?.[0]:undefined} copy={(await publishedCopy(locale)).values}/>;
 const content=<ShopShell previewLocale={locale}><div lang={locale}>{rendered}</div></ShopShell>;
 const waiting=page==='/'&&saved.layout.composition?referenceSectionStates(saved.home,saved.reference,saved.layout.composition).filter(s=>s.enabled&&!s.ready):[];
 const issues=[...saved.home.homeSnapshot?.issues||[],...saved.reference?.issues||[]];
 if(frame)return content;
 return <><header className={s.banner}><div><strong>Saved design preview · {version}</strong><p>{workshop?'Private workshop structure; current offering is unconfirmed.':<>Captured {page==='/'?'homepage':page} revision {captured?.version||saved.homeVersion}.</>} This private preview does not publish changes.</p><p>Text, products, image choices and crops are fixed. Navigation and business contacts remain current.</p></div><nav aria-label="Preview controls"><Link href="/studio/sections">Return to editor</Link><a href={presentationPreviewHref(version,locale,false,page)} aria-current={!mobile?'page':undefined}>Full width</a><a href={presentationPreviewHref(version,locale,true,page)} aria-current={mobile?'page':undefined}>Mobile screen</a></nav></header>{waiting.length>0&&<aside className={s.message}><h2>Sections waiting for content</h2><ul>{waiting.map(slot=><li key={slot.key}>{slot.label}: {slot.reason}</li>)}</ul></aside>}{issues.length>0&&<aside className={s.message}><h2>Publication needs attention</h2><ul>{issues.map(issue=><li key={issue}>{issue}</li>)}</ul></aside>}{mobile?<main id="main-content" className={s.mobile}><SavedPreviewFrame revision={version} marker="data-presentation-revision" href={'/studio/presentation/preview/frame?'+new URLSearchParams({version:String(version),locale,...(page!=='/'?{page}:{})})}/></main>:content}</>;
}
