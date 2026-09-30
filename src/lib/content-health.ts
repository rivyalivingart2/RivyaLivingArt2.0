import type {ContentDocument} from './content-model';
import type {ShopProduct} from './shop-model';
import type {PublicMedia} from './public-media';
import {studioRecordHref} from './studio-record-links';

export type ContentHealthEntry={document:ContentDocument;published:ContentDocument|null;visible:boolean;version:number};
export type ProductHealthEntry={product:ShopProduct;published:ShopProduct|null;visible:boolean;hasDraft:boolean;version:number};
export type MediaHealthEntry={media:PublicMedia;published:PublicMedia|null;version:number};
export type PublicationState='Published'|'Hidden'|'Unpublished';
export type HealthRow={id:string;area:'Content'|'Catalogue'|'Media';name:string;publication:PublicationState;readiness:'Needs review'|'No issues flagged';draft:'Source candidate'|'Unpublished draft'|'Changes pending'|'Aligned';detail:string;href:string};
// JSON records may have equivalent keys in different orders after JSONB round trips.
function canonical(value:unknown):string {
 if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
 if(value&&typeof value==='object')return '{'+Object.entries(value).filter(([,v])=>v!==undefined).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>JSON.stringify(k)+':'+canonical(v)).join(',')+'}';
 return JSON.stringify(value)??'null';
}
export function publicationState(published:unknown,visible=true):PublicationState {return !published?'Unpublished':visible?'Published':'Hidden';}
export function draftState(draft:unknown,published:unknown,version:number):HealthRow['draft'] {
 return !published?version?'Unpublished draft':'Source candidate':canonical(draft)!==canonical(published)?'Changes pending':'Aligned';
}
export function contentHealthRows(content:ContentHealthEntry[],products:ProductHealthEntry[],media:MediaHealthEntry[]):HealthRow[] {
 const rows:HealthRow[]=[];
 for(const e of content){
  const d=e.document,notes:{text:string;field:string}[]=[];
  if(!d.title.trim()||d.title.length>65)notes.push({text:!d.title.trim()?'Missing title':'Long title',field:'title'});
  if(d.description.length<70||d.description.length>180)notes.push({text:d.description.length<70?'Short search description':'Long search description',field:'description'});
  if(d.image&&!d.imageAlt?.trim())notes.push({text:'Missing image description',field:'imageAlt'});
  if(e.visible&&!e.published)notes.push({text:'Visibility is set without a published revision',field:'title'});
  rows.push({id:d.id,area:'Content',name:d.title,publication:publicationState(e.published,e.visible),readiness:notes.length?'Needs review':'No issues flagged',draft:draftState(d,e.published,e.version),detail:notes.map(n=>n.text).join(' · ')||'No editorial issues flagged; review the page before publishing.',href:studioRecordHref('content',d.id,notes[0]?.field)});
 }
 for(const e of products){
  const p=e.product,notes:{text:string;field:string}[]=[];
  for(const [field,text] of [['name','Missing name'],['subtitle','Missing subtitle'],['story','Missing story'],['image','Missing primary image']] as const)if(!p[field].trim())notes.push({text,field});
  if(e.visible&&!e.published)notes.push({text:'Visibility is set without a published revision',field:'name'});
  rows.push({id:p.id,area:'Catalogue',name:p.name||p.id,publication:publicationState(e.published,e.visible),readiness:notes.length?'Needs review':'No issues flagged',draft:draftState(p,e.published,e.version),detail:notes.map(n=>n.text).join(' · ')||'No required copy or primary-image gaps flagged.',href:studioRecordHref('products',p.id,notes[0]?.field)});
 }
 for(const e of media){
  const m=e.media,missing=!m.alt.trim();
  rows.push({id:m.path,area:'Media',name:m.alt||m.path,publication:publicationState(e.published),readiness:missing?'Needs review':'No issues flagged',draft:draftState(m,e.published,e.version),detail:missing?'Missing image description':m.products.length?'Metadata check only; page placement and crop still need visual review.':'No product association. This may be intentional for editorial media; review its page usage.',href:studioRecordHref('media',m.path,'alt')});
 }
 return rows;
}
