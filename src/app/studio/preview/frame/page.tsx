import {requireStudioSession} from '@/lib/studio-auth';
import {studioDb} from '@/lib/studio-db';
import {baselineContent,validContent} from '@/lib/content-model';
import {homeId} from '@/lib/homepage-model';
import {HomepageDocument} from '@/components/shop/homepage-document';
import {ShopShell} from '@/components/shop/shop-shell';
import {notFound} from 'next/navigation';
export const dynamic='force-dynamic';
export default async function PreviewFrame({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 await requireStudioSession();
 const params=await searchParams,version=Number(params.version);
 if(params.record!==homeId||!Number.isSafeInteger(version)||version<1)notFound();
 const rows=await studioDb()`SELECT document FROM rivya_revisions WHERE kind='content' AND entity_key=${homeId} AND version=${version}`;
 const document=rows[0]?.document;
 if(!document||!validContent(document,baselineContent.find(d=>d.id===homeId))||!document.homeSnapshot)notFound();
 return <ShopShell><HomepageDocument document={document} revision={version}/></ShopShell>;
}
