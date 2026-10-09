import type {ContentDocument} from './content-model';
import type {HomeDependency} from './homepage-model';
export const homePresentationId='presentation:home';
/** Layout only. IDs, text, selections and media usages stay in their original stores. */
export type HomepageLayout={schemaVersion:1;hero:'cinematic'|'split';manifesto:'strip'|'statement';featured:'row'|'bento'};
export const defaultHomepageLayout:HomepageLayout={schemaVersion:1,hero:'cinematic',manifesto:'strip',featured:'row'};
export type PresentationDocument={schemaVersion:1;id:typeof homePresentationId;layout:HomepageLayout;home:ContentDocument;homeVersion:number;dependencies:HomeDependency[]};
export type PresentationEntry={document:PresentationDocument|null;version:number;publishedVersion:number;publishedLayout:HomepageLayout|null};
export type PresentationRevision={version:number;operation:string;createdAt:string;layout:HomepageLayout};
export function validHomepageLayout(value:unknown):value is HomepageLayout{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const d=value as Record<string,unknown>;
 return Object.keys(d).length===4&&d.schemaVersion===1&&typeof d.hero==='string'&&['cinematic','split'].includes(d.hero)&&typeof d.manifesto==='string'&&['strip','statement'].includes(d.manifesto)&&typeof d.featured==='string'&&['row','bento'].includes(d.featured);
}
export function validPresentationChange(value:unknown):value is {operation:'draft'|'publish'|'restore';version:number;layout?:HomepageLayout;restoredFrom?:number}{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const d=value as Record<string,unknown>;
 if(!Number.isSafeInteger(d.version)||Number(d.version)<0||typeof d.operation!=='string'||!['draft','publish','restore'].includes(d.operation))return false;
 const keys=d.operation==='draft'?['operation','version','layout']:d.operation==='restore'?['operation','version','restoredFrom']:['operation','version'];
 if(Object.keys(d).length!==keys.length||!keys.every(k=>Object.hasOwn(d,k)))return false;
 return d.operation==='draft'?validHomepageLayout(d.layout):d.operation==='restore'?Number.isSafeInteger(d.restoredFrom)&&Number(d.restoredFrom)>0&&Number(d.restoredFrom)<=Number(d.version):Number(d.version)>0;
}
export function presentationPreviewHref(version:number,locale='en',mobile=false){return '/studio/presentation/preview?'+new URLSearchParams({version:String(version),locale,...(mobile?{viewport:'mobile'}:{})});}
