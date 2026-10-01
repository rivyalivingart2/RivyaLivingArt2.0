import 'server-only';
import {studioDb} from './studio-db';
import {baselineContent,validContent,type ContentDocument} from './content-model';
import {homeId} from './homepage-model';
import {publishedContent} from './published-content';
import {HomepageDocument} from '@/components/shop/homepage-document';
import {EditorialDocument} from '@/components/shop/editorial';

export function supportedSavedPreview(record:unknown):record is string{
 return record===homeId||record==='page:imprint';
}
export async function savedContentPreview(record:string,version:number):Promise<ContentDocument|null>{
 if(!supportedSavedPreview(record)||!Number.isSafeInteger(version)||version<1)return null;
 const rows=await studioDb()`SELECT document FROM rivya_revisions WHERE kind='content' AND entity_key=${record} AND version=${version}`;
 const document=rows[0]?.document;
 if(!document||document.id!==record||!validContent(document,baselineContent.find(d=>d.id===record))||(record===homeId&&!document.homeSnapshot))return null;
 return document;
}
export async function SavedContentDocument({document,version}:{document:ContentDocument;version:number}){
 return document.id===homeId?<HomepageDocument document={document} revision={version}/>:<div data-saved-content-revision={version}><EditorialDocument content={document} documents={await publishedContent()}/></div>;
}
