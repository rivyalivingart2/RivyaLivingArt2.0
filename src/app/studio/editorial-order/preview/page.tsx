import previewStyle from '../../preview/preview.module.css';
import {SavedPreviewFrame} from '@/components/studio/saved-preview-frame';
import Link from 'next/link';
import {requireStudioSession} from '@/lib/studio-auth';
import {savedOrder} from '@/lib/editorial-order-store';
import {selectedItems} from '@/lib/editorial-order';
import {EditorialEntryCard} from '@/components/shop/editorial-entry-card';
import {notFound} from 'next/navigation';
import s from '@/components/shop/migration-public.module.css';
export const dynamic='force-dynamic';
export default async function Preview({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}){
 await requireStudioSession();const params=await searchParams,version=Number(params.version);
 if(!params.scope||!Number.isSafeInteger(version)||version<1)notFound();
 const document=await savedOrder(params.scope,version);if(!document)notFound();
 if(params.viewport==='mobile')return <main id="main-content" className={previewStyle.mobile} style={{maxWidth:430,margin:'24px auto',padding:20}}><h1>Saved phone order · Revision {version}</h1><Link href="/studio/editorial-order">Return to ordering</Link><SavedPreviewFrame marker="data-order-preview-version" revision={version} href={'/studio/editorial-order/preview/frame?'+new URLSearchParams({scope:params.scope,version:String(version)})}/></main>;
 return <main id="main-content" style={{maxWidth:1200,margin:'24px auto',padding:20}} data-order-preview-version={version}><header><p>Private saved ordering preview · Revision {version}</p><h1 style={{fontSize:36,margin:'16px 0'}}>{document.scope.label}</h1><p>Saved record titles, text, media and crops. Public pages use this order with current published records; withdrawn records disappear.</p><Link href="/studio/editorial-order">Return to ordering</Link></header><div className={s.entries}>{selectedItems(document.entries,document.ids).map(entry=><div key={entry.id} data-order-id={entry.id}>{document.scope.key==='faq:groups'?<h2>{entry.title}</h2>:<EditorialEntryCard entry={entry}/>}</div>)}</div>{!document.ids.length&&<p>No records selected for this placement.</p>}</main>;
}
