import type {ContentDocument} from './content-model';
import type {HomeDependency} from './homepage-model';
import {validHomeComposition,type HomeComposition,type HomeReferenceSnapshot} from './home-reference-model';
import {validPageDesigns,type PageDesigns} from './page-design-model';
import {isMaterialFilm,type PresentationFilm} from './presentation-media';
import {validServiceTemplates,type ServiceTemplates} from './service-template-model';
export const homePresentationId='presentation:home';
/** Layout only. IDs, text, selections and media usages stay in their original stores. */
export type HomepageLayout={schemaVersion:1;hero:'cinematic'|'split';manifesto:'strip'|'statement';featured:'row'|'bento';composition?:HomeComposition;pages?:PageDesigns;film?:'resin-pour';serviceTemplates?:ServiceTemplates};
export const defaultHomepageLayout:HomepageLayout={schemaVersion:1,hero:'cinematic',manifesto:'strip',featured:'row'};
export type PresentationDocument={schemaVersion:1;id:typeof homePresentationId;layout:HomepageLayout;home:ContentDocument;homeVersion:number;dependencies:HomeDependency[];reference?:HomeReferenceSnapshot;media?:PresentationFilm[]};
export type PresentationEntry={document:PresentationDocument|null;version:number;publishedVersion:number;publishedLayout:HomepageLayout|null};
export type PresentationRevision={version:number;operation:string;createdAt:string;layout:HomepageLayout};
export function validHomepageLayout(value:unknown):value is HomepageLayout{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const d=value as Record<string,unknown>;
 return Object.keys(d).every(k=>['schemaVersion','hero','manifesto','featured','composition','pages','film','serviceTemplates'].includes(k))&&d.schemaVersion===1&&typeof d.hero==='string'&&['cinematic','split'].includes(d.hero)&&typeof d.manifesto==='string'&&['strip','statement'].includes(d.manifesto)&&typeof d.featured==='string'&&['row','bento'].includes(d.featured)&&(d.composition===undefined||validHomeComposition(d.composition))&&(d.pages===undefined||validPageDesigns(d.pages))&&(d.film===undefined||isMaterialFilm(d.film))&&(d.serviceTemplates===undefined||validServiceTemplates(d.serviceTemplates));
}
export function validPresentationChange(value:unknown):value is {operation:'draft'|'publish'|'restore';version:number;layout?:HomepageLayout;restoredFrom?:number}{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const d=value as Record<string,unknown>;
 if(!Number.isSafeInteger(d.version)||Number(d.version)<0||typeof d.operation!=='string'||!['draft','publish','restore'].includes(d.operation))return false;
 const keys=d.operation==='draft'?['operation','version','layout']:d.operation==='restore'?['operation','version','restoredFrom']:['operation','version'];
 if(Object.keys(d).length!==keys.length||!keys.every(k=>Object.hasOwn(d,k)))return false;
 return d.operation==='draft'?validHomepageLayout(d.layout):d.operation==='restore'?Number.isSafeInteger(d.restoredFrom)&&Number(d.restoredFrom)>0&&Number(d.restoredFrom)<=Number(d.version):Number(d.version)>0;
}
export function presentationPreviewHref(version:number,locale='en',mobile=false,page='/'){return '/studio/presentation/preview?'+new URLSearchParams({version:String(version),locale,...(mobile?{viewport:'mobile'}:{}),...(page!=='/'?{page}:{})});}
