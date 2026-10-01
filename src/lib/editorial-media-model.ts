import {approvedPublicMedia,validMedia,type PublicMedia} from './public-media';
export const editorialIdPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const editorialWidths=[640,960,1600] as const;
export type EditorialMedia=PublicMedia&{editorial:{id:string;driveId:string;filename:string;sha256:string;bytes:number;width:number;height:number;format:'jpeg'|'png'|'webp';derivatives:{width:number;height:number;bytes:number;sha256:string}[];classification:'design-visualization'|'photography'|'unknown';reviewNote:string;reviewedBy?:string;reviewedAt?:string}};
export const editorialPath=(id:string)=>'/editorial/'+id;
export const isEditorialPath=(path:unknown):path is string=>typeof path==='string'&&path.startsWith('/editorial/')&&editorialIdPattern.test(path.slice(11));
export const allowedEditorialPath=(path:unknown)=>isEditorialPath(path)||approvedPublicMedia.some(m=>m.path===path);
const text=(v:unknown,max:number,required=true)=>typeof v==='string'&&v.length<=max&&(!required||!!v.trim())&&!/[<>]/.test(v);
const hash=(v:unknown)=>typeof v==='string'&&/^[a-f0-9]{64}$/.test(v);
/** Structure alone is not publication permission: callers must read the published DB column. */
export function validEditorialMedia(value:unknown):value is EditorialMedia{
 try{const m=value as EditorialMedia,e=m.editorial;return !!e&&isEditorialPath(m.path)&&m.path===editorialPath(e.id)&&text(m.alt,180)&&text(m.caption,180,false)&&text(m.provenance,500)&&Array.isArray(m.products)&&m.products.length===0&&[m.focalX,m.focalY].every(n=>Number.isFinite(n)&&n>=0&&n<=100)&&/^[A-Za-z0-9_-]{10,100}$/.test(e.driveId)&&text(e.filename,180)&&hash(e.sha256)&&Number.isInteger(e.bytes)&&e.bytes>0&&e.bytes<=4*1024*1024&&[e.width,e.height].every(n=>Number.isInteger(n)&&n>=320&&n<=12000)&&e.width*e.height<=20000000&&['jpeg','png','webp'].includes(e.format)&&['design-visualization','photography','unknown'].includes(e.classification)&&text(e.reviewNote,1000,false)&&Array.isArray(e.derivatives)&&e.derivatives.length===3&&e.derivatives.every((d,i)=>d.width===Math.min(editorialWidths[i],e.width)&&Number.isInteger(d.height)&&d.height>0&&d.bytes>0&&d.bytes<=600000&&hash(d.sha256))&&(!e.reviewedBy||text(e.reviewedBy,100))&&(!e.reviewedAt||Number.isFinite(Date.parse(e.reviewedAt)));}catch{return false;}
}
export const validPublishedEditorialMedia=(value:unknown):value is EditorialMedia=>validEditorialMedia(value)&&value.editorial.classification!=='unknown'&&value.editorial.reviewNote.trim().length>=20&&!!value.editorial.reviewedBy&&!!value.editorial.reviewedAt;
export const validPageMedia=(value:unknown):value is PublicMedia=>validMedia(value)||validPublishedEditorialMedia(value);
