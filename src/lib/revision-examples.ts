import {getContentDocument} from './studio-content-data';
import {textToRichText} from './content-richtext';
export const revisionExamples = Array.from({length:12},(_,i)=>{
 const id=`DB${String(i+1).padStart(3,'0')}`,current=getContentDocument(id)!;
 const body=current.body.content||[];
 return {id,revisions:[
 {revision:1,label:'Opening direction; related objects still under review',at:'2026-09-18T09:00:00Z',document:{...current,body:{...current.body,content:body.slice(0,Math.max(2,Math.floor(body.length/2)))},relatedProductIds:[],summary:'Working opening: '+current.summary}},
 {revision:2,label:'Complete body and specific product references added',at:'2026-09-19T09:00:00Z',document:{...current,seoDescription:'',summary:current.summary}},
 {revision:3,label:'Editorial summary and discovery description reviewed',at:'2026-09-20T09:00:00Z',document:current}
 ]};
});
