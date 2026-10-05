import 'server-only';
import {isDiscoveryRoute} from './detailed-pages';
import {CollectionDocument} from '@/components/shop/collection-document';
import {studioDb} from './studio-db';
import {baselineContent,validContent,type ContentDocument} from './content-model';
import {homeId} from './homepage-model';
import {publishedContent} from './published-content';
import {HomepageDocument} from '@/components/shop/homepage-document';
import {EditorialDocument,JournalDocument} from '@/components/shop/editorial';
import {publishedMedia} from './published-media';
import {sharedCopyId} from './shared-copy-model';
import {publishedCopy} from './published-copy';
import {supportedSavedPreview} from './content-preview-model';
export {supportedSavedPreview} from './content-preview-model';
export async function savedContentPreview(record:string,version:number):Promise<ContentDocument|null>{
 if(!supportedSavedPreview(record)||!Number.isSafeInteger(version)||version<1)return null;
 const rows=await studioDb()`SELECT document FROM rivya_revisions WHERE kind='content' AND entity_key=${record} AND version=${version}`;
 const document=rows[0]?.document;
 if(!document||document.id!==record||!validContent(document,baselineContent.find(d=>d.id===record))||(record===homeId&&!document.homeSnapshot))return null;
 return document;
}
export async function SavedContentDocument({document,version}:{document:ContentDocument;version:number}){
 if(document.id===sharedCopyId)return <section data-saved-content-revision={version} style={{padding:40}}><h1>Shared website copy</h1><p>Inspect the actual navigation, search dialog and footer around this preview. Contact values remain current published settings.</p></section>;
 if(document.id===homeId)return <HomepageDocument document={document} revision={version} copy={(await publishedCopy()).values}/>;
 if(document.route==='/journal'&&document.pageSnapshot)return <div data-saved-content-revision={version}><JournalDocument content={{...document,publishedRevision:version}}/></div>;
 if(isDiscoveryRoute(document.route)&&document.pageSnapshot)return <div data-saved-content-revision={version}><CollectionDocument document={{...document,publishedRevision:version}}/></div>;
 if(document.pageSnapshot)return <div data-saved-content-revision={version}><EditorialDocument content={{...document,publishedRevision:version,image:document.pageSnapshot.image?.path,imageAlt:document.pageSnapshot.image?.alt,imagePosition:document.pageSnapshot.image?.position}} documents={document.pageSnapshot.articles.map(a=>({...a,kind:'article'}))} snapshot={document.pageSnapshot}/></div>;
 const [documents,images]=await Promise.all([publishedContent(),publishedMedia()]);
 const image=document.image?images.get(document.image):undefined;
 const content={...document,image:image?.path,imageAlt:image?(document.imageAlt||image.alt):undefined,imagePosition:image?image.focalX+'% '+image.focalY+'%':undefined};
 return <div data-saved-content-revision={version}><EditorialDocument content={content} documents={documents}/></div>;
}
