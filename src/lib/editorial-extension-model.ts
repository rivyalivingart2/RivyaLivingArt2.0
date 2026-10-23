import {validUsage,type EditorialUsage,usagePaths} from './homepage-model';
import {editorialIdPattern} from './editorial-media-model';

export type CategoryMetadata={schemaVersion:1;kind:'category';key:string;description:string;image?:EditorialUsage;seoTitle?:string;seoDescription?:string};
export type FileMetadata={schemaVersion:1;kind:'video'|'model';key:string;title:string;description:string;poster?:EditorialUsage;transcript:string;source:{driveId:string;filename:string;sha256:string;bytes:number;mime:'video/mp4'|'video/webm'|'model/gltf-binary'};classification:'unknown'|'photography'|'design-visualization';reviewNote:string;reviewedBy?:string;reviewedAt?:string};
export type EditorialExtension=CategoryMetadata|FileMetadata;
export type ExtensionKind=EditorialExtension['kind'];
export type ExtensionEntry={document:EditorialExtension;version:number;published:EditorialExtension|null};
export type FileUsage={kind:'video'|'model';key:string};
export type PublicFile=Pick<FileMetadata,'kind'|'key'|'title'|'description'|'poster'|'transcript'|'classification'>&{mime:FileMetadata['source']['mime']};
const clean=(v:unknown,max:number,required=false):v is string=>typeof v==='string'&&v.length<=max&&(!required||!!v.trim())&&!/[<>\u0000-\u0008]/.test(v);
export const validFileUsage=(v:FileUsage)=>!!v&&['video','model'].includes(v.kind)&&editorialIdPattern.test(v.key)&&Object.keys(v).every(k=>['kind','key'].includes(k));
export function validExtension(value:unknown):value is EditorialExtension{
 try{
  const d=value as EditorialExtension;
  if(!d||d.schemaVersion!==1||!['category','video','model'].includes(d.kind)||!clean(d.key,180,true)||!clean(d.description,2000))return false;
  if(d.kind==='category')return Object.keys(d).every(k=>['schemaVersion','kind','key','description','image','seoTitle','seoDescription'].includes(k))&&(!d.image||validUsage(d.image))&&(d.seoTitle===undefined||clean(d.seoTitle,120))&&(d.seoDescription===undefined||clean(d.seoDescription,300));
  if(Object.keys(d).some(k=>!['schemaVersion','kind','key','title','description','poster','transcript','source','classification','reviewNote','reviewedBy','reviewedAt'].includes(k)))return false;
  const s=d.source;
  return editorialIdPattern.test(d.key)&&clean(d.title,180,true)&&(!d.poster||validUsage(d.poster))&&clean(d.transcript,10000)&&!!s&&/^[A-Za-z0-9_-]{10,100}$/.test(s.driveId)&&clean(s.filename,180,true)&&!/[\\/]/.test(s.filename)&&/^[a-f0-9]{64}$/.test(s.sha256)&&Number.isSafeInteger(s.bytes)&&s.bytes>0&&s.bytes<=40*1024*1024&&(d.kind==='model'?s.mime==='model/gltf-binary':['video/mp4','video/webm'].includes(s.mime))&&['unknown','photography','design-visualization'].includes(d.classification)&&clean(d.reviewNote,1000)&&(!d.reviewedBy||clean(d.reviewedBy,100,true))&&(!d.reviewedAt||Number.isFinite(Date.parse(d.reviewedAt)));
 }catch{return false;}
}
export const extensionImagePaths=(d:EditorialExtension)=>{const image=d.kind==='category'?d.image:d.poster;return image?usagePaths(image):[];};
export function extensionPublicationIssues(d:EditorialExtension){
 if(d.kind==='category')return d.image?[]:['Select an approved category image before publishing.'];
 return [!d.poster?'Select an approved poster.':'',d.classification==='unknown'?'Review the media classification.':'',d.reviewNote.trim().length<20||!d.reviewedBy||!d.reviewedAt?'An administrator must review the source and permission.':'',d.kind==='video'&&!d.transcript.trim()?'Provide an accessible transcript or description of the silent film.':''].filter(Boolean);
}
export const publicFile=(d:FileMetadata):PublicFile=>({kind:d.kind,key:d.key,title:d.title,description:d.description,poster:d.poster,transcript:d.transcript,classification:d.classification,mime:d.source.mime});
