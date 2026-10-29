import {isHostedEnvironment} from './hosting-environment';
export type OwnerCreation={index:number;category:string;image:string;large:string;small:string};
export const ownerImageSizes=[640,960,1600] as const;
export function ownerImageRoute(index:number,width:number){return `/api/local-creations/${String(index).padStart(3,'0')}/${width}`;}
export function localCreationAccess(env:NodeJS.ProcessEnv=process.env){
 return env.RIVYA_RESTORATION_LOCAL==='true'&&env.RIVYA_QA_TARGET==='exact-legacy-local'&&env.RIVYA_DATA_MODE==='isolated'&&env.DATABASE_URL==='postgresql://rivya_restoration_qa@localhost:55443/rivya_restoration_local'&&!isHostedEnvironment(env)&&!env.BLOB_READ_WRITE_TOKEN;
}
export function localCreationRequest(headers:Headers){
 const host='127.0.0.1:4210',origin=headers.get('origin');
 return headers.get('host')===host&&(!origin||origin==='http://'+host)&&headers.get('sec-fetch-site')!=='cross-site';
}
export function creationPage(images:OwnerCreation[],category:string,query:string,page:number){
 const q=query.trim().toLowerCase(),filtered=images.filter(r=>(!category||r.category===category)&&(!q||`${String(r.index).padStart(3,'0')} ${r.category}`.toLowerCase().includes(q)));
 const pages=Math.max(1,Math.ceil(filtered.length/12)),current=Math.max(1,Math.min(Number.isFinite(page)?Math.floor(page):1,pages));
 return {rows:filtered.slice((current-1)*12,current*12),total:filtered.length,page:current,pages};
}
